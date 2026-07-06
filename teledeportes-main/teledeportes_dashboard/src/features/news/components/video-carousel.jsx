import { useState } from 'react';

import Carousel from './carousel';
import VideoCard from './video-card';
import { VIDEO_NEWS } from '../utils/videos';

// Video carousel for the home / category pages. Filters the static YouTube list
// by category (or shows all) and enforces one active (playing) card at a time.
export default function VideoCarousel({ category, onOpenVideo }) {
    const [activeId, setActiveId] = useState(null);

    const videos = category ? VIDEO_NEWS.filter(v => v.categoria === category) : VIDEO_NEWS;
    if (!videos.length) return null;

    const countLabel = `${videos.length} VIDEO${videos.length !== 1 ? 'S' : ''}`;

    return (
        <div className="videoSection">
            <Carousel
                key={category || 'all'}
                title={<>Videos del Mundial y Deportes <span className="rj_vbadge">&#9654; VIDEO</span></>}
                countLabel={countLabel}
            >
                {videos.map(v => (
                    <VideoCard
                        key={v.id}
                        video={v}
                        isActive={activeId === v.id}
                        onToggle={() => setActiveId(prev => (prev === v.id ? null : v.id))}
                        onOpen={() => onOpenVideo(v.id)}
                    />
                ))}
            </Carousel>
        </div>
    );
}
