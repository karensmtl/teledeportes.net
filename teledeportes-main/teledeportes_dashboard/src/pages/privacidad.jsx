import LegalPage from '../features/legal/layouts/legal-page';
import { PRIVACY } from '../features/legal/utils/documents';

export default function PrivacidadPage() {
    return <LegalPage document={PRIVACY} siblingTo="/terminos" siblingLabel="Términos y condiciones" />;
}
