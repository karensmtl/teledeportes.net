const fsp = require('node:fs/promises');
const path = require('node:path');

const logger = require('../logger');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';

// Moves an uploaded image into thumbnails/<kind>/<id>.<ext> on the media volume.
// Returns the path RELATIVE to MEDIA_ROOT (served by nginx, composed at assemble).
async function saveThumbnail(file, kind, id) {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const rel = path.posix.join('thumbnails', kind, `${id}${ext}`);
    const abs = path.join(MEDIA_ROOT, rel);
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.rename(file.path, abs);
    return rel;
}

async function removeFileQuiet(relPath) {
    if (!relPath) return;
    try { await fsp.unlink(path.join(MEDIA_ROOT, relPath)); }
    catch (err) { logger.warn({ err: err.message, relPath }, 'thumbnail cleanup failed'); }
}

module.exports = { saveThumbnail, removeFileQuiet };
