// Reference handler. Thin CRUD over a single model. Extends BaseHandler.
// Promote logic to a manager (services/managers/) when it grows transactions
// or touches more than one model.
const BaseHandler = require('./handler');

const { models } = require('../../core/database');
const exampleSchemas = require('../../data/schemas/example');

class ExampleHandler extends BaseHandler {
    constructor() {
        super(models.Example, exampleSchemas);
    }
}

module.exports = ExampleHandler;
