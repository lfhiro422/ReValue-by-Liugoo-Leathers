import { useState, useEffect, useCallback } from "react";
import { GasPriceData } from "../types";

interface UsePriceDataResult {
  data: GasPriceData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePriceData(): UsePriceDataResult {
  const [data, setData] = useState<GasPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 開発環境では Vite プロキシ経由で CORS を回避、本番は直接 GAS URL
      const endpoint = import.meta.env.DEV
        ? "/gas-proxy"
        : (import.meta.env.VITE_GAS_ENDPOINT as string | undefined);
      if (!endpoint) throw new Error("GASエンドポイントが設定されていません（VITE_GAS_ENDPOINT）");

      const res = await fetch(`${endpoint}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`通信エラー: ${res.status}`);

      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "データ取得に失敗しました");

      setData(json.data as GasPriceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
