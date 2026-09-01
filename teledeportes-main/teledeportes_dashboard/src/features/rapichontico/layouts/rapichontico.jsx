import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { MAX_TICKETS_PER_ORDER, TICKET_RANGE } from '../../../core/constants/rapichontico';
import SiteLayout from '../../news/layouts/site-layout';
import { RapichonticoProvider, useRapichontico } from '../contexts/rapichontico-store';
import CheckoutModal from '../components/checkout-modal';
import DrawHistory from '../components/draw-history';
import DrawStage from '../components/draw-stage';
import MyTickets from '../components/my-tickets';
import TicketPicker from '../components/ticket-picker';
import { countAvailable, isAvailable } from '../utils/draw';
import { formatClock } from '../utils/format';

import './styles/rapichontico.css';

const TABS = [
    { key: 'comprar', label: 'Comprar' },
    { key: 'boletas', label: 'Mis boletas' },
    { key: 'historico', label: 'Histórico' },
];

// Rapichontico: lotería demo de 4 cifras con sorteo cada 3 minutos.
//
// Es una simulación completa y autocontenida — no toca `api` ni el backend. El
// sorteo se deriva del reloj (utils/draw.js) y las boletas viven en
// localStorage, así que no hay estado de servidor y TanStack Query no pinta
// nada aquí (TSS vite/03 rige respuestas del backend, no simulaciones locales).
export default function Rapichontico() {
    return (
        <RapichonticoProvider>
            <RapichonticoScreen />
        </RapichonticoProvider>
    );
}

function RapichonticoScreen() {
    const navigate = useNavigate();
    const { draw, tickets, takenByMe, totals, buy, clearTickets, ticketsInDraw } = useRapichontico();

    const [tab, setTab] = useState('comprar');
    const [selected, setSelected] = useState([]);
    // Las boletas que entraron a la pasarela se congelan aquí: el carrito se
    // vacía al confirmar, y el recibo tiene que seguir mostrando qué se compró.
    const [checkoutNumbers, setCheckoutNumbers] = useState(null);
    const purchasedRef = useRef(false);
    const pickerRef = useRef(null);

    useEffect(() => { window.scrollTo({ top: 0 }); }, []);

    // Al cambiar de sorteo el mapa de disponibilidad se rehace: lo que estaba en
    // el carrito puede haber dejado de existir, así que se descarta en vez de
    // arrastrar una selección que ya no significa lo mismo. Se ajusta durante el
    // render, que es el patrón para reaccionar a un cambio de valor sin
    // encadenar un repintado extra.
    const drawId = draw.drawId;
    const [lastDrawId, setLastDrawId] = useState(drawId);
    if (drawId !== lastDrawId) {
        setLastDrawId(drawId);
        setSelected([]);
        setCheckoutNumbers(null);
    }

    const availableCount = useMemo(() => {
        const free = countAvailable(drawId);
        let mine = 0;
        for (const code of takenByMe) {
            if (isAvailable(drawId, Number(code))) mine += 1;
        }
        return free - mine;
    }, [drawId, takenByMe]);

    const toggle = useCallback((code) => {
        setSelected((current) => {
            if (current.includes(code)) return current.filter((n) => n !== code);
            if (current.length >= MAX_TICKETS_PER_ORDER) {
                toast.error(`Máximo ${MAX_TICKETS_PER_ORDER} boletas por compra.`);
                return current;
            }
            return [...current, code];
        });
    }, []);

    const goBuy = useCallback(() => {
        setTab('comprar');
        // El escenario del sorteo ocupa casi toda la pantalla: sin este scroll el
        // CTA parece no hacer nada.
        window.requestAnimationFrame(() => {
            pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, []);

    const openCheckout = useCallback(() => {
        purchasedRef.current = false;
        setCheckoutNumbers(selected);
    }, [selected]);

    const confirmPurchase = useCallback((payment) => {
        const receipt = buy({
            numbers: selected,
            drawId: draw.drawId,
            drawAt: draw.startAt,
            payment,
        });
        purchasedRef.current = true;
        setSelected([]);
        toast.success(
            `${receipt.tickets.length} boleta${receipt.tickets.length === 1 ? '' : 's'} para el sorteo #${draw.drawId}`,
        );
        return receipt;
    }, [buy, selected, draw.drawId, draw.startAt]);

    const closeCheckout = useCallback(() => {
        setCheckoutNumbers(null);
        // Tras una compra, el siguiente paso obvio es ver las boletas emitidas.
        if (purchasedRef.current) setTab('boletas');
    }, []);

    return (
        <SiteLayout
            activeKey="entretenimiento"
            onNavigate={(key) => navigate(key === 'home' ? '/' : '/')}
        >
            <div className="rapichontico">
                <p className="rapichontico__notice">
                    <strong>Demo.</strong> Lotería de demostración: los sorteos son simulados,
                    los pagos son ficticios y las boletas solo existen en este navegador.
                </p>

                <header className="rapichontico__intro">
                    <span className="rapichontico__eyebrow">Rapichontico</span>
                    <h1 className="rapichontico__title">Cuatro cifras, cada tres minutos</h1>
                    <p className="rapichontico__lead">
                        Elige tu número entre 0000 y 9999, paga en segundos y espera el sorteo.
                        Sin esperar hasta el sábado.
                    </p>
                </header>

                <DrawStage
                    phase={draw.phase}
                    digits={draw.digits}
                    revealedCount={draw.revealedCount}
                    msLeft={draw.msLeft}
                    progress={draw.progress}
                    drawLabel={`Sorteo #${draw.drawId}`}
                    drawTime={formatClock(draw.endAt)}
                    soldCount={TICKET_RANGE - availableCount}
                    availableCount={availableCount}
                    myTicketsInDraw={ticketsInDraw}
                    onBuy={goBuy}
                />

                <nav className="rapichontico__tabs" aria-label="Secciones de Rapichontico">
                    {TABS.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`rapichontico__tab${tab === item.key ? ' rapichontico__tab--active' : ''}`}
                            aria-current={tab === item.key ? 'page' : undefined}
                            onClick={() => setTab(item.key)}
                        >
                            {item.label}
                            {item.key === 'boletas' && tickets.length > 0 && (
                                <span className="rapichontico__tab-count">{tickets.length}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="rapichontico__panel" ref={pickerRef}>
                    {tab === 'comprar' && (
                        <TicketPicker
                            drawId={draw.drawId}
                            salesOpen={draw.salesOpen}
                            takenByMe={takenByMe}
                            selected={selected}
                            onToggle={toggle}
                            onCheckout={openCheckout}
                        />
                    )}
                    {tab === 'boletas' && (
                        <MyTickets
                            tickets={tickets}
                            totals={totals}
                            currentDrawId={draw.drawId}
                            onGoBuy={goBuy}
                            onClear={clearTickets}
                        />
                    )}
                    {tab === 'historico' && (
                        <DrawHistory currentDrawId={draw.drawId} tickets={tickets} />
                    )}
                </div>
            </div>

            {checkoutNumbers && checkoutNumbers.length > 0 && (
                <CheckoutModal
                    numbers={checkoutNumbers}
                    draw={draw}
                    onConfirm={confirmPurchase}
                    onClose={closeCheckout}
                />
            )}
        </SiteLayout>
    );
}
