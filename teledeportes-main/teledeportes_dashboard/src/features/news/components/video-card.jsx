import { Link } from 'react-router-dom';

import { IconPlay } from '../../../common/icons';
import { formatDuration } from '../../../core/constants/media';
import { formatNewsDate } from '../utils/format';

// A card for an uploaded (VOD) video. The whole card links to the video's
// dedicated page (/watch/:slug), where it plays via HLS.
export default function VideoCard({ video }) {
    return (
        <Link to={`/watch/${video.slug}`} className="rj_vcard">
            <div className="rj_vcard_video">
                {video.thumbnailUrl
                    ? <img className="rj_vcard_thumb" src={video.thumbnailUrl} alt={video.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    : <span className="rj_vcard_ph">{video.title}</span>}
                <div className="rj_vcard_play_overlay">
                    <div className="rj_vcard_play_btn"><IconPlay size={20} /></div>
                </div>
                {video.durationSeconds != null && (
                    <span className="rj_vcard_dur">{formatDuration(video.durationSeconds)}</span>
                )}
            </div>
            <div className="rj_vcard_body">
                <div className="rj_vcard_cat">{video.category?.name || 'Video'}</div>
                <div className="rj_vcard_title">{video.title}</div>
                <div className="rj_vcard_meta">{formatNewsDate(video.createdAt)}</div>
            </div>
        </Link>
    );
}
