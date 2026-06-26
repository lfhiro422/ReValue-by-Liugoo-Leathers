# ReValue by Liugoo Leathers — Claude作業メモ

## プロジェクト概要

革製品の査定・買取価格シミュレーターのLPサイト。  
Google Apps Script (GAS) から相場データをリアルタイム取得し、AssessmentCalculatorで計算表示する。

---

## 解決済み：GAS通信エラー 404

### 原因

GAS（`script.google.com/macros/s/.../exec`）は常に `script.googleusercontent.com` へ 302リダイレクトする。  
Viteの内部プロキシライブラリ `http-proxy` は `followRedirects: true` を実質サポートしておらず、リダイレクト先に追従できなかった。

### 修正内容（2026-06-26）

`vite.config.ts` の `server.proxy` を廃止し、`configureServer` ミドルウェアで Node.js 18+ のネイティブ `fetch`（デフォルトでリダイレクト追従）を使って GAS を中継するカスタムプラグインに置き換えた。

```ts
const gasProxyPlugin: Plugin = {
  name: 'gas-proxy',
  configureServer(server) {
    server.middlewares.use('/gas-proxy', async (_req, res) => {
      const response = await fetch(gasEndpoint); // follows 302 redirects
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(await response.text());
    });
  },
};
```

---

## 関連ファイル

- [vite.config.ts](vite.config.ts) — プロキシ設定
- [src/hooks/usePriceData.ts](src/hooks/usePriceData.ts) — GASフェッチロジック
- [src/components/AssessmentCalculator.tsx](src/components/AssessmentCalculator.tsx) — 計算UIコンポーネント
- [.env](.env) — GASエンドポイントURL（gitignore対象）
