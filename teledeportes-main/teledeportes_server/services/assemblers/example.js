// Reference assembler. Demonstrates: (1) the read-only contract,
// (2) parallel loading, (3) feeding a data/packages skeleton.
const { models } = require('../../core/database');

const ExamplePackage = require('../../data/packages/example');

class ExampleAssembler {
    constructor() {
        this.models = models;
    }

    async assembleById(id) {
        const example = new ExamplePackage();

        const found = await this.models.Example.findByPk(id, { raw: true });
        if (!found) return null;

        example.addExample(found);

        // Parallelize independent loads. The package's setters are passive —
        // each loader does its own work and pushes results into `example`.
        await Promise.all([
            this.#loadStats(found.id, example),
            this.#loadRelated(found.id, example),
        ]);

        return example.build();
    }

    async #loadStats(_id, pkg) {
        // Replace with real aggregation when domain models exist.
        pkg.addStats({ count: 0 });
    }

    async #loadRelated(_id, pkg) {
        // Replace with real cross-model fetch when relations exist.
        pkg.addRelated([]);
    }
}

module.exports = ExampleAssembler;
