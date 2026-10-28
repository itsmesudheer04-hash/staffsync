import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// runs on 5174 and forwards /api calls to the backend on 5001
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, proxy: { '/api': 'http://localhost:5001' } },
});
