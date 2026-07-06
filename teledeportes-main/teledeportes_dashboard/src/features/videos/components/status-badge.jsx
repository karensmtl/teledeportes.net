import { PROCESSING_STATUS } from '../../../core/constants/media';

export default function StatusBadge({ status }) {
    const meta = PROCESSING_STATUS[status] || { label: status, tone: 'info' };
    const spinning = status === 'processing' || status === 'pending';
    return (
        <span className={`pill pill--${meta.tone}`}>
            {spinning && <span className="status-badge__dot" />}
            {meta.label}
        </span>
    );
}
