import NewsTicker from '../components/news-ticker';
import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';

import './styles/news.css';

// Public-site chrome (ticker + masthead + footer) shared by the news home and
// the live pages so they share one visual language. `onNavigate(key)` and
// `activeKey` drive the nav — the home switches sections in-place; other pages
// route to the home with the section preselected.
export default function SiteLayout({ activeKey = null, onNavigate, children }) {
    return (
        <div className="news-site">
            <NewsTicker />
            <SiteHeader activeKey={activeKey} onNavigate={onNavigate} />
            {children}
            <SiteFooter onNavigate={onNavigate} />
        </div>
    );
}
