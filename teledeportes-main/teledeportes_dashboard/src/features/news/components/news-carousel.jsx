import Carousel from './carousel';
import { formatNewsDate } from '../utils/format';

// "Titulares" carousel of text articles (rj_card). `articles` already filtered
// by the caller; `onOpen(id)` opens the article view.
export default function NewsCarousel({ title = 'Titulares del deporte', articles, onOpen }) {
    if (!articles.length) return null;
    const countLabel = `${articles.length} artículo${articles.length !== 1 ? 's' : ''}`;

    return (
        <Carousel
            title={<>{title} <span className="rj_carousel_title_arrow">›</span></>}
            countLabel={countLabel}
        >
            {articles.map(a => (
                <div className="rj_card" key={a.id} onClick={() => onOpen(a.id)}>
                    <div className="rj_card_img">
                        <img src={a.imageUrl} alt={a.title} onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
                    </div>
                    <div className="rj_card_cat">{a.category}</div>
                    <div className="rj_card_title">{a.title}</div>
                    <div className="rj_card_meta">{a.author} · {formatNewsDate(a.publishedAt)}</div>
                </div>
            ))}
        </Carousel>
    );
}
