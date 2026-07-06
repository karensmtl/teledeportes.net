const { spawn } = require('node:child_process');
const fsp = require('node:fs/promises');
const path = require('node:path');

const logger = require('../../core/logger');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';
const HLS_SEGMENT_SECONDS = 4;

// ABR ladder. Each rendition is only produced when the source is at least as
// tall (no upscaling), but the smallest is always kept so every video has a
// low-bandwidth variant.
const LADDER = [
    { name: '360p',  width: 640,  height: 360,  vBitrate: '800k',  maxrate: '856k',  bufsize: '1200k', aBitrate: '96k'  },
    { name: '720p',  width: 1280, height: 720,  vBitrate: '2800k', maxrate: '2996k', bufsize: '4200k', aBitrate: '128k' },
    { name: '1080p', width: 1920, height: 1080, vBitrate: '5000k', maxrate: '5350k', bufsize: '7500k', aBitrate: '128k' },
];

function run(cmd, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args);
        let stdout = '';
        let stderr = '';
        // ffprobe writes JSON to stdout; ffmpeg writes progress to stderr.
        child.stdout.on('data', d => { stdout += d.toString(); });
        child.stderr.on('data', d => { stderr += d.toString(); });
        child.on('error', reject);
        child.on('close', code => {
            if (code === 0) return resolve(stdout);
            // Keep only the tail — ffmpeg stderr is huge.
            reject(new Error(`${cmd} exited ${code}: ${stderr.slice(-600)}`));
        });
    });
}

async function probe(absSource) {
    const out = await run('ffprobe', [
        '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', absSource,
    ]);
    const meta = JSON.parse(out);
    const video = (meta.streams || []).find(s => s.codec_type === 'video');
    const hasAudio = (meta.streams || []).some(s => s.codec_type === 'audio');
    return {
        durationSeconds: meta.format?.duration ? Math.round(Number(meta.format.duration)) : null,
        width:  video?.width  ?? null,
        height: video?.height ?? null,
        hasAudio,
    };
}

function chooseLadder(sourceHeight) {
    if (!sourceHeight) return LADDER;
    const fit = LADDER.filter(r => r.height <= sourceHeight);
    return fit.length ? fit : [LADDER[0]];
}

function buildArgs(absSource, absHlsDir, ladder, hasAudio) {
    const split = ladder.map((_, i) => `[v${i}]`).join('');
    const scales = ladder
        .map((r, i) => `[v${i}]scale=w=${r.width}:h=${r.height}:force_original_aspect_ratio=decrease,pad=${r.width}:${r.height}:(ow-iw)/2:(oh-ih)/2[v${i}out]`)
        .join('; ');
    const filter = `[0:v]split=${ladder.length}${split}; ${scales}`;

    const args = ['-y', '-i', absSource, '-filter_complex', filter];

    ladder.forEach((r, i) => {
        args.push(
            '-map', `[v${i}out]`,
            `-c:v:${i}`, 'libx264', '-preset', 'veryfast', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
            `-b:v:${i}`, r.vBitrate, `-maxrate:v:${i}`, r.maxrate, `-bufsize:v:${i}`, r.bufsize,
            '-g', '48', '-keyint_min', '48', '-sc_threshold', '0',
        );
    });

    if (hasAudio) {
        ladder.forEach(() => args.push('-map', 'a:0'));
        args.push('-c:a', 'aac', '-b:a', '128k', '-ac', '2');
    }

    const varMap = ladder
        .map((_, i) => (hasAudio ? `v:${i},a:${i}` : `v:${i}`))
        .join(' ');

    args.push(
        '-f', 'hls',
        '-hls_time', String(HLS_SEGMENT_SECONDS),
        '-hls_playlist_type', 'vod',
        '-hls_flags', 'independent_segments',
        '-hls_segment_filename', path.join(absHlsDir, '%v', 'seg_%03d.ts'),
        '-master_pl_name', 'master.m3u8',
        '-var_stream_map', varMap,
        path.join(absHlsDir, '%v', 'playlist.m3u8'),
    );
    return args;
}

// Transcodes one video to HLS + thumbnail. Returns the metadata to persist.
// Paths returned are RELATIVE to MEDIA_ROOT (the DB never stores absolutes).
async function transcodeVideo({ id, sourcePath }) {
    const absSource = path.join(MEDIA_ROOT, sourcePath);
    const relHlsDir = path.posix.join('hls', String(id));
    const absHlsDir = path.join(MEDIA_ROOT, relHlsDir);

    await fsp.rm(absHlsDir, { recursive: true, force: true });
    await fsp.mkdir(absHlsDir, { recursive: true });
    for (let i = 0; i < LADDER.length; i += 1) {
        await fsp.mkdir(path.join(absHlsDir, String(i)), { recursive: true });
    }

    const info = await probe(absSource);
    const ladder = chooseLadder(info.height);
    logger.info({ id, height: info.height, renditions: ladder.map(r => r.name), hasAudio: info.hasAudio }, 'transcode start');

    await run('ffmpeg', buildArgs(absSource, absHlsDir, ladder, info.hasAudio));

    // Thumbnail from a frame a few seconds in (or mid-clip for short videos).
    const seek = Math.min(3, Math.max(0, Math.floor((info.durationSeconds || 2) / 2)));
    const relThumb = path.posix.join(relHlsDir, 'thumbnail.jpg');
    await run('ffmpeg', [
        '-y', '-ss', String(seek), '-i', absSource,
        '-frames:v', '1', '-vf', 'scale=640:-2', path.join(MEDIA_ROOT, relThumb),
    ]);

    return {
        hlsPath: path.posix.join(relHlsDir, 'master.m3u8'),
        thumbnailPath: relThumb,
        durationSeconds: info.durationSeconds,
        width: info.width,
        height: info.height,
    };
}

module.exports = { transcodeVideo, LADDER };
