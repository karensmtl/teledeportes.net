// Reference migration. Demonstrates the format consumed by scripts/migrate.js.
// Filename convention: <NNNN>-<slug>.js — alphabetical = chronological.
//
// Real migrations:
//   - go in this folder
//   - export `name` (default: filename) and async `up(queryInterface, sequelize)`
//   - are recorded in _meta_migrations on success
//   - are NEVER edited after applied; ship a new file to correct mistakes
//
// scripts/migrate.js does NOT call `down`. Treat schema as forward-only.
// A `down` may be present for sequelize-cli scaffolding compatibility but
// will be ignored by our runner.

module.exports = {
    name: '0001-bootstrap-example',

    async up(queryInterface, _sequelize) {
        // Example: add a column to an existing table.
        // const { DataTypes } = _sequelize;
        // await queryInterface.addColumn('users', 'phone', {
        //     type: DataTypes.STRING(40),
        //     allowNull: true,
        // });
        //
        // Example: backfill data after a schema change.
        // await _sequelize.query(`UPDATE users SET phone = NULL WHERE phone = ''`);

        // This file is a placeholder so the runner has an example to read.
        // Delete it once you ship your first real migration.
    },

    async down(_queryInterface, _sequelize) {
        // Not used by our runner. Present only for sequelize-cli compatibility.
    },
};
