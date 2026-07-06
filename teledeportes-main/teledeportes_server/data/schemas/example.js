// Reference Joi schemas conformant to TSS 03.
// One file per entity. Exports { create, update }. Optional verb-specific
// schemas may be added (e.g., search, action) when the entity requires them.
const Joi = require('joi');

const create = Joi.object({
    name:            Joi.string().trim().min(1).max(120).required().messages({
        'any.required': 'El nombre es requerido',
        'string.empty': 'El nombre no puede estar vacío',
    }),
    description:     Joi.string().trim().allow(null, '').optional(),
    status:          Joi.number().integer().valid(0, 1, 2).default(2),
    remarks:         Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
    external_source: Joi.string().trim().allow(null, '').optional(),
    external_id:     Joi.string().trim().allow(null, '').optional(),
});

const update = Joi.object({
    id:              Joi.number().integer().required(),
    name:            Joi.string().trim().min(1).max(120).optional(),
    description:     Joi.string().trim().allow(null, '').optional(),
    status:          Joi.number().integer().valid(0, 1, 2).optional(),
    remarks:         Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
    external_source: Joi.string().trim().allow(null, '').optional(),
    external_id:     Joi.string().trim().allow(null, '').optional(),
});

module.exports = { create, update };
