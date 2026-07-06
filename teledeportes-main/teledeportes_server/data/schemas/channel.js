const Joi = require('joi');

// slug + stream_key are generated server-side; is_on_air is operational state
// (set by the OME webhook or the dedicated on-air action), never via create/update.

// Accepts a stream URL of any browser-relevant kind: HLS (.m3u8, http/https),
// WebRTC/WHEP (http/https/ws/wss), or an RTMP ingest URL. Empty / null clears
// it. Lenient on the path so query-string manifests are allowed.
const externalHlsUrl = Joi.string().trim()
    .uri({ scheme: ['http', 'https', 'ws', 'wss', 'rtmp', 'rtmps'] })
    .max(1000).allow(null, '').messages({
        'string.uri':             'La URL del stream no es válida',
        'string.uriCustomScheme': 'La URL debe empezar por http(s)://, ws(s):// o rtmp(s)://',
    });

const create = Joi.object({
    name:        Joi.string().trim().min(1).max(150).required().messages({
        'any.required': 'El nombre es requerido',
        'string.empty': 'El nombre no puede estar vacío',
    }),
    description: Joi.string().trim().allow(null, '').optional(),
    external_hls_url: externalHlsUrl.optional(),
    sort_order:  Joi.number().integer().min(0).default(0),
    status:      Joi.number().integer().valid(0, 1, 2).default(2),
    remarks:     Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
});

const update = Joi.object({
    id:          Joi.number().integer().required(),
    name:        Joi.string().trim().min(1).max(150).optional(),
    description: Joi.string().trim().allow(null, '').optional(),
    external_hls_url: externalHlsUrl.optional(),
    sort_order:  Joi.number().integer().min(0).optional(),
    status:      Joi.number().integer().valid(0, 1, 2).optional(),
    remarks:     Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
}).min(2);

const on_air = Joi.object({
    on_air: Joi.boolean().required(),
});

module.exports = { create, update, on_air };
