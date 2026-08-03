import { useNavigate } from 'react-router-dom';

import SiteLayout from '../../news/layouts/site-layout';
import { IconBroadcast } from '../../../common/icons';
import { usePublicChannels } from '../queries/hooks';
import ChannelCard from '../components/channel-card';

import './styles/live.css';

export default function LiveOverview() {
    const navigate = useNavigate();
    const goSection = (key) => navigate(key === 'home' ? '/' : `/?s=${key}`);

    const { data, isLoading } = usePublicChannels();
    const channels = data?.items || [];
    const onAir = channels.filter(c => c.isOnAir);
    const offAir = channels.filter(c => !c.isOnAir);

    return (
        <SiteLayout onNavigate={goSection}>
            <div className="cat_hero">
                <div className="cat_hero_icon"><IconBroadcast size={44} /></div>
                <div className="cat_hero_text">
                    <h1><span className="cat-accent">E</span>N VIVO</h1>
                    <p className="parraf">Canales de TELEDEPORTES transmitiendo ahora.</p>
                </div>
            </div>

            <div className="page_wrap">
                <div className="cat_section_head">
                    <span className="cat_section_head_title">Canales al aire</span>
                    <span className="cat_section_head_btn">{onAir.length} al aire</span>
                </div>

                {isLoading && <p className="live-empty">Cargando canales…</p>}
                {!isLoading && channels.length === 0 && <p className="live-empty">Aún no hay canales configurados.</p>}
                {!isLoading && channels.length > 0 && onAir.length === 0 && (
                    <p className="live-empty">Ningún canal al aire en este momento.</p>
                )}

                {onAir.length > 0 && (
                    <div className="live-grid">
                        {onAir.map(c => <ChannelCard key={c.id} channel={c} />)}
                    </div>
                )}

                {offAir.length > 0 && (
                    <>
                        <div className="cat_section_head" style={{ marginTop: 36 }}>
                            <span className="cat_section_head_title">Fuera del aire</span>
                        </div>
                        <div className="live-grid live-grid--dim">
                            {offAir.map(c => <ChannelCard key={c.id} channel={c} />)}
                        </div>
                    </>
                )}
            </div>
        </SiteLayout>
    );
}
