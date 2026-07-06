import { useParams } from 'react-router-dom';

import Header from '../../features/headers/header';
import ItemsOverview from '../../features/example/layouts/overview';
import CreateItemForm from '../../features/example/forms/create';
import EditItemForm from '../../features/example/forms/edit';

// TSS vite/01 §"Pages are thin" — read URL params, mount a feature.
// Mode is encoded in the URL: /admin/example, /admin/example/new, /admin/example/:id

export default function ExamplePage() {
    const { id } = useParams();

    let body;
    if (id === 'new') body = <CreateItemForm />;
    else if (id)      body = <EditItemForm itemId={id} />;
    else              body = <ItemsOverview />;

    return (
        <>
            <Header title="Items" />
            {body}
        </>
    );
}
