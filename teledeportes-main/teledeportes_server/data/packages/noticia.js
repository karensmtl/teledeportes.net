// Transforms a DB row (snake_case) into the client envelope (camelCase).
class NoticiaPackage {
    constructor() {
        this.packaged = {
            id: null,
            title: null,
            slug: null,
            category: null,
            author: null,
            summary: null,
            body: null,
            imageUrl: null,
            readingTime: null,
            tags: [],
            relatedIds: [],
            publishedAt: null,
            createdAt: null,
            updatedAt: null,
        };
    }

    addNoticia(noticia) {
        if (!noticia) return;
        this.packaged.id          = noticia.id;
        this.packaged.title       = noticia.title;
        this.packaged.slug        = noticia.slug;
        this.packaged.category    = noticia.category;
        this.packaged.author      = noticia.author;
        this.packaged.summary     = noticia.summary ?? null;
        this.packaged.body        = noticia.body ?? null;
        this.packaged.imageUrl    = noticia.image_url ?? noticia.imageUrl ?? null;
        this.packaged.readingTime = noticia.reading_time ?? noticia.readingTime ?? null;
        this.packaged.tags        = noticia.tags ?? [];
        this.packaged.relatedIds  = noticia.related_ids ?? noticia.relatedIds ?? [];
        this.packaged.publishedAt = noticia.published_at ?? noticia.publishedAt ?? null;
        this.packaged.createdAt   = noticia.created_at ?? noticia.createdAt ?? null;
        this.packaged.updatedAt   = noticia.updated_at ?? noticia.updatedAt ?? null;
    }

    // Admin-only fields. Never call this on the public payload.
    addAdmin(noticia) {
        if (!noticia) return;
        this.packaged.status = noticia.status;
    }

    build() {
        return this.packaged;
    }
}

module.exports = NoticiaPackage;
