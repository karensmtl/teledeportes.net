class ChannelPackage {
    constructor() {
        this.packaged = {
            id: null,
            name: null,
            slug: null,
            description: null,
            isOnAir: false,
            externalHlsUrl: null,
            sortOrder: null,
            thumbnailUrl: null,
            webrtcUrl: null,
            whepUrl: null,
            llhlsUrl: null,
            createdAt: null,
            updatedAt: null,
        };
    }

    addChannel(channel) {
        if (!channel) return;
        this.packaged.id             = channel.id;
        this.packaged.name           = channel.name;
        this.packaged.slug           = channel.slug;
        this.packaged.description    = channel.description ?? null;
        this.packaged.externalHlsUrl = channel.external_hls_url ?? channel.externalHlsUrl ?? null;
        this.packaged.sortOrder      = channel.sort_order ?? channel.sortOrder ?? 0;
        this.packaged.createdAt      = channel.created_at ?? channel.createdAt ?? null;
        this.packaged.updatedAt      = channel.updated_at ?? channel.updatedAt ?? null;

        // A channel with an external HLS source is considered on-air whenever
        // it's active — there is no OME webhook to flip is_on_air for it.
        const status = channel.status;
        const externallyLive = Boolean(this.packaged.externalHlsUrl) && status !== 0 && status !== 1;
        this.packaged.isOnAir = Boolean(channel.is_on_air ?? channel.isOnAir) || externallyLive;
    }

    addThumbnail(url) {
        this.packaged.thumbnailUrl = url || null;
    }

    // Public playback URLs (WebRTC primary, LL-HLS fallback).
    addPlayback({ webrtcUrl, whepUrl, llhlsUrl }) {
        this.packaged.webrtcUrl = webrtcUrl || null;
        this.packaged.whepUrl = whepUrl || null;
        this.packaged.llhlsUrl = llhlsUrl || null;
    }

    // Admin-only: the ingest secret + how to publish to it. Never public.
    addAdmin(channel, ingest) {
        if (!channel) return;
        this.packaged.status    = channel.status;
        this.packaged.streamKey = channel.stream_key ?? null;
        this.packaged.ingest    = ingest || null;
    }

    build() {
        return this.packaged;
    }
}

module.exports = ChannelPackage;
