// Channel branding constants — TSS vite/02 §"Constants live in core/constants".

// The backend only accepts alpha-capable formats for logos (JPEG would render
// as an opaque box over the hero video). Mirrors LOGO_MIME in the server's
// core/media/image_upload.js.
export const LOGO_ACCEPT = 'image/png,image/webp,image/avif';
export const LOGO_MAX_MB = 2;
export const LOGO_HINT = `PNG, WEBP o AVIF con transparencia · máx. ${LOGO_MAX_MB} MB`;
