import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// TSS vite/06 — Operational
export default defineConfig({
    plugins: [react()],
    build: {
        // es2019 y no más alto: los Android TV box arrastran WebView 74-83 durante
        // años (sin Play Store que lo actualice). Con es2022 el bundle emitía `??=`
        // y `?.`, y el SPA moría con SyntaxError en esos WebView.
        target: 'es2019',
        sourcemap: true,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 750,
    },
    server: {
        host: true,
        port: 5173,
    },
});
