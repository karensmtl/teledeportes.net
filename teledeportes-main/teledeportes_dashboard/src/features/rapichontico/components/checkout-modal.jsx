import { useEffect, useMemo, useRef, useState } from 'react';

import {
    CHECKOUT_LATENCY_MS, DEMO_BANKS, DEMO_CARDS, PAYMENT_METHODS, TICKET_PRICE,
} from '../../../core/constants/rapichontico';
import { IconClose } from '../../../common/icons';
import {
    cardBrand, expiryError, formatClock, formatMoney, groupCardNumber, passesLuhn,
} from '../utils/format';

import './styles/checkout-modal.css';

// Pasarela de pago SIMULADA. No sale una sola petición de red: el "cobro" es un
// temporizador y los datos de tarjeta nunca se persisten — de la tarjeta solo
// sobreviven marca y últimos 4 dígitos, que es lo que se enseña en el recibo.
//
// No reutiliza common/components/Modal porque aquel está pintado para el tema
// claro del admin y esto vive en el sitio público en navy.

const EMPTY_FORM = {
    method: 'CARD',
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
    bank: DEMO_BANKS[0],
    document: '',
    phone: '',
};

function validate(form) {
    const errors = {};
    if (form.method === 'CARD') {
        if (form.holder.trim().length < 4) errors.holder = 'Escribe el nombre como aparece en la tarjeta.';
        if (!passesLuhn(form.number)) errors.number = 'Ese número de tarjeta no es válido.';
        const expiry = expiryError(form.expiry);
        if (expiry) errors.expiry = expiry;
        const cvvLength = cardBrand(form.number) === 'Amex' ? 4 : 3;
        if (form.cvv.length !== cvvLength) errors.cvv = `El código son ${cvvLength} dígitos.`;
    }
    if (form.method === 'PSE') {
        if (form.holder.trim().length < 4) errors.holder = 'Escribe tu nombre completo.';
        if (form.document.length < 6) errors.document = 'Documento de al menos 6 dígitos.';
    }
    if (form.method === 'WALLET') {
        if (form.phone.length !== 10) errors.phone = 'El celular son 10 dígitos.';
    }
    return errors;
}

export default function CheckoutModal({ numbers, draw, onConfirm, onClose }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [stage, setStage] = useState('form'); // form | processing | done
    const [receipt, setReceipt] = useState(null);
    const timerRef = useRef(null);

    const total = numbers.length * TICKET_PRICE;
    const brand = useMemo(() => cardBrand(form.number), [form.number]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape' && stage !== 'processing') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, stage]);

    // El cobro simulado no debe resolverse sobre un componente ya desmontado.
    useEffect(() => () => window.clearTimeout(timerRef.current), []);

    const set = (field) => (value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setStage('processing');
        timerRef.current = window.setTimeout(() => {
            const payment = form.method === 'CARD'
                ? { method: 'CARD', label: `${brand} ···· ${form.number.slice(-4)}` }
                : form.method === 'PSE'
                    ? { method: 'PSE', label: `PSE · ${form.bank}` }
                    : { method: 'WALLET', label: `Billetera · ···${form.phone.slice(-4)}` };
            setReceipt(onConfirm(payment));
            setStage('done');
        }, CHECKOUT_LATENCY_MS);
    };

    // Si el sorteo cierra ventas mientras el usuario llena el formulario, la
    // compra deja de ser posible: mejor decirlo que fallar al confirmar.
    const salesClosed = !draw.salesOpen && stage === 'form';

    return (
        <div
            className="checkout"
            onMouseDown={() => { if (stage !== 'processing') onClose(); }}
            role="presentation"
        >
            <div
                className="checkout__card"
                role="dialog"
                aria-modal="true"
                aria-label="Pago de boletas"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <header className="checkout__head">
                    <div>
                        <span className="checkout__eyebrow">Pago simulado</span>
                        <h2 className="checkout__title">
                            {stage === 'done' ? 'Compra confirmada' : 'Confirma tu compra'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="checkout__close"
                        onClick={onClose}
                        disabled={stage === 'processing'}
                        aria-label="Cerrar"
                    >
                        <IconClose size={16} />
                    </button>
                </header>

                <div className="checkout__body">
                    <aside className="checkout__summary">
                        <h3 className="checkout__summary-title">
                            Sorteo #{draw.drawId} · {formatClock(draw.endAt)}
                        </h3>
                        <ul className="checkout__numbers">
                            {numbers.map((code) => (
                                <li key={code} className="checkout__number">{code}</li>
                            ))}
                        </ul>
                        <dl className="checkout__lines">
                            <div className="checkout__line">
                                <dt>{numbers.length} boleta{numbers.length === 1 ? '' : 's'}</dt>
                                <dd>{formatMoney(total)}</dd>
                            </div>
                            <div className="checkout__line">
                                <dt>Servicio</dt>
                                <dd>{formatMoney(0)}</dd>
                            </div>
                            <div className="checkout__line checkout__line--total">
                                <dt>Total</dt>
                                <dd>{formatMoney(total)}</dd>
                            </div>
                        </dl>
                        <p className="checkout__disclaimer">
                            Demostración. No se cobra dinero, no se envía ningún dato y las
                            boletas solo existen en este navegador.
                        </p>
                    </aside>

                    {stage === 'form' && (
                        <form className="checkout__form" onSubmit={handleSubmit} noValidate>
                            <div className="checkout__methods" role="tablist" aria-label="Medio de pago">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={form.method === method.key}
                                        className={`checkout__method${form.method === method.key ? ' checkout__method--active' : ''}`}
                                        onClick={() => { setForm((c) => ({ ...c, method: method.key })); setErrors({}); }}
                                    >
                                        <strong>{method.label}</strong>
                                        <span>{method.hint}</span>
                                    </button>
                                ))}
                            </div>

                            {form.method === 'CARD' && (
                                <>
                                    <div className="checkout__demo">
                                        <span className="checkout__demo-label">Tarjetas de prueba</span>
                                        {DEMO_CARDS.map((card) => (
                                            <button
                                                key={card.number}
                                                type="button"
                                                className="checkout__demo-card"
                                                onClick={() => {
                                                    setForm((c) => ({
                                                        ...c,
                                                        number: card.number,
                                                        expiry: '1230',
                                                        cvv: card.brand === 'Amex' ? '1234' : '123',
                                                        holder: c.holder || 'JUAN PEREZ',
                                                    }));
                                                    setErrors({});
                                                }}
                                            >
                                                {card.brand}
                                            </button>
                                        ))}
                                    </div>

                                    <label className="checkout__field">
                                        <span className="checkout__label">Nombre del titular</span>
                                        <input
                                            className="checkout__input"
                                            value={form.holder}
                                            autoComplete="off"
                                            placeholder="JUAN PEREZ"
                                            onChange={(e) => set('holder')(e.target.value.toUpperCase())}
                                        />
                                        {errors.holder && <em className="checkout__error">{errors.holder}</em>}
                                    </label>

                                    <label className="checkout__field">
                                        <span className="checkout__label">
                                            Número de tarjeta
                                            {form.number.length > 1 && (
                                                <em className="checkout__brand">{brand}</em>
                                            )}
                                        </span>
                                        <input
                                            className="checkout__input checkout__input--mono"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            placeholder="4242 4242 4242 4242"
                                            value={groupCardNumber(form.number)}
                                            onChange={(e) => set('number')(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                        />
                                        {errors.number && <em className="checkout__error">{errors.number}</em>}
                                    </label>

                                    <div className="checkout__row">
                                        <label className="checkout__field">
                                            <span className="checkout__label">Vence</span>
                                            <input
                                                className="checkout__input checkout__input--mono"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                placeholder="MM/AA"
                                                value={form.expiry.length > 2
                                                    ? `${form.expiry.slice(0, 2)}/${form.expiry.slice(2)}`
                                                    : form.expiry}
                                                onChange={(e) => set('expiry')(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            />
                                            {errors.expiry && <em className="checkout__error">{errors.expiry}</em>}
                                        </label>
                                        <label className="checkout__field">
                                            <span className="checkout__label">CVV</span>
                                            <input
                                                className="checkout__input checkout__input--mono"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                placeholder="123"
                                                value={form.cvv}
                                                onChange={(e) => set('cvv')(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            />
                                            {errors.cvv && <em className="checkout__error">{errors.cvv}</em>}
                                        </label>
                                    </div>
                                </>
                            )}

                            {form.method === 'PSE' && (
                                <>
                                    <label className="checkout__field">
                                        <span className="checkout__label">Banco</span>
                                        <select
                                            className="checkout__input"
                                            value={form.bank}
                                            onChange={(e) => set('bank')(e.target.value)}
                                        >
                                            {DEMO_BANKS.map((bank) => <option key={bank}>{bank}</option>)}
                                        </select>
                                    </label>
                                    <label className="checkout__field">
                                        <span className="checkout__label">Nombre completo</span>
                                        <input
                                            className="checkout__input"
                                            value={form.holder}
                                            autoComplete="off"
                                            placeholder="Juan Pérez"
                                            onChange={(e) => set('holder')(e.target.value)}
                                        />
                                        {errors.holder && <em className="checkout__error">{errors.holder}</em>}
                                    </label>
                                    <label className="checkout__field">
                                        <span className="checkout__label">Documento</span>
                                        <input
                                            className="checkout__input checkout__input--mono"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            placeholder="1020304050"
                                            value={form.document}
                                            onChange={(e) => set('document')(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                        />
                                        {errors.document && <em className="checkout__error">{errors.document}</em>}
                                    </label>
                                </>
                            )}

                            {form.method === 'WALLET' && (
                                <label className="checkout__field">
                                    <span className="checkout__label">Celular asociado</span>
                                    <input
                                        className="checkout__input checkout__input--mono"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        placeholder="3001234567"
                                        value={form.phone}
                                        onChange={(e) => set('phone')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                    {errors.phone && <em className="checkout__error">{errors.phone}</em>}
                                </label>
                            )}

                            {salesClosed && (
                                <p className="checkout__closed">
                                    Las ventas del sorteo #{draw.drawId} acaban de cerrar. Cierra esta
                                    ventana y elige tus boletas para el siguiente.
                                </p>
                            )}

                            <button type="submit" className="checkout__submit" disabled={salesClosed}>
                                Pagar {formatMoney(total)}
                            </button>
                        </form>
                    )}

                    {stage === 'processing' && (
                        <div className="checkout__state">
                            <span className="checkout__spinner" />
                            <p className="checkout__state-title">Procesando el pago…</p>
                            <p className="checkout__state-text">Confirmando con la pasarela ficticia.</p>
                        </div>
                    )}

                    {stage === 'done' && receipt && (
                        <div className="checkout__state checkout__state--done">
                            <span className="checkout__check" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="34" height="34" fill="none"
                                    stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </span>
                            <p className="checkout__state-title">¡Boletas emitidas!</p>
                            <p className="checkout__state-text">
                                Orden <strong>{receipt.orderId}</strong> · {receipt.tickets.length} boleta
                                {receipt.tickets.length === 1 ? '' : 's'} para el sorteo #{draw.drawId}.
                            </p>
                            <p className="checkout__state-text">
                                Ya aparecen en <strong>Mis boletas</strong>. Suerte.
                            </p>
                            <button type="button" className="checkout__submit" onClick={onClose}>
                                Listo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
