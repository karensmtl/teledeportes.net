import { useState } from 'react';

import './styles/channel-brand.css';

// Channel identity block: the uploaded logo (transparent PNG/WEBP/AVIF) with the
// channel name in small type underneath. When a channel has no logo — or the
// file 404s — it degrades to the name alone as a wordmark, so the hero never
// renders an empty slot.
export default function ChannelBrand({ channel, size = 'lg', className = '' }) {
    const [broken, setBroken] = useState(false);
    if (!channel) return null;

    const hasLogo = Boolean(channel.logoUrl) && !broken;

    return (
        <div className={`channel-brand channel-brand--${size} ${className}`.trim()}>
            {hasLogo ? (
                <>
                    <img
                        className="channel-brand__logo"
                        src={channel.logoUrl}
                        alt={channel.name}
                        onError={() => setBroken(true)}
                    />
                    <span className="channel-brand__name">{channel.name}</span>
                </>
            ) : (
                <span className="channel-brand__wordmark">{channel.name}</span>
            )}
        </div>
    );
}
