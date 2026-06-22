import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, RotateCcw, Check, Loader2, AlertCircle,
  User, MapPin, Phone, Mail, CheckCircle2, Award, Sparkles,
} from "lucide-react";

const GAS_ENDPOINT = import.meta.env.DEV
  ? "/gas-proxy"
  : (import.meta.env.VITE_GAS_ENDPOINT as string);

interface PriceItem {
  brand: string;
  model: string;
  price: number;
}

interface GasData {
  prices: PriceItem[];
  conditions: Record<string, number>;
  adjustments: Record<string, Record<string, number>>;
}

const CONDITION_OPTIONS = [
  { key: "S（新品同様）",      grade: "S", desc: "新品同様・ほぼ未使用" },
  { key: "A（傷・汚れなし）",   grade: "A", desc: "傷・汚れなし・良好" },
  { key: "B（一般的な中古）",   grade: "B", desc: "一般的な中古品" },
  { key: "C（着込まれた状態）", grade: "C", desc: "着込まれた状態・使用感あり" },
  { key: "D（全体的に悪い）",   grade: "D", desc: "全体的に状態が悪い" },
];

const SIZE_OPTIONS     = ["S", "M", "L", "LL"];
const MATERIAL_OPTIONS = ["牛革", "羊革", "馬革"];
const COLOR_OPTIONS    = ["ブラック", "ダークブラウン", "キャメル"];

const STEP_LABELS = ["ブランド", "モデル", "状態", "詳細", "査定額", "お客様情報", "完了"];

// ── shared sub-components ─────────────────────────────────────────────────────

function StepHeader({ step, label, sub }: { step: number; label: string; sub?: string }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-amber-500 font-mono block mb-1">
        Step 0{step} / {label}
      </span>
      <h4 className="text-lg font-bold text-white">{sub}</h4>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 py-3 px-5 rounded-xl flex items-center gap-2 justify-center cursor-pointer transition-all"
    >
      <RotateCcw className="w-4 h-4" /> 戻る
    </button>
  );
}

function NextBtn({
  onClick, disabled, children,
}: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
    >
      {children} <ChevronRight className="w-4 h-4 stroke-[3]" />
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function OfficialAppraisal() {
  const [step, setStep]         = useState(1);
  const [gasData, setGasData]   = useState<GasData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // selections
  const [selectedBrand,     setSelectedBrand]     = useState("");
  const [selectedModel,     setSelectedModel]     = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedSize,      setSelectedSize]      = useState("L");
  const [selectedMaterial,  setSelectedMaterial]  = useState("牛革");
  const [selectedColor,     setSelectedColor]     = useState("ブラック");
  const [hasMold,           setHasMold]           = useState(false);
  const [hasSmell,          setHasSmell]          = useState(false);

  // customer form
  const [customerName, setCustomerName] = useState("");
  const [postalCode,   setPostalCode]   = useState("");
  const [address,      setAddress]      = useState("");
  const [phone,        setPhone]        = useState("");
  const [email,        setEmail]        = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [formError,    setFormError]    = useState("");
  const [submitting,   setSubmitting]   = useState(false);

  // fetch price data from GAS on mount
  useEffect(() => {
    fetch(GAS_ENDPOINT)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setGasData(json.data);
        else setLoadError(json.error ?? "データの取得に失敗しました");
      })
      .catch(() => setLoadError("ネットワークエラー。しばらくしてから再試行してください。"));
  }, []);

  // derived
  const brands = gasData ? [...new Set(gasData.prices.map((p) => p.brand))] : [];
  const models  = gasData ? gasData.prices.filter((p) => p.brand === selectedBrand) : [];
  const basePrice = gasData
    ? (gasData.prices.find((p) => p.brand === selectedBrand && p.model === selectedModel)?.price ?? 0)
    : 0;

  const calcAmount = (): number => {
    if (!gasData || !selectedCondition) return 0;
    const rate      = gasData.conditions[selectedCondition] ?? 1;
    const sizeAdj   = gasData.adjustments["サイズ"]?.[selectedSize]      ?? 0;
    const matAdj    = gasData.adjustments["素材"]?.[selectedMaterial]     ?? 0;
    const colorAdj  = gasData.adjustments["カラー"]?.[selectedColor]      ?? 0;
    const moldAdj   = hasMold  ? (gasData.adjustments["カビ"]?.["あり"]   ?? -10000) : 0;
    const smellAdj  = hasSmell ? (gasData.adjustments["臭い"]?.["あり"]   ?? -10000) : 0;
    return Math.max(0, Math.round(basePrice * rate) + sizeAdj + matAdj + colorAdj + moldAdj + smellAdj);
  };

  const assessmentAmount = calcAmount();

  // postal code → address auto-fill
  const handlePostalCode = async (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 7);
    setPostalCode(digits);
    if (digits.length === 7) {
      setPostalLoading(true);
      try {
        const res  = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`);
        const data = await res.json();
        if (data.results?.[0]) {
          const r = data.results[0];
          setAddress(`${r.address1}${r.address2}${r.address3}`);
        }
      } catch {}
      setPostalLoading(false);
    }
  };

  // form submission
  const handleSubmit = async () => {
    setFormError("");
    if (!customerName.trim())                       return setFormError("お名前を入力してください");
    if (postalCode.length !== 7)                    return setFormError("郵便番号を7桁で入力してください");
    if (!address.trim())                            return setFormError("住所を入力してください");
    if (!phone.trim())                              return setFormError("電話番号を入力してください");
    if (!email.trim() || !email.includes("@"))     return setFormError("正しいメールアドレスを入力してください");

    setSubmitting(true);
    try {
      await fetch(GAS_ENDPOINT, {
        method: "POST",
        // Content-Type を省略することで CORS preflight を回避 (GAS 対応)
        body: JSON.stringify({
          customerName, postalCode, address, phone, email,
          brand: selectedBrand, model: selectedModel,
          condition: selectedCondition,
          size: selectedSize, material: selectedMaterial, color: selectedColor,
          hasMold, hasSmell, assessmentAmount,
        }),
      });
      setStep(7);
    } catch {
      setFormError("送信に失敗しました。しばらくしてから再試行してください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedBrand(""); setSelectedModel(""); setSelectedCondition("");
    setSelectedSize("L"); setSelectedMaterial("牛革"); setSelectedColor("ブラック");
    setHasMold(false); setHasSmell(false);
    setCustomerName(""); setPostalCode(""); setAddress(""); setPhone(""); setEmail("");
    setFormError("");
  };

  // ── helper: adjustments display ────────────────────────────────────────────
  const adjLabel = (val: number) =>
    val === 0 ? "±0" : val > 0 ? `+¥${val.toLocaleString()}` : `-¥${Math.abs(val).toLocaleString()}`;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-[#11131c] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

      {/* ── Header ── */}
      <div className="px-6 py-4 bg-[#181a26]/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-sm sm:text-base flex items-center gap-2">
              スピード査定システム
              <span className="text-amber-400 text-xs py-0.5 px-2 bg-amber-500/10 rounded border border-amber-500/20">
                リアルタイム連動
              </span>
            </h3>
            <p className="text-xs text-gray-400">ブランド・状態を選んで査定金額を即確認 → そのまま本査定申込</p>
          </div>
        </div>

        {/* step pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            return (
              <div
                key={s}
                className={`px-2 py-1 rounded text-[10px] font-mono ${
                  step === s
                    ? "bg-amber-500 text-black font-bold shadow shadow-amber-500/30"
                    : step > s
                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                    : "bg-white/5 text-gray-600 border border-white/5"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-6 sm:p-8 min-h-[420px] flex flex-col">

        {/* loading */}
        {!gasData && !loadError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm text-gray-400">価格データを読み込み中...</p>
          </div>
        )}

        {/* error */}
        {loadError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-red-400 text-center">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg hover:bg-amber-500/10 transition-all cursor-pointer"
            >
              再読み込み
            </button>
          </div>
        )}

        {gasData && (
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Brand ── */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-5 flex-1 flex flex-col"
              >
                <StepHeader step={1} label="Brand" sub="ブランドを選択してください" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => { setSelectedBrand(brand); setSelectedModel(""); }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedBrand === brand
                          ? "bg-amber-500/10 border-amber-500/80 text-white"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/15 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{brand}</span>
                        {selectedBrand === brand && (
                          <div className="bg-amber-500 text-black p-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {gasData.prices.filter((p) => p.brand === brand).length} モデル対応
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <NextBtn onClick={() => setStep(2)} disabled={!selectedBrand}>
                    モデル選択へ
                  </NextBtn>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Model ── */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-5 flex-1 flex flex-col"
              >
                <div>
                  <StepHeader step={2} label="Model" sub="モデルを選択してください" />
                  <p className="text-xs text-gray-500 mt-0.5">
                    ブランド: <span className="text-amber-400">{selectedBrand}</span>
                  </p>
                </div>

                <div className="space-y-2.5 flex-1">
                  {models.map((item) => (
                    <button
                      key={item.model}
                      onClick={() => setSelectedModel(item.model)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedModel === item.model
                          ? "bg-amber-500/10 border-amber-500/80 text-white"
                          : "bg-white/[0.02] border-white/5 hover:border-white/15 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          selectedModel === item.model ? "border-amber-500 bg-amber-500" : "border-gray-600"
                        }`}>
                          {selectedModel === item.model && (
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </div>
                        <span className="font-semibold text-sm">{item.model}</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 shrink-0">
                        相場 ¥{item.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between gap-3">
                  <BackBtn onClick={() => setStep(1)} />
                  <NextBtn onClick={() => setStep(3)} disabled={!selectedModel}>
                    状態選択へ
                  </NextBtn>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Condition ── */}
            {step === 3 && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-5 flex-1 flex flex-col"
              >
                <StepHeader step={3} label="Condition" sub="現在の状態を選択してください" />

                <div className="space-y-2 flex-1">
                  {CONDITION_OPTIONS.map((opt) => {
                    const rate = gasData.conditions[opt.key] ?? 0;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setSelectedCondition(opt.key)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedCondition === opt.key
                            ? "bg-amber-500/10 border-amber-500/80 text-white"
                            : "bg-white/[0.02] border-white/5 hover:border-white/15 text-gray-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                            selectedCondition === opt.key
                              ? "bg-amber-500 text-black"
                              : "bg-white/5 text-gray-400"
                          }`}>
                            {opt.grade}
                          </div>
                          <span className="font-semibold text-sm">{opt.desc}</span>
                        </div>
                        <span className="text-xs font-mono text-amber-400/70 shrink-0">
                          × {rate.toFixed(1)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between gap-3">
                  <BackBtn onClick={() => setStep(2)} />
                  <NextBtn onClick={() => setStep(4)} disabled={!selectedCondition}>
                    詳細条件へ
                  </NextBtn>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Details ── */}
            {step === 4 && (
              <motion.div key="s4"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-5 flex-1 flex flex-col"
              >
                <StepHeader step={4} label="Details" sub="詳細条件を選択してください" />

                {/* Size */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-semibold tracking-wide">サイズ</p>
                  <div className="grid grid-cols-4 gap-2">
                    {SIZE_OPTIONS.map((s) => {
                      const adj = gasData.adjustments["サイズ"]?.[s] ?? 0;
                      return (
                        <button key={s} onClick={() => setSelectedSize(s)}
                          className={`py-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedSize === s
                              ? "bg-amber-500/10 border-amber-500/80"
                              : "bg-white/[0.02] border-white/5 hover:border-white/15"
                          }`}
                        >
                          <span className="font-bold text-sm text-white block">{s}</span>
                          <span className={`text-[10px] font-mono ${adj < 0 ? "text-red-400" : adj > 0 ? "text-emerald-400" : "text-gray-500"}`}>
                            {adjLabel(adj)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Material */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-semibold tracking-wide">素材</p>
                  <div className="grid grid-cols-3 gap-2">
                    {MATERIAL_OPTIONS.map((m) => {
                      const adj = gasData.adjustments["素材"]?.[m] ?? 0;
                      return (
                        <button key={m} onClick={() => setSelectedMaterial(m)}
                          className={`py-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedMaterial === m
                              ? "bg-amber-500/10 border-amber-500/80"
                              : "bg-white/[0.02] border-white/5 hover:border-white/15"
                          }`}
                        >
                          <span className="font-bold text-sm text-white block">{m}</span>
                          <span className={`text-[10px] font-mono ${adj > 0 ? "text-emerald-400" : "text-gray-500"}`}>
                            {adjLabel(adj)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-semibold tracking-wide">カラー</p>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_OPTIONS.map((c) => {
                      const adj = gasData.adjustments["カラー"]?.[c] ?? 0;
                      return (
                        <button key={c} onClick={() => setSelectedColor(c)}
                          className={`py-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedColor === c
                              ? "bg-amber-500/10 border-amber-500/80"
                              : "bg-white/[0.02] border-white/5 hover:border-white/15"
                          }`}
                        >
                          <span className="font-bold text-sm text-white block">{c}</span>
                          <span className={`text-[10px] font-mono ${adj > 0 ? "text-emerald-400" : "text-gray-500"}`}>
                            {adjLabel(adj)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mold & Smell toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setHasMold(!hasMold)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      hasMold
                        ? "bg-red-500/10 border-red-500/60"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <span className="font-bold text-sm text-white block">
                      {hasMold ? "✓ " : ""}カビあり
                    </span>
                    <span className="text-[10px] font-mono text-red-400">-¥10,000</span>
                  </button>
                  <button
                    onClick={() => setHasSmell(!hasSmell)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      hasSmell
                        ? "bg-red-500/10 border-red-500/60"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <span className="font-bold text-sm text-white block">
                      {hasSmell ? "✓ " : ""}臭いあり
                    </span>
                    <span className="text-[10px] font-mono text-red-400">-¥10,000</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between gap-3">
                  <BackBtn onClick={() => setStep(3)} />
                  <button
                    onClick={() => setStep(5)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    査定額を確認する <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: Result ── */}
            {step === 5 && (
              <motion.div key="s5"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                className="space-y-5 flex-1 flex flex-col"
              >
                {/* Result card */}
                <div className="bg-gradient-to-br from-[#1c1f2e] to-[#121420] border border-amber-500/30 p-5 sm:p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-300">リアルタイム査定結果</h4>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                      スプレッドシート連動
                    </span>
                  </div>

                  {/* summary grid */}
                  <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/5 text-xs mb-4">
                    <div>
                      <span className="text-gray-500 block">ブランド</span>
                      <span className="font-bold text-gray-200">{selectedBrand}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">モデル</span>
                      <span className="font-bold text-gray-200">{selectedModel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">状態</span>
                      <span className="font-bold text-amber-400">{selectedCondition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">サイズ / 素材 / カラー</span>
                      <span className="font-bold text-gray-200">
                        {selectedSize} / {selectedMaterial} / {selectedColor}
                      </span>
                    </div>
                  </div>

                  {/* calculation breakdown */}
                  <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                    <div className="flex justify-between">
                      <span>中古販売相場:</span>
                      <span className="font-mono">¥{basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>状態倍率 ({selectedCondition.charAt(0)}):</span>
                      <span className="font-mono">× {(gasData.conditions[selectedCondition] ?? 1).toFixed(1)}</span>
                    </div>
                    {(() => {
                      const sizeAdj  = gasData.adjustments["サイズ"]?.[selectedSize]     ?? 0;
                      const matAdj   = gasData.adjustments["素材"]?.[selectedMaterial]    ?? 0;
                      const colorAdj = gasData.adjustments["カラー"]?.[selectedColor]     ?? 0;
                      return (
                        <>
                          {sizeAdj !== 0 && (
                            <div className="flex justify-between">
                              <span>サイズ補正 ({selectedSize}):</span>
                              <span className={`font-mono ${sizeAdj < 0 ? "text-red-400" : "text-emerald-400"}`}>
                                {adjLabel(sizeAdj)}
                              </span>
                            </div>
                          )}
                          {matAdj !== 0 && (
                            <div className="flex justify-between">
                              <span>素材補正 ({selectedMaterial}):</span>
                              <span className="font-mono text-emerald-400">{adjLabel(matAdj)}</span>
                            </div>
                          )}
                          {colorAdj !== 0 && (
                            <div className="flex justify-between">
                              <span>カラー補正 ({selectedColor}):</span>
                              <span className="font-mono text-emerald-400">{adjLabel(colorAdj)}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    {hasMold && (
                      <div className="flex justify-between text-red-400">
                        <span>カビあり:</span>
                        <span className="font-mono">-¥10,000</span>
                      </div>
                    )}
                    {hasSmell && (
                      <div className="flex justify-between text-red-400">
                        <span>臭いあり:</span>
                        <span className="font-mono">-¥10,000</span>
                      </div>
                    )}
                  </div>

                  {/* final price */}
                  <div className="text-center py-5 border-t border-white/5">
                    <span className="text-xs text-gray-400 block mb-2 tracking-wider">
                      ★ 簡易査定金額
                    </span>
                    <span className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                      ¥{assessmentAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">（税込）</span>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
                  ※ 本査定はお品物到着後にレザーソムリエが実施します。状態確認で多少変動する場合がありますが、誠実な適正価格をご提示します。
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(4)}
                    className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 py-3 px-5 rounded-xl flex items-center gap-2 justify-center cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> 条件を変更する
                  </button>
                  <button
                    onClick={() => setStep(6)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 text-base cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <Sparkles className="w-5 h-5" />
                    本査定に申し込む
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 6: Customer Form ── */}
            {step === 6 && (
              <motion.div key="s6"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div>
                  <StepHeader step={6} label="Application" sub="お客様情報を入力してください" />
                  <p className="text-xs text-gray-400 mt-1">
                    査定金額:{" "}
                    <span className="text-amber-400 font-mono font-bold text-sm">
                      ¥{assessmentAmount.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="space-y-3 flex-1">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1.5">
                      <User className="w-3 h-3" /> お名前 <span className="text-red-400 text-[10px]">必須</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="山田 太郎"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/60 focus:outline-none text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm transition-all"
                    />
                  </div>

                  {/* Postal code */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> 郵便番号（ハイフンなし7桁）<span className="text-red-400 text-[10px]">必須</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={postalCode}
                        onChange={(e) => handlePostalCode(e.target.value)}
                        placeholder="1500001"
                        maxLength={7}
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/60 focus:outline-none text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm transition-all pr-10"
                      />
                      {postalLoading && (
                        <Loader2 className="absolute right-3 top-3.5 w-4 h-4 text-amber-500 animate-spin" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">7桁入力で住所を自動補完します</p>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">
                      住所 <span className="text-red-400 text-[10px]">必須</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="東京都渋谷区恵比寿1-1-1"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/60 focus:outline-none text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> 電話番号 <span className="text-red-400 text-[10px]">必須</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09012345678"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/60 focus:outline-none text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> メールアドレス <span className="text-red-400 text-[10px]">必須</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/60 focus:outline-none text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm transition-all"
                    />
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {formError}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                  <BackBtn onClick={() => setStep(5)} />
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-base cursor-pointer transition-all"
                  >
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> 送信中...</>
                    ) : (
                      <>申込を送信する <ChevronRight className="w-5 h-5 stroke-[3]" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 7: Complete ── */}
            {step === 7 && (
              <motion.div key="s7"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                  className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-amber-400" />
                </motion.div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white">お申し込みを受け付けました！</h4>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    <span className="text-amber-400 font-bold">{customerName}</span> 様のご登録メールアドレスに確認メールをお送りしました。
                  </p>
                  <p className="text-xs text-gray-500">担当のレザーソムリエより2営業日以内にご連絡いたします。</p>
                </div>

                <div className="bg-[#181a26] border border-white/5 rounded-xl p-4 text-xs text-left space-y-2 w-full max-w-xs">
                  <p className="text-amber-400 font-bold text-center text-sm mb-3">査定概要</p>
                  <div className="flex justify-between text-gray-400">
                    <span>ブランド / モデル</span>
                    <span className="text-gray-200 text-right">{selectedBrand} / {selectedModel}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>状態</span>
                    <span className="text-gray-200">{selectedCondition.charAt(0)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-white/5">
                    <span className="text-gray-300">簡易査定金額</span>
                    <span className="text-amber-400 font-mono text-base">¥{assessmentAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 w-full text-center">
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                    無料梱包キット（段ボール・着払い伝票）を<br />ご自宅へお届けします。
                    お届け後に革ジャンを入れてご返送ください。
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 mx-auto cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3 h-3" /> 別の革ジャンを査定する
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
