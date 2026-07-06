import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// TSS vite/06 — Operational
export default defineConfig({
    plugins: [react()],
    build: {
        target: 'es2022',
        sourcemap: true,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 750,
    },
    server: {
        host: true,
        port: 5173,
    },
});
