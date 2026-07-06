import { useNavigate, useParams } from 'react-router-dom';

import { IconBroadcast } from '../../../common/icons';
import SiteLayout from '../../news/layouts/site-layout';
import { usePublicChannel, usePublicChannels } from '../queries/hooks';
import LivePlayer from '../components/live-player';
import ChannelCard from '../components/channel-card';

import './styles/live.css';

export default function WatchLive() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const goSection = (key) => navigate(key === 'home' ? '/' : `/?s=${key}`);

    const { data: channel, isLoading, isError } = usePublicChannel(slug);
    const { data: allData } = usePublicChannels();
    const others = (allData?.items || []).filter(c => c.slug !== slug);

    return (
        <SiteLayout onNavigate={goSection}>
            <div className="live-watch">
                <div className="article-breadcrumb">
                    <a onClick={() => navigate('/')}>Inicio</a><span>›</span>
                    <a onClick={() => navigate('/vivo')}>En vivo</a><span>›</span>
                    <span>{channel?.name || 'Canal'}</span>
                </div>

                {isLoading && <p className="live-empty">Cargando…</p>}
                {(isError || (!isLoading && !channel)) && (
                    <div className="live-empty">
                        <p>Canal no encontrado.</p>
                        <button className="btn btn--primary" onClick={() => navigate('/vivo')}>Ver canales</button>
                    </div>
                )}

                {channel && (
                    <>
                        {channel.isOnAir ? (
                            <div className="live-stage"><LivePlayer channel={channel} /></div>
                        ) : (
                            <div className="live-offline">
                                <span className="live-offline__icon"><IconBroadcast size={34} /></span>
                                <h2 className="live-offline__title">Este canal no está al aire</h2>
                                <p className="live-offline__text">Vuelve cuando comience la transmisión.</p>
                            </div>
                        )}

                        <div className="live-meta">
                            <span className={`live-state${channel.isOnAir ? ' live-state--on' : ''}`}>
                                {channel.isOnAir && <span className="live-state__dot" />}
                                {channel.isOnAir ? 'EN VIVO' : 'Fuera del aire'}
                            </span>
                            <h1 className="live-watch__title">{channel.name}</h1>
                            {channel.description && <p className="live-watch__desc">{channel.description}</p>}
                        </div>

                        {others.length > 0 && (
                            <section className="live-related">
                                <h2 className="art-rel-heading"><span className="art-rel-line" />Otros canales<span className="art-rel-line" /></h2>
                                <div className="live-grid">
                                    {others.map(c => <ChannelCard key={c.id} channel={c} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </SiteLayout>
    );
}
