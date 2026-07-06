import Header from '../../features/headers/header';
import SimpleCrud from '../../common/components/SimpleCrud/SimpleCrud';

// Reference usage of the generic SimpleCrud component (common/components/).
// Drop-in CRUD for any { id, name, description } catalog. Permission-aware
// via readDomain/writeDomain. Foreign-key-usage hint surfaces when delete
// is blocked by dependent rows.

export default function ExampleCatalogPage() {
    return (
        <>
            <Header title="Categorías" />
            <SimpleCrud
                title="Categorías de items"
                subtitle="Catálogo usado para clasificar items en /admin/example."
                endpoint="items/categories"
                readDomain="items:read"
                writeDomain="items:write"
                countLabel="Items en esta categoría"
                countField="itemCount"
                notDeletableHint="Reasigna los items de esta categoría antes de eliminarla."
            />
        </>
    );
}
