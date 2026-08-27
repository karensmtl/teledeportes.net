// Carrusel del hero — TSS vite/02 §"Constants live in core/constants".

// Cada cambio de diapositiva derriba y reconstruye una conexión HLS, así que el
// intervalo es largo a propósito: rotar rápido castigaría la red y cortaría la
// señal justo cuando alguien empieza a mirarla.
export const HERO_ROTATE_MS = 9000;

// Recorrido mínimo (px) para que un gesto cuente como deslizamiento y no como
// un toque accidental.
export const HERO_SWIPE_PX = 48;
