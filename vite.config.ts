import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gasEndpoint = env.VITE_GAS_ENDPOINT;

  // GAS は script.google.com → script.googleusercontent.com へ 302 リダイレクトする。
  // Vite の http-proxy は followRedirects を実質サポートしないため、
  // configureServer ミドルウェア + ネイティブ fetch（Node 18+ でリダイレクト追従）で中継する。
  const gasProxyPlugin: Plugin = {
    name: 'gas-proxy',
    configureServer(server) {
      server.middlewares.use('/gas-proxy', async (_req, res) => {
        if (!gasEndpoint) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'VITE_GAS_ENDPOINT not set' }));
          return;
        }
        try {
          const response = await fetch(gasEndpoint); // follows redirects by default
          const text = await response.text();
          console.log(`[gas-proxy] GAS status: ${response.status} | body: ${text.slice(0, 120)}`);
          if (!response.ok) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `GAS returned ${response.status}`, body: text.slice(0, 500) }));
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(text);
        } catch (err) {
          console.error('[gas-proxy] fetch error:', err);
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };

  return {
    plugins: [react(), tailwindcss(), gasProxyPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
