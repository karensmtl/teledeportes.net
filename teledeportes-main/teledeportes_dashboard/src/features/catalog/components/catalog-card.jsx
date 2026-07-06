import { Link } from 'react-router-dom';

import { IconPlay } from '../../../common/icons';
import { formatDuration } from '../../../core/constants/media';

import './styles/catalog.css';

// A single VOD card linking to its watch page. Shared by the homepage and
// the "related videos" rail.
export default function CatalogCard({ video }) {
    return (
        <Link to={`/watch/${video.slug}`} className="catalog-card">
            <div className="catalog-card__thumb">
                {video.thumbnailUrl
                    ? <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
                    : <span className="catalog-card__placeholder"><IconPlay size={26} /></span>}
                <span className="catalog-card__overlay"><IconPlay size={20} /></span>
                {video.durationSeconds != null && (
                    <span className="catalog-card__duration">{formatDuration(video.durationSeconds)}</span>
                )}
            </div>
            <div className="catalog-card__body">
                {video.category && <span className="catalog-card__category">{video.category.name}</span>}
                <h3 className="catalog-card__title">{video.title}</h3>
            </div>
        </Link>
    );
}
