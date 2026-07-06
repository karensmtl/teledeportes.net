// TSS vite/04 §"Endpoint paths".
// Per-feature path helpers — keep URL knowledge local so a backend
// rename touches one file.

export const itemPaths = {
    list:   ()   => 'items',
    detail: (id) => `items/${id}`,
};
