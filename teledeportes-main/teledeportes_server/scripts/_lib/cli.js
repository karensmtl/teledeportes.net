// TSS 06 [RIGID]: shared minimal arg parser for scripts.
// Supports --flag, --flag=value, --flag value, and positional args.
function parseArgs(argv = process.argv.slice(2)) {
    const flags = {};
    const positional = [];
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--')) {
            const eq = a.indexOf('=');
            if (eq !== -1) {
                flags[a.slice(2, eq)] = a.slice(eq + 1);
            } else {
                const next = argv[i + 1];
                if (!next || next.startsWith('--')) {
                    flags[a.slice(2)] = true;
                } else {
                    flags[a.slice(2)] = next;
                    i++;
                }
            }
        } else {
            positional.push(a);
        }
    }
    return { flags, positional };
}

function printUsageAndExit(name, lines) {
    console.log(`Usage: node scripts/${name}.js [args]`);
    for (const line of lines) console.log(`  ${line}`);
    console.log('  --dry-run     Preview changes, write nothing.');
    console.log('  --prune       Remove stale data not in source of truth.');
    console.log('  --force       Override prod guard (requires SYNC_FORCE=yes).');
    console.log('  --verbose     Enable SQL logging.');
    console.log('  --help        Print this and exit.');
    process.exit(0);
}

module.exports = { parseArgs, printUsageAndExit };
