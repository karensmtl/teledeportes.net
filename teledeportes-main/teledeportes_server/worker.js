const { Worker } = require('bullmq');

const { TRANSCODE_QUEUE, connection } = require('./core/queue');
const { sequelize, models } = require('./core/database');
const logger = require('./core/logger');
const { transcodeVideo } = require('./services/transcode/transcoder');

const CONCURRENCY = Number(process.env.TRANSCODE_CONCURRENCY) || 1;

async function processJob(job) {
    const { videoId } = job.data;
    const video = await models.Video.findByPk(videoId);
    if (!video) {
        logger.warn({ videoId }, 'video not found, skipping job');
        return;
    }
    if (!video.source_path) throw new Error('video has no source_path');

    await video.update({ processing_status: 'processing', error: null });
    try {
        const result = await transcodeVideo({ id: video.id, sourcePath: video.source_path });
        await video.update({
            processing_status: 'ready',
            hls_path:          result.hlsPath,
            thumbnail_path:    result.thumbnailPath,
            duration_seconds:  result.durationSeconds,
            width:             result.width,
            height:            result.height,
            error:             null,
        });
        logger.info({ videoId }, 'transcode complete');
    } catch (err) {
        await video.update({
            processing_status: 'failed',
            error: (err.message || 'transcode error').slice(0, 1000),
        });
        logger.error({ videoId, err: err.message }, 'transcode failed');
        throw err;   // surface to BullMQ for retry / failure bookkeeping
    }
}

const worker = new Worker(TRANSCODE_QUEUE, processJob, { connection, concurrency: CONCURRENCY });

worker.on('ready',  () => logger.info({ concurrency: CONCURRENCY }, 'transcode worker ready'));
worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err: err?.message }, 'job failed'));
worker.on('error',  err => logger.error({ err: err?.message }, 'worker error'));

async function shutdown(signal) {
    logger.info({ signal }, 'worker shutdown initiated');
    try {
        await worker.close();
        await connection.quit();
        await sequelize.close();
        process.exit(0);
    } catch (err) {
        logger.error({ err: err.message }, 'worker shutdown error');
        process.exit(1);
    }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', err => logger.error({ err: err?.message || String(err) }, 'worker unhandled rejection'));
