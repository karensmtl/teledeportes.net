// Creates/syncs the `noticias` table. Run once (idempotent, alter: true).
require('./_lib/sync')('sync_noticias', ['Noticia']);
