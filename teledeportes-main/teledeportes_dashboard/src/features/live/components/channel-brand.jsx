import { useState } from 'react';

import './styles/channel-brand.css';

// Channel identity block: the uploaded logo (transparent PNG/WEBP/AVIF) with the
// channel name in small type underneath. When a channel has no logo — or the
// file 404s — it degrades to the name alone as a wordmark, so the hero never
// renders an empty slot.
//
// `nameAs` lets the caller keep the name as the page's <h1>: the hero replaces
// a big headline with the logo, but the text still has to be there for search
// engines and screen readers.
export default function ChannelBrand({
    channel,
    size = 'lg',
    align = 'center',
    nameAs = 'span',
    className = '',
}) {
    const [broken, setBroken] = useState(false);
    if (!channel) return null;

    // Local const, not a destructured param: the repo's no-unused-vars only
    // exempts PascalCase *variables*, and there is no eslint-plugin-react here
    // to see that JSX uses it.
    const NameTag = nameAs;
    const hasLogo = Boolean(channel.logoUrl) && !broken;
    const classes = `channel-brand channel-brand--${size} channel-brand--${align} ${className}`.trim();

    return (
        <div className={classes}>
            {hasLogo ? (
                <>
                    <img
                        className="channel-brand__logo"
                        src={channel.logoUrl}
                        alt={channel.name}
                        onError={() => setBroken(true)}
                    />
                    <NameTag className="channel-brand__name">{channel.name}</NameTag>
                </>
            ) : (
                <NameTag className="channel-brand__wordmark">{channel.name}</NameTag>
            )}
        </div>
    );
}
