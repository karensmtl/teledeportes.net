// One YouTube video card. When active, the iframe is mounted (autoplay) and the
// thumbnail hides via the `vcard_playing` class; unmounting it stops playback.
export default function VideoCard({ video, isActive, onToggle, onOpen }) {
    return (
        <div className="rj_vcard">
            <div className={`rj_vcard_video${isActive ? ' vcard_playing' : ''}`}>
                <img
                    className="rj_vcard_thumb"
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.titulo}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {isActive && (
                    <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                        title={video.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', opacity: 1 }}
                    />
                )}
                <div className="rj_vcard_play_overlay" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
                    <div className="rj_vcard_play_btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="5,3 18,10 5,17" fill="white" /></svg>
                    </div>
                </div>
            </div>
            <div className="rj_vcard_body" onClick={onOpen}>
                <div className="rj_vcard_cat">{video.categoria}</div>
                <div className="rj_vcard_title">{video.titulo}</div>
                <div className="rj_vcard_meta">{video.autor} · {video.fecha}</div>
                <a className="rj_vcard_readmore" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
                    LEER NOTA COMPLETA →
                </a>
            </div>
        </div>
    );
}
