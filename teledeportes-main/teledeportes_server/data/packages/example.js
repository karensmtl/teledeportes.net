// Reference payload skeleton. Demonstrates the data/packages pattern.
// The package itself is a passive container — no DB, no business rules.
// Assemblers (services/assemblers/*) fill it via addX(...) setters and
// finalize with build(). Replace this file when your domain models exist.

class Example {
    constructor() {
        this.packaged = {
            id: null,
            name: null,
            description: null,
            related: [],
            stats: {},
        };
    }

    addExample(example) {
        if (!example) return;
        this.packaged.id = example.id;
        this.packaged.name = example.name;
        this.packaged.description = example.description;
    }

    addRelated(items) {
        this.packaged.related = (items || []).map(i => ({
            id: i.id,
            // shape relations into a digestible structure here
        }));
    }

    addStats(stats) {
        this.packaged.stats = stats || {};
    }

    build() {
        return this.packaged;
    }
}

module.exports = Example;
