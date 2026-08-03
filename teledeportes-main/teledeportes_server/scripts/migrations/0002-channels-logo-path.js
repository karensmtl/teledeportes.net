// Adds the channel logo column: the brand mark shown instead of the channel
// name in the hero and in the /vivo cards. Stores a path relative to
// MEDIA_ROOT (logos/channel/<id>-<hash>.<ext>), like thumbnail_path.

module.exports = {
    name: '0002-channels-logo-path',

    async up(queryInterface, sequelize) {
        const { DataTypes } = sequelize.Sequelize;

        // Dev environments create the schema with `npm run sync:channels`
        // (sequelize sync --alter), so the column may already exist there.
        // Adding it twice throws; skip instead of failing the whole run.
        const table = await queryInterface.describeTable('channels');
        if (table.logo_path) return;

        await queryInterface.addColumn('channels', 'logo_path', {
            type: DataTypes.STRING(500),
            allowNull: true,
        });
    },

    async down(queryInterface, _sequelize) {
        // Not used by our runner (schema is forward-only). Present only for
        // sequelize-cli compatibility.
        await queryInterface.removeColumn('channels', 'logo_path');
    },
};
