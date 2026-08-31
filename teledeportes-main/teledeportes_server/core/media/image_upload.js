const crypto = require('node:crypto');
const fsp = require('node:fs/promises');
const path = require('node:path');

const multer = require('multer');
const boom = require('@hapi/boom');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';
const MAX_IMAGE_MB = Number(process.env.MEDIA_MAX_IMAGE_MB) || 8;
const MAX_LOGO_MB = Number(process.env.MEDIA_MAX_LOGO_MB) || 2;
const IMAGE_MIME = /^image\/(jpe?g|png|webp|avif)$/;
// Logos sit on top of video/artwork, so only alpha-capable formats are taken.
// JPEG is rejected on purpose — it would show as an opaque box over the hero.
const LOGO_MIME = /^image\/(png|webp|avif)$/;

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

function imageUploader(mime, maxMb, message) {
    return multer({
        storage,
        limits: { fileSize: maxMb * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            if (mime.test(file.mimetype)) return cb(null, true);
            cb(boom.badRequest(message));
        },
    });
}

const upload = imageUploader(IMAGE_MIME, MAX_IMAGE_MB, 'La imagen debe ser JPG, PNG, WEBP o AVIF');
const logoUpload = imageUploader(LOGO_MIME, MAX_LOGO_MB, 'El logo debe ser PNG, WEBP o AVIF (con transparencia)');

// Express middleware: parse a single image field, mapping multer errors to HTTP.
function singleField(uploader, field) {
    const mw = uploader.single(field);
    return (req, res, next) => mw(req, res, (err) => {
        if (!err) return next();
        if (err.isBoom) return next(err);
        if (err.code === 'LIMIT_FILE_SIZE') return next(boom.entityTooLarge('La imagen supera el tamaño máximo'));
        next(boom.badRequest(err.message || 'Error al subir la imagen'));
    });
}

const uploadImageSingle = (field) => singleField(upload, field);
const uploadLogoSingle = (field) => singleField(logoUpload, field);

module.exports = { uploadImageSingle, uploadLogoSingle };
