const Joi = require('joi');

// `create` validates the multipart metadata fields only — the file itself is
// handled by multer, and slug / paths / processing_status are server-set.

const create = Joi.object({
    title:       Joi.string().trim().min(1).max(200).required().messages({
        'any.required': 'El título es requerido',
        'string.empty': 'El título no puede estar vacío',
    }),
    category_id: Joi.number().integer().required().messages({
        'any.required': 'La categoría es requerida',
        'number.base':  'La categoría es requerida',
    }),
    description: Joi.string().trim().allow(null, '').optional(),
    remarks:     Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
});

const update = Joi.object({
    id:          Joi.number().integer().required(),
    title:       Joi.string().trim().min(1).max(200).optional(),
    description: Joi.string().trim().allow(null, '').optional(),
    category_id: Joi.number().integer().optional(),
    status:      Joi.number().integer().valid(0, 1, 2).optional(),
    remarks:     Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
}).min(2);

module.exports = { create, update };
