// Joi schemas for User. TSS 03 [RIGID]: validation lives next to the entity.
// Exports: create, update, login, change_password.
// Password rules are tunable per project; the floor here is 10 chars.
const Joi = require('joi');

const { ROLES } = require('../models/user/user');

const password = Joi.string().min(10).max(100).messages({
    'string.min': 'La contraseña debe tener al menos 10 caracteres',
    'string.empty': 'La contraseña no puede estar vacía',
});

const create = Joi.object({
    email:    Joi.string().trim().lowercase().email().max(180).required().messages({
        'string.email': 'El correo no es válido',
        'any.required': 'El correo es requerido',
    }),
    name:     Joi.string().trim().min(1).max(120).required(),
    password: password.required(),
    role:     Joi.string().valid(...ROLES).default('owner'),
    status:   Joi.number().integer().valid(0, 1, 2).default(2),
    remarks:  Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
    external_source: Joi.string().trim().allow(null, '').optional(),
    external_id:     Joi.string().trim().allow(null, '').optional(),
});

const update = Joi.object({
    id:      Joi.number().integer().required(),
    email:   Joi.string().trim().lowercase().email().max(180).optional(),
    name:    Joi.string().trim().min(1).max(120).optional(),
    role:    Joi.string().valid(...ROLES).optional(),
    status:  Joi.number().integer().valid(0, 1, 2).optional(),
    remarks: Joi.alternatives().try(Joi.string(), Joi.object()).allow(null).optional(),
    external_source: Joi.string().trim().allow(null, '').optional(),
    external_id:     Joi.string().trim().allow(null, '').optional(),
}).min(2);                 // id + at least one field to update

const login = Joi.object({
    email:    Joi.string().trim().lowercase().email().required().messages({
        'string.email': 'El correo no es válido',
        'any.required': 'El correo es requerido',
    }),
    password: Joi.string().min(1).required().messages({
        'any.required': 'La contraseña es requerida',
    }),
});

const change_password = Joi.object({
    current_password: Joi.string().min(1).required(),
    new_password:     password.required(),
});

module.exports = { create, update, login, change_password };
