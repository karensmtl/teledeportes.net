const Joi = require('joi');

const { NEWS_CATEGORIES } = require('../models/noticia/noticia');

// `create` validates the editorial payload. slug / status are server-set.
const create = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
        'any.required': 'El título es requerido',
        'string.empty': 'El título no puede estar vacío',
    }),
    category: Joi.string().valid(...NEWS_CATEGORIES).required().messages({
        'any.required': 'La categoría es requerida',
        'any.only': 'Categoría inválida',
    }),
    author: Joi.string().trim().min(1).max(120).required().messages({
        'any.required': 'El autor es requerido',
        'string.empty': 'El autor no puede estar vacío',
    }),
    summary: Joi.string().trim().min(1).required().messages({
        'any.required': 'El resumen es requerido',
        'string.empty': 'El resumen no puede estar vacío',
    }),
    body: Joi.string().trim().min(1).required().messages({
        'any.required': 'El cuerpo es requerido',
        'string.empty': 'El cuerpo no puede estar vacío',
    }),
    image_url: Joi.string().trim().max(1000).allow(null, '').optional(),
    reading_time: Joi.string().trim().max(20).allow(null, '').optional(),
    tags: Joi.array().items(Joi.string().trim().max(60)).optional(),
    related_ids: Joi.array().items(Joi.number().integer()).optional(),
    published_at: Joi.date().optional(),
});

const update = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().trim().min(1).max(200).optional(),
    category: Joi.string().valid(...NEWS_CATEGORIES).optional(),
    author: Joi.string().trim().min(1).max(120).optional(),
    summary: Joi.string().trim().min(1).optional(),
    body: Joi.string().trim().min(1).optional(),
    image_url: Joi.string().trim().max(1000).allow(null, '').optional(),
    reading_time: Joi.string().trim().max(20).allow(null, '').optional(),
    tags: Joi.array().items(Joi.string().trim().max(60)).optional(),
    related_ids: Joi.array().items(Joi.number().integer()).optional(),
    published_at: Joi.date().optional(),
    status: Joi.number().integer().valid(0, 1, 2).optional(),
}).min(2);

module.exports = { create, update };
