// TSS vite/06 — dp versioning scheme. Newest entry first.
// Type enum: 'feature' | 'fix' | 'improvement' | 'breaking'.

const CHANGELOG = [
    {
        version: 'dp1.2',
        date: '2026-08-03',
        title: 'Logo de canal + navegación por control remoto',
        notes: [
            { type: 'feature',     text: 'Los canales tienen logo propio (PNG/WEBP/AVIF con transparencia): se sube y se quita desde /admin/channels' },
            { type: 'improvement', text: 'El hero de la portada muestra el logo del canal en lugar del rótulo "en directo" y del nombre grande; el nombre queda debajo en letra pequeña' },
            { type: 'feature',     text: 'Navegación por D-pad para pantalla de TV: flechas mueven el foco de forma espacial, OK activa y BACK vuelve atrás (webOS, Tizen, Android TV y teclado)' },
            { type: 'improvement', text: 'Anillo de foco de alto contraste y auto-scroll del elemento enfocado, visible solo cuando manda el control remoto' },
        ],
    },
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
