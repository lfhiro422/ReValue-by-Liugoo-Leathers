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
      const endpoint = import.meta.env.VITE_GAS_ENDPOINT as string | undefined;
      if (!endpoint) throw new Error("GASエンドポイントが設定されていません（VITE_GAS_ENDPOINT）");

      const res = await fetch(endpoint);
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
