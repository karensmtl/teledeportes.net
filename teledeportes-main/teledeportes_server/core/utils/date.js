// TSS 06 [RIGID] / DAT-001: single entry point for constructing Date from
// a user-supplied string. Bare YYYY-MM-DD is treated as midnight in the
// project's primary timezone, not UTC.
//
// Construction of Date from raw user strings without parseLocalDate is
// forbidden. Code review rejects it.

function parseLocalDate(input) {
    if (input instanceof Date) return input;
    if (!input) return new Date();

    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}/.test(input)) {
        const [y, m, d] = input.split(/[-T]/);
        // Local-zone midnight, not UTC.
        return new Date(Number(y), Number(m) - 1, Number(d));
    }

    return new Date(input);
}

module.exports = { parseLocalDate };
