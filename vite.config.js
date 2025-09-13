import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/blackjack-web/', // importante: el nombre del repo
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});

