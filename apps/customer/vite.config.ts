import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Default '/' stays suitable for local Web and Capacitor.
// GitHub Pages demo alone uses /Be-My-Pizza/app/ to keep assets inside the repo subpath.
const publicBase = process.env.VITE_PUBLIC_BASE || '/';
export default defineConfig({
  base: publicBase,
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173 },
  build: { outDir: 'dist' }
});
