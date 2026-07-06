// Builds the TSS 04 pagination object from a total count + limit/offset.
function paginate(total, limit, offset) {
    const safeLimit = Math.max(1, Number(limit) || 1);
    const safeOffset = Math.max(0, Number(offset) || 0);
    return {
        total,
        limit: safeLimit,
        offset: safeOffset,
        page: Math.floor(safeOffset / safeLimit) + 1,
        pages: Math.max(1, Math.ceil(total / safeLimit)),
    };
}

module.exports = { paginate };
