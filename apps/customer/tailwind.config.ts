import type { Config } from 'tailwindcss';
export default { content: ['./index.html','./src/**/*.{ts,tsx}'], theme: { extend: { colors: { background:'var(--bmp-background)',surface:'var(--bmp-surface)',ink:'var(--bmp-ink)',primary:'var(--bmp-primary)',accent:'var(--bmp-accent)',muted:'var(--bmp-muted)',line:'var(--bmp-border)' } } }, plugins:[] } satisfies Config;
