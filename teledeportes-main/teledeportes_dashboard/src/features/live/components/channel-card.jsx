import { Link } from 'react-router-dom';

import { IconPlay } from '../../../common/icons';

// Live channel card in the news-site aesthetic, linking to its watch page.
export default function ChannelCard({ channel }) {
    return (
        <Link to={`/vivo/${channel.slug}`} className={`live-card${channel.isOnAir ? ' live-card--on' : ''}`}>
            <div className="live-card__thumb">
                {channel.isOnAir
                    ? <span className="live-card__badge"><span className="live-card__dot" /> EN VIVO</span>
                    : <span className="live-card__badge live-card__badge--off">Fuera del aire</span>}
                <span className="live-card__play"><IconPlay size={20} /></span>
                {channel.thumbnailUrl
                    ? <img className="live-card__img" src={channel.thumbnailUrl} alt={channel.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    : <span className="live-card__ph">{channel.name}</span>}
            </div>
            <div className="live-card__body">
                <div className="live-card__cat">Canal en vivo</div>
                <h3 className="live-card__title">{channel.name}</h3>
                {channel.description && <p className="live-card__desc">{channel.description}</p>}
            </div>
        </Link>
    );
}
