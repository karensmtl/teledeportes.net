class CategoryPackage {
    constructor() {
        this.packaged = {
            id: null,
            name: null,
            slug: null,
            description: null,
            sortOrder: null,
            status: null,
            videoCount: 0,
            createdAt: null,
            updatedAt: null,
        };
    }

    addCategory(category) {
        if (!category) return;
        this.packaged.id          = category.id;
        this.packaged.name        = category.name;
        this.packaged.slug        = category.slug;
        this.packaged.description = category.description ?? null;
        this.packaged.sortOrder   = category.sort_order ?? category.sortOrder ?? 0;
        this.packaged.status      = category.status;
        this.packaged.createdAt   = category.created_at ?? category.createdAt ?? null;
        this.packaged.updatedAt   = category.updated_at ?? category.updatedAt ?? null;
    }

    addVideoCount(count) {
        this.packaged.videoCount = Number(count) || 0;
    }

    build() {
        return this.packaged;
    }
}

module.exports = CategoryPackage;
