import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gasEndpoint = env.VITE_GAS_ENDPOINT;

  // GAS エンドポイントが設定されている場合、/gas-proxy → GAS URL にプロキシ
  // サーバーサイド転送なので CORS 制限を受けない
  const proxyConfig = gasEndpoint
    ? (() => {
        const url = new URL(gasEndpoint);
        return {
          '/gas-proxy': {
            target: url.origin,
            changeOrigin: true,
            rewrite: () => url.pathname,
          },
        };
      })()
    : {};

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: proxyConfig,
    },
  };
});
