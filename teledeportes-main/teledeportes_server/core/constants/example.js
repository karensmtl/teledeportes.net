// Reference shape for file-level constants. Constants used in 1 file go at
// the top of that file. Constants shared across files live here, grouped by
// domain.
//
// STATUS values (TSS 03 [RIGID]):
//   0 = deleted (soft delete; hidden from default queries)
//   1 = inactive (visible but disabled)
//   2 = active (default)
// Projects may extend with values >= 5 for domain-specific lifecycle.

const STATUS = {
    DELETED:  0,
    INACTIVE: 1,
    ACTIVE:   2,
};

const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 500;

module.exports = {
    STATUS,
    DEFAULT_PAGE_LIMIT,
    MAX_PAGE_LIMIT,
};
