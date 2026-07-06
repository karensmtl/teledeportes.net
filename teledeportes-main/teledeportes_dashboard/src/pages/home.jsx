import NewsSite from '../features/news/layouts/news-site';

// Public landing — the TeleDeportes news site (ticker, live hero, carousels,
// category sections, articles). Replaces the former VOD/live home, which now
// lives in git history; its player/catalog features remain under /vivo, /watch.
export default function HomePage() {
    return <NewsSite />;
}
