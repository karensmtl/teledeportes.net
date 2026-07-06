// TSS 06 [RIGID]: production guard for any script that mutates schema or data.
function requireExplicitProdConfirm() {
    if (process.env.NODE_ENV !== 'production') return;
    if (process.env.SYNC_FORCE !== 'yes') {
        console.error('[guard] NODE_ENV=production. Set SYNC_FORCE=yes to proceed.');
        process.exit(1);
    }
}

module.exports = { requireExplicitProdConfirm };
