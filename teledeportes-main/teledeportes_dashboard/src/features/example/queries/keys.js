// TSS vite/03 §"Query keys convention".
// Tuples, entity-name first, scope narrowing rightward.
// Centralizing here lets invalidation target a slice precisely.

export const itemKeys = {
    all:        ['items'],
    list:       (filters) => ['items', filters],
    detail:     (id)      => ['items', id],
};
