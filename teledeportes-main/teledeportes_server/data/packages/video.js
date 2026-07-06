function joinUrl(base, relativePath) {
    if (!base || !relativePath) return null;
    return `${String(base).replace(/\/+$/, '')}/${String(relativePath).replace(/^\/+/, '')}`;
}

class VideoPackage {
    constructor() {
        this.packaged = {
            id: null,
            title: null,
            slug: null,
            description: null,
            category: null,
            durationSeconds: null,
            width: null,
            height: null,
            processingStatus: null,
            hlsUrl: null,
            thumbnailUrl: null,
            createdAt: null,
            updatedAt: null,
        };
    }

    addVideo(video) {
        if (!video) return;
        this.packaged.id               = video.id;
        this.packaged.title            = video.title;
        this.packaged.slug             = video.slug;
        this.packaged.description      = video.description ?? null;
        this.packaged.durationSeconds  = video.duration_seconds ?? null;
        this.packaged.width            = video.width ?? null;
        this.packaged.height           = video.height ?? null;
        this.packaged.processingStatus = video.processing_status ?? null;
        this.packaged.createdAt        = video.created_at ?? video.createdAt ?? null;
        this.packaged.updatedAt        = video.updated_at ?? video.updatedAt ?? null;
    }

    addCategory(category) {
        this.packaged.category = category
            ? { id: category.id, name: category.name, slug: category.slug }
            : null;
    }

    // Composes absolute URLs from MEDIA_PUBLIC_URL + stored relative paths.
    // A custom (admin-uploaded) thumbnail takes precedence over the auto one.
    addMedia(publicBase, video) {
        if (!video) return;
        this.packaged.hlsUrl       = joinUrl(publicBase, video.hls_path);
        this.packaged.thumbnailUrl = joinUrl(publicBase, video.custom_thumbnail_path || video.thumbnail_path);
    }

    // Admin-only fields. Never call this on the public payload.
    addAdmin(video) {
        if (!video) return;
        this.packaged.status           = video.status;
        this.packaged.sizeBytes        = video.size_bytes ?? null;
        this.packaged.originalFilename = video.original_filename ?? null;
        this.packaged.error            = video.error ?? null;
    }

    build() {
        return this.packaged;
    }
}

module.exports = VideoPackage;
