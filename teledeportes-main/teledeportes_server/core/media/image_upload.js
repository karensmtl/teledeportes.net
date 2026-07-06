const crypto = require('node:crypto');
const fsp = require('node:fs/promises');
const path = require('node:path');

const multer = require('multer');
const boom = require('@hapi/boom');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';
const MAX_IMAGE_MB = Number(process.env.MEDIA_MAX_IMAGE_MB) || 8;
const IMAGE_MIME = /^image\/(jpe?g|png|webp|avif)$/;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(MEDIA_ROOT, 'tmp');
        fsp.mkdir(dir, { recursive: true }).then(() => cb(null, dir)).catch(cb);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `img-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (IMAGE_MIME.test(file.mimetype)) return cb(null, true);
        cb(boom.badRequest('La imagen debe ser JPG, PNG, WEBP o AVIF'));
    },
});

// Express middleware: parse a single image field, mapping multer errors to HTTP.
function uploadImageSingle(field) {
    const mw = upload.single(field);
    return (req, res, next) => mw(req, res, (err) => {
        if (!err) return next();
        if (err.isBoom) return next(err);
        if (err.code === 'LIMIT_FILE_SIZE') return next(boom.entityTooLarge('La imagen supera el tamaño máximo'));
        next(boom.badRequest(err.message || 'Error al subir la imagen'));
    });
}

module.exports = { uploadImageSingle };
