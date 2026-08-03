import VideoCard from './video-card';
import { IconPlay } from '../../../common/icons';
import { usePublicVideos } from '../../catalog/queries/hooks';

// Uploaded (VOD) videos shown as a responsive grid — ~5 per row, two rows (10).
// Each card links to its dedicated /watch/:slug page. Hidden when empty.
export default function VideoCarousel() {
    const { data } = usePublicVideos({ limit: 10 });
    const videos = data?.items || [];
    if (!videos.length) return null;

    return (
        <section className="videoSection rvids">
            <div className="rvids__inner">
                <div className="rvids__head">
                    <h2 className="rj_carousel_title">Videos <span className="rj_vbadge"><IconPlay size={11} /> VIDEO</span></h2>
                    <span className="rj_carousel_count">{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="rvids__grid">
                    {videos.map(v => <VideoCard key={v.id} video={v} />)}
                </div>
            </div>
        </section>
    );
}
