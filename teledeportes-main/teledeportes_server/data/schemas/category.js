const Joi = require('joi');

// slug is derived from `name` server-side (see CategoryHandler), never client-set.

const create = Joi.object({
    name:        Joi.string().trim().min(1).max(120).required().messages({
        'any.required': 'El nombre es requerido',
        'string.empty': 'El nombre no puede estar vacío',
    }),
    description: Joi.string().trim().allow(null, '').optional(),
    sort_order:  Joi.number().integer().min(0).default(0),
    status:      Joi.number().integer().valid(0, 1, 2).default(2),
    remarks:     Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
});

const update = Joi.object({
    id:          Joi.number().integer().required(),
    name:        Joi.string().trim().min(1).max(120).optional(),
    description: Joi.string().trim().allow(null, '').optional(),
    sort_order:  Joi.number().integer().min(0).optional(),
    status:      Joi.number().integer().valid(0, 1, 2).optional(),
    remarks:     Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
}).min(2);                  // id + at least one field to update

module.exports = { create, update };
