// Category must sync before Video — the videos.category_id FK targets it.
require('./_lib/sync')('sync_videos', ['Category', 'Video']);
