import LegalPage from '../features/legal/layouts/legal-page';
import { TERMS } from '../features/legal/utils/documents';

export default function TerminosPage() {
    return <LegalPage document={TERMS} siblingTo="/privacidad" siblingLabel="Política de privacidad" />;
}
