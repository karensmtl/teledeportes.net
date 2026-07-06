// TSS vite/06 — dp versioning scheme. Newest entry first.
// Type enum: 'feature' | 'fix' | 'improvement' | 'breaking'.

const CHANGELOG = [
    {
        version: 'dp1.1',
        date: '2026-05-16',
        title: 'Example feature + SimpleCrud',
        notes: [
            { type: 'feature',     text: 'Nueva feature de ejemplo en /admin/example con CRUD completo (lista filtrada, crear, editar, eliminar)' },
            { type: 'feature',     text: 'Componente genérico SimpleCrud en common/components/ — listo para catálogos de tipo {id, name, description}' },
            { type: 'feature',     text: 'Página /admin/example/categories que demuestra el uso de SimpleCrud' },
            { type: 'improvement', text: 'Set inicial de iconos SVG en common/icons/ (Edit, Trash, Plus, Eye, EyeOff)' },
        ],
    },
    {
        version: 'dp1.0',
        date: '2026-05-15',
        title: 'Plantilla inicial',
        notes: [
            { type: 'feature', text: 'Esqueleto inicial conformante a TSS vite v1' },
        ],
    },
];

export default CHANGELOG;
