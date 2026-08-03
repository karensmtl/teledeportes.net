const crypto = require('node:crypto');
const fsp = require('node:fs/promises');
const path = require('node:path');

const logger = require('../logger');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';

// Moves an uploaded image into <dir>/<name>.<ext> on the media volume and
// returns the path RELATIVE to MEDIA_ROOT (served by nginx, composed at
// assemble time). `dir` is a posix subpath, e.g. 'thumbnails/channel'.
async function saveImage(file, dir, name) {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const rel = path.posix.join(dir, `${name}${ext}`);
    const abs = path.join(MEDIA_ROOT, rel);
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.rename(file.path, abs);
    return rel;
}

async function saveThumbnail(file, kind, id) {
    return saveImage(file, path.posix.join('thumbnails', kind), id);
}

// Logos get a random suffix so replacing one yields a new URL — CDN/browser
// caches would otherwise keep serving the previous mark from `<id>.<ext>`.
// The old file is deleted by the caller once the new path is stored.
async function saveLogo(file, kind, id) {
    const suffix = crypto.randomBytes(4).toString('hex');
    return saveImage(file, path.posix.join('logos', kind), `${id}-${suffix}`);
}

async function removeFileQuiet(relPath) {
    if (!relPath) return;
    try { await fsp.unlink(path.join(MEDIA_ROOT, relPath)); }
    catch (err) { logger.warn({ err: err.message, relPath }, 'thumbnail cleanup failed'); }
}

module.exports = { saveImage, saveThumbnail, saveLogo, removeFileQuiet };
