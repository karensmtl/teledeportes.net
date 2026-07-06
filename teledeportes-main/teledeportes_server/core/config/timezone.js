// TSS 06 [RIGID] / DAT-001: every project's active timezone.
// Default America/Bogota; override per project when deployed elsewhere
// (document in docs/deployment.md).
module.exports = {
    timezone: process.env.TZ || 'America/Bogota',
};
