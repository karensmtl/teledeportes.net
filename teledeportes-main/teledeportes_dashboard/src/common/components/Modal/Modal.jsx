import { useEffect } from 'react';

import { IconClose } from '../../icons';

import './styles/Modal.css';

// Generic centered modal. Closes on backdrop click or Escape.
export default function Modal({ title, onClose, children, footer }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="modal" onMouseDown={onClose}>
            <div className="modal__card" onMouseDown={e => e.stopPropagation()}>
                <header className="modal__head">
                    <h2 className="modal__title">{title}</h2>
                    <button className="modal__close" onClick={onClose} aria-label="Cerrar"><IconClose size={16} /></button>
                </header>
                <div className="modal__body">{children}</div>
                {footer && <footer className="modal__footer">{footer}</footer>}
            </div>
        </div>
    );
}
