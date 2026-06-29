import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { STYLE_OPTIONS, AGING_FACTORS } from "../data";
import { usePriceData } from "../hooks/usePriceData";
import {
  Award, Flame, Sparkles, Plus, Check, ChevronRight, RotateCcw,
  Shield, AlertCircle, RefreshCw,
} from "lucide-react";

interface AssessmentCalculatorProps {
  onOpenLine: () => void;
}

const STEP_LABELS = ["01", "02", "03", "04", "RESULT"];

export default function AssessmentCalculator({ onOpenLine }: AssessmentCalculatorProps) {
  const { data: priceData, isLoading: priceLoading, error: priceError, refetch } = usePriceData();

  const [step, setStep] = useState(1);

  // Step 1
  const [selectedBrand, setSelectedBrand] = useState("");
  // Step 2
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  // Step 3 (style — from STYLE_OPTIONS, unchanged)
  const [selectedStyleId, setSelectedStyleId] = useState("double");
  // Step 4 — GAS adjustments
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [hasMold, setHasMold] = useState(false);
  const [hasSmell, setHasSmell] = useState(false);
  // Step 4 — existing aging bonuses (unchanged)
  const [yearsOwned, setYearsOwned] = useState(5);
  const [selectedAgingIds, setSelectedAgingIds] = useState<string[]>([]);

  // Step 5 animation
  const [isCalculating, setIsCalculating] = useState(false);
  const [animatedMin, setAnimatedMin] = useState(10000);
  const [animatedMax, setAnimatedMax] = useState(15000);

  // Unique brands from GAS
  const brands = useMemo(
    () => (priceData ? [...new Set(priceData.prices.map((p) => p.brand))] : []),
    [priceData]
  );

  // Models for the selected brand
  const models = useMemo(
    () =>
      priceData && selectedBrand
        ? priceData.prices.filter((p) => p.brand === selectedBrand).map((p) => p.model)
        : [],
    [priceData, selectedBrand]
  );

  // Reset model + condition when brand changes
  useEffect(() => {
    setSelectedModel("");
    setSelectedCondition("");
  }, [selectedBrand]);

  // Base price from GAS
  const gasBasePrice = useMemo(
    () =>
      priceData && selectedBrand && selectedModel
        ? (priceData.prices.find((p) => p.brand === selectedBrand && p.model === selectedModel)?.price ?? 0)
        : 0,
    [priceData, selectedBrand, selectedModel]
  );

  const calculateResult = () => {
    if (!priceData) return null;

    const conditionMultiplier = priceData.conditions[selectedCondition] ?? 1.0;
    const style = STYLE_OPTIONS.find((s) => s.id === selectedStyleId) ?? STYLE_OPTIONS[0];

    const subtotal = Math.round(gasBasePrice * conditionMultiplier * style.multiplier);

    const adj = priceData.adjustments;
    const sizeAdj     = (selectedSize     && adj["サイズ"]?.[selectedSize])     || 0;
    const materialAdj = (selectedMaterial && adj["素材"]?.[selectedMaterial])   || 0;
    const colorAdj    = (selectedColor    && adj["カラー"]?.[selectedColor])    || 0;
    const moldAdj     = hasMold  ? (adj["カビ"]?.["カビあり"]   ?? 0) : 0;
    const smellAdj    = hasSmell ? (adj["臭い"]?.["臭いあり"]  ?? 0) : 0;
    const gasAdjTotal = sizeAdj + materialAdj + colorAdj + moldAdj + smellAdj;

    // Existing bonuses (unchanged)
    const yearsBonus  = yearsOwned * 800;
    const activeFactors = AGING_FACTORS.filter((af) => selectedAgingIds.includes(af.id));
    const agingExtra  = activeFactors.reduce((sum, af) => sum + af.bonusAmount, 0);

    const total = subtotal + yearsBonus + agingExtra + gasAdjTotal;

    return {
      gasBasePrice,
      conditionMultiplier,
      styleName: style.name,
      styleMultiplier: style.multiplier,
      subtotal,
      gasAdjTotal,
      yearsBonus,
      agingExtra,
      finalMin: Math.max(10000, Math.floor((total * 0.85) / 1000) * 1000),
      finalMax: Math.max(15000, Math.floor((total * 1.15) / 1000) * 1000),
      totalAgingAdditionsCount: selectedAgingIds.length,
    };
  };

  const currentResult = calculateResult();

  useEffect(() => {
    if (step !== 5 || !currentResult) return;
    setIsCalculating(true);
    const timer = setTimeout(() => {
      setIsCalculating(false);
      let sMin = currentResult.finalMin - 5000;
      let sMax = currentResult.finalMax - 7000;
      const minTick = setInterval(() => {
        sMin += 500;
        if (sMin >= currentResult.finalMin) { setAnimatedMin(currentResult.finalMin); clearInterval(minTick); }
        else setAnimatedMin(sMin);
      }, 30);
      const maxTick = setInterval(() => {
        sMax += 700;
        if (sMax >= currentResult.finalMax) { setAnimatedMax(currentResult.finalMax); clearInterval(maxTick); }
        else setAnimatedMax(sMax);
      }, 30);
      return () => { clearInterval(minTick); clearInterval(maxTick); };
    }, 1500);
    return () => clearTimeout(timer);
  }, [step]);

  const toggleAgingFactor = (id: string) =>
    setSelectedAgingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleReset = () => {
    setSelectedBrand(""); setSelectedModel(""); setSelectedCondition("");
    setSelectedStyleId("double");
    setSelectedSize(""); setSelectedMaterial(""); setSelectedColor("");
    setHasMold(false); setHasSmell(false);
    setYearsOwned(5); setSelectedAgingIds([]);
    setStep(1);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (priceLoading) {
    return (
      <div id="quick-calculator" className="w-full bg-[#11131c] border border-camel-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-camel-500 via-camel-400 to-camel-600" />
        <div className="p-16 flex flex-col items-center justify-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-camel-500/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-camel-500 animate-spin" />
          </div>
          <p className="text-camel-500 font-mono text-xs tracking-widest animate-pulse">相場データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (priceError || !priceData) {
    return (
      <div id="quick-calculator" className="w-full bg-[#11131c] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-400" />
        <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <div>
            <p className="font-bold text-gray-200">相場データの取得に失敗しました</p>
            <p className="text-xs text-gray-400 mt-1">{priceError}</p>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 bg-camel-500/10 border border-camel-500/30 text-camel-400 font-semibold py-2 px-5 rounded-lg hover:bg-camel-500/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div id="quick-calculator" className="w-full bg-[#11131c] border border-camel-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-camel-500 via-camel-400 to-camel-600" />

      {/* Header */}
      <div className="px-6 py-4 bg-[#181a26]/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-camel-500/10 p-2 rounded-lg border border-camel-500/30">
            <Award className="w-5 h-5 text-camel-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 flex items-center gap-2 text-sm sm:text-base">
              こだわり価値発見！{" "}
              <span className="text-camel-400 text-xs py-0.5 px-2 bg-camel-500/10 rounded border border-camel-500/20">
                無料自動簡易査定
              </span>
            </h3>
            <p className="text-xs text-gray-400">1分であなたの相棒の「熟成度」を加点判定</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5 text-xs">
          {STEP_LABELS.map((label, idx) => {
            const s = idx + 1;
            return (
              <div
                key={s}
                className={`px-2.5 py-1 rounded-md font-mono ${
                  step === s
                    ? "bg-camel-500 text-black font-bold shadow-md shadow-camel-500/25"
                    : step > s
                    ? "bg-camel-500/20 text-camel-500 border border-camel-500/30"
                    : "bg-white/5 text-gray-500 border border-white/5"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: BRAND ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-wider text-camel-500 font-mono block mb-1">Step 01 / Brand Selection</label>
                <h4 className="text-lg sm:text-xl font-bold text-white">査定する革ジャンの「ブランド」をお選びください</h4>
                <p className="text-xs text-gray-400 mt-1">※その他アメカジ・ミリタリー・ヴィンテージブランドもすべて歓迎します</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {brands.map((brand) => {
                  const brandModels = priceData.prices.filter((p) => p.brand === brand).map((p) => p.model);
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between group transition-all relative overflow-hidden ${
                        selectedBrand === brand
                          ? "bg-camel-500/10 border-camel-500/80 shadow-lg shadow-camel-500/5 text-white"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm sm:text-base group-hover:text-camel-400 transition-colors">{brand}</span>
                        {selectedBrand === brand && (
                          <div className="bg-camel-500 text-black p-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 truncate w-full">
                        代表モデル: {brandModels.slice(0, 2).join(", ")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedBrand}
                  className="bg-burgundy-500 hover:bg-burgundy-400 active:bg-burgundy-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                  <span>モデル・状態選択に進む</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: MODEL + CONDITION ──────────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-camel-500 font-mono block mb-1">Step 02 / Model & Condition</label>
                <h4 className="text-lg sm:text-xl font-bold text-white">モデルとコンディションをお選びください</h4>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400">
                  モデル <span className="text-camel-400">（{selectedBrand}）</span>
                </p>
                {models.map((model) => {
                  const price = priceData.prices.find((p) => p.brand === selectedBrand && p.model === model)?.price ?? 0;
                  return (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between group transition-all ${
                        selectedModel === model
                          ? "bg-camel-500/10 border-camel-500/80 text-white"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedModel === model ? "border-camel-500 bg-camel-500" : "border-gray-600"}`}>
                          {selectedModel === model && <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />}
                        </div>
                        <span className="text-sm font-semibold group-hover:text-camel-400">{model}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500">基準価格 ¥{price.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400">コンディション（状態）</p>
                <p className="text-xs text-gray-500">状態に応じた掛け率が基準価格に乗算されます</p>
                {Object.entries(priceData.conditions).map(([label, multiplier]) => (
                  <button
                    key={label}
                    onClick={() => setSelectedCondition(label)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between group transition-all ${
                      selectedCondition === label
                        ? "bg-camel-500/10 border-camel-500/80 text-white"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCondition === label ? "border-camel-500 bg-camel-500" : "border-gray-600"}`}>
                        {selectedCondition === label && <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />}
                      </div>
                      <span className="text-sm font-semibold group-hover:text-camel-400">{label}</span>
                    </div>
                    <span className="text-xs font-mono bg-camel-500/10 text-camel-400 px-2 py-0.5 rounded border border-camel-500/20">
                      ×{multiplier.toFixed(1)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
                <button onClick={() => setStep(1)} className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-6 rounded-xl flex items-center gap-2 justify-center">
                  <RotateCcw className="w-4 h-4 shrink-0" /><span>ブランド選択に戻る</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedModel || !selectedCondition}
                  className="bg-burgundy-500 hover:bg-burgundy-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all justify-center"
                >
                  <span>スタイル選択に進む</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: STYLE ─────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-wider text-camel-500 font-mono block mb-1">Step 03 / Style Design</label>
                <h4 className="text-lg sm:text-xl font-bold text-white">ライダースの「形状・スタイル」をお選びください</h4>
                <p className="text-xs text-gray-400 mt-1">選択されたスタイルにより、最新の流通相場掛け率（最高1.15倍）が自動適用されます</p>
              </div>

              <div className="space-y-3">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all ${
                      selectedStyleId === style.id
                        ? "bg-camel-500/10 border-camel-500/80 text-white"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedStyleId === style.id ? "border-camel-500 bg-camel-500" : "border-gray-600"}`}>
                        {selectedStyleId === style.id && <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />}
                      </div>
                      <span className="text-sm sm:text-base font-semibold group-hover:text-camel-400">{style.name}</span>
                    </div>
                    {style.multiplier > 1.0 && (
                      <span className="text-[10px] sm:text-xs font-mono bg-camel-500/10 text-camel-400 font-bold py-0.5 px-2 rounded border border-camel-500/20">
                        相場価値 +{Math.round((style.multiplier - 1) * 100)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
                <button onClick={() => setStep(2)} className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-6 rounded-xl flex items-center gap-2 justify-center">
                  <RotateCcw className="w-4 h-4 shrink-0" /><span>前のステップに戻る</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-burgundy-500 hover:bg-burgundy-400 active:bg-burgundy-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all justify-center"
                >
                  <span>調整・加点項目へ</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: ADJUSTMENTS + AGING ───────────────────────────── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-wider text-camel-500 font-mono block mb-1">Step 04 / Adjustments & Aging</label>
                <h4 className="text-lg sm:text-xl font-bold text-white">サイズ・素材・カラーと「こだわりエイジング」を選択</h4>
                <p className="text-xs text-camel-400 font-medium mt-1">
                  ★リューグーの独自指標！ 他店では減点される項目も、当店なら【ヴィンテージ成熟度】として現金加点評価します。
                </p>
              </div>

              {/* GAS adjustments: Size / Material / Color */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-4">
                <p className="text-xs text-camel-500 font-mono uppercase tracking-wider">基本調整項目</p>

                {(["サイズ", "素材", "カラー"] as const).map((cat) => {
                  const opts = priceData.adjustments[cat];
                  if (!opts) return null;
                  const selected = cat === "サイズ" ? selectedSize : cat === "素材" ? selectedMaterial : selectedColor;
                  const setter   = cat === "サイズ" ? setSelectedSize : cat === "素材" ? setSelectedMaterial : setSelectedColor;
                  return (
                    <div key={cat} className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-300">{cat}</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(opts).map(([opt, amt]) => (
                          <button
                            key={opt}
                            onClick={() => setter(opt)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              selected === opt
                                ? "bg-camel-500/15 border-camel-500/80 text-camel-400"
                                : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            {opt}
                            {amt !== 0 && (
                              <span className={`ml-1.5 font-mono ${amt > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {amt > 0 ? "+" : "-"}¥{Math.abs(amt).toLocaleString()}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Mold + Smell */}
                <div className="space-y-2 pt-1">
                  {priceData.adjustments["カビ"]?.["カビあり"] !== undefined && (
                    <div
                      onClick={() => setHasMold(!hasMold)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                        hasMold ? "bg-red-500/10 border-red-500/50 text-red-300" : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${hasMold ? "border-red-500 bg-red-500 text-white" : "border-gray-600 bg-black/30"}`}>
                        {hasMold && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold">カビあり</span>
                      <span className="ml-auto text-xs font-mono text-red-400">
                        ¥{(priceData.adjustments["カビ"]["カビあり"]).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {priceData.adjustments["臭い"]?.["臭いあり"] !== undefined && (
                    <div
                      onClick={() => setHasSmell(!hasSmell)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                        hasSmell ? "bg-red-500/10 border-red-500/50 text-red-300" : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${hasSmell ? "border-red-500 bg-red-500 text-white" : "border-gray-600 bg-black/30"}`}>
                        {hasSmell && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold">臭いあり</span>
                      <span className="ml-auto text-xs font-mono text-red-400">
                        ¥{(priceData.adjustments["臭い"]["臭いあり"]).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing: years slider */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                <p className="text-xs text-camel-500 font-mono uppercase tracking-wider">愛着育成・エイジング加点</p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-gray-300">この革ジャンの所有年数（相棒歴）</span>
                  <span className="font-mono text-camel-400 font-bold text-base bg-camel-500/10 px-2.5 py-0.5 rounded border border-camel-500/20">
                    {yearsOwned} 年間
                  </span>
                </div>
                <input
                  type="range" min="1" max="25" value={yearsOwned}
                  onChange={(e) => setYearsOwned(parseInt(e.target.value))}
                  className="w-full accent-camel-400 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>1年（大切にお試し）</span><span>10年（貫禄）</span><span>20年以上（熟成ゴールド）</span>
                </div>
              </div>

              {/* Existing: AGING_FACTORS */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {AGING_FACTORS.map((factor) => {
                  const isChecked = selectedAgingIds.includes(factor.id);
                  let iconElement = <Sparkles className="w-4 h-4" />;
                  if (factor.id === "creases") iconElement = <Flame className="w-4 h-4" />;
                  if (factor.id === "liner")   iconElement = <Shield className="w-4 h-4" />;
                  return (
                    <div
                      key={factor.id}
                      onClick={() => toggleAgingFactor(factor.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 cursor-pointer select-none transition-all ${
                        isChecked
                          ? "bg-camel-500/[0.08] border-camel-500/80 text-white"
                          : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isChecked ? "border-camel-500 bg-camel-500 text-black" : "border-gray-600 bg-black/30"}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs sm:text-sm font-bold ${isChecked ? "text-camel-400" : "text-gray-300"}`}>{factor.name}</span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                              <Plus className="w-2 h-2" />加点査定！
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{factor.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold block">+¥{factor.bonusAmount.toLocaleString()}</span>
                        <span className="text-[9px] text-gray-500 block">加点目安</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
                <button onClick={() => setStep(3)} className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-6 rounded-xl flex items-center gap-2 justify-center">
                  <RotateCcw className="w-4 h-4 shrink-0" /><span>スタイルに戻る</span>
                </button>
                <button
                  onClick={() => setStep(5)}
                  disabled={!selectedSize || !selectedMaterial || !selectedColor}
                  className="bg-gradient-to-r from-burgundy-600 to-burgundy-500 hover:from-burgundy-500 hover:to-burgundy-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-burgundy-500/20 hover:scale-[1.02] active:scale-95 transition-all text-base justify-center"
                >
                  <span>AI×レザーソムリエ 加点スピード査定を実行</span>
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5: RESULT ────────────────────────────────────────── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              {isCalculating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-camel-500/10" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-camel-500 animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-mono text-xs text-camel-500 tracking-widest animate-pulse">ANALYZING SPECIFICATIONS...</p>
                    <h5 className="font-bold text-gray-200">AI＆レザーソムリエが「熟成加点」を計算中</h5>
                    <p className="text-xs text-gray-400 max-w-xs">一律減点のリサイクルショップデータベースと異なり、あなたが育てたエイジングをポジティブ加点に組み替えています...</p>
                  </div>
                </div>
              ) : currentResult && (
                <div className="space-y-5">
                  <div className="bg-gradient-to-br from-[#1c1f2e] to-[#121420] border border-camel-500/30 p-5 sm:p-6 rounded-2xl relative overflow-hidden shadow-inner">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] border-4 border-camel-500 rounded-full pointer-events-none flex items-center justify-center">
                      <span className="font-mono font-bold text-lg select-none">LIUGOO REUSE APPROVED</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-camel-500 tracking-wider block">APPROVED ESTIMATE</span>
                        <h4 className="text-sm font-bold text-gray-300">リューグー価値発見：簡易鑑定書</h4>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 animate-bounce">
                        加点評価完了！
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 text-xs">
                      <div>
                        <span className="text-gray-500 block">ご査定ブランド</span>
                        <span className="font-bold text-gray-200 text-sm">{selectedBrand}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">モデル</span>
                        <span className="font-bold text-gray-200">{selectedModel}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">コンディション</span>
                        <span className="font-semibold text-camel-400 font-mono">
                          {selectedCondition.split("：")[0]}ランク（×{currentResult.conditionMultiplier.toFixed(1)}）
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">スタイル形状</span>
                        <span className="font-bold text-gray-200">{currentResult.styleName.split("（")[0]}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">お付き合い歴</span>
                        <span className="font-semibold text-camel-400 font-mono">{yearsOwned} 年（長期加点適用）</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">エイジング加点箇所</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {currentResult.totalAgingAdditionsCount} 箇所（+¥{currentResult.agingExtra.toLocaleString()}）
                        </span>
                      </div>
                    </div>

                    <div className="py-6 text-center space-y-1">
                      <span className="text-xs text-gray-400 block tracking-wider">★減点されない、加点方式の本革買取予想レンジ</span>
                      <div className="flex items-baseline justify-center gap-2 flex-wrap">
                        <span className="text-gray-400 text-xs sm:text-sm font-semibold">目安査定額</span>
                        <span className="text-3xl sm:text-5xl font-mono font-black text-camel-400 tracking-tight drop-shadow-[0_0_15px_rgba(193,154,107,0.2)]">
                          ¥{animatedMin.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm sm:text-xl font-bold font-mono">〜</span>
                        <span className="text-3xl sm:text-5xl font-mono font-black text-camel-400 tracking-tight drop-shadow-[0_0_15px_rgba(193,154,107,0.2)]">
                          ¥{animatedMax.toLocaleString()}
                        </span>
                        <span className="text-emerald-400 text-sm font-bold block sm:inline ml-1">(税込)</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-2 space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>基準価格（{selectedModel}）:</span>
                        <span className="font-mono">¥{currentResult.gasBasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>状態掛け率 × スタイル掛け率 ＝ 基礎査定額:</span>
                        <span className="font-mono">
                          ×{currentResult.conditionMultiplier.toFixed(1)} × {currentResult.styleMultiplier.toFixed(2)} ＝ ¥{currentResult.subtotal.toLocaleString()}
                        </span>
                      </div>
                      {currentResult.yearsBonus > 0 && (
                        <div className="flex justify-between text-camel-400">
                          <span>愛着育成・長寿メンテボーナス:</span>
                          <span className="font-mono font-bold">+¥{currentResult.yearsBonus.toLocaleString()}</span>
                        </div>
                      )}
                      {currentResult.agingExtra > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>エイジング美点加算額 ({currentResult.totalAgingAdditionsCount}点):</span>
                          <span className="font-mono font-bold">+¥{currentResult.agingExtra.toLocaleString()}</span>
                        </div>
                      )}
                      {currentResult.gasAdjTotal !== 0 && (
                        <div className={`flex justify-between ${currentResult.gasAdjTotal < 0 ? "text-red-400" : "text-emerald-400"}`}>
                          <span>サイズ・素材・カラー等調整:</span>
                          <span className="font-mono font-bold">
                            {currentResult.gasAdjTotal > 0 ? "+" : "-"}¥{Math.abs(currentResult.gasAdjTotal).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-camel-500/5 text-gray-300 rounded-xl p-4 border border-camel-500/20 text-xs leading-relaxed space-y-2">
                    <h5 className="font-bold text-camel-400 flex items-center gap-1">
                      💡 さらに高額に？LINE無料自慢査定で「愛着の歴史」を聞かせてください
                    </h5>
                    <p>
                      この金額はあくまで簡易見積もりです。LINEの<strong>「自慢入力フォーム」</strong>で「いつ頃どこにツーリングへ連れて行ったか」「どんな手入れをしてきたか」といった物語（ストーリー）を自慢してください。本査定でさらにレザーソムリエが喜びの熱血加点（最高1.5倍）をお付けします！
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button onClick={handleReset} className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-5 rounded-xl flex items-center gap-2 justify-center cursor-pointer">
                      <RotateCcw className="w-4 h-4" /><span>もう一度試す</span>
                    </button>
                    <button
                      onClick={onOpenLine}
                      className="flex-1 bg-gradient-to-r from-[#06C755] to-[#05b04a] hover:from-[#05b04a] hover:to-[#04a042] text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-green-600/15 hover:scale-[1.02] active:scale-95 transition-all text-base cursor-pointer"
                    >
                      <span className="bg-white text-[#06C755] rounded-full p-0.5 text-[10px] font-sans font-black w-5 h-5 flex items-center justify-center shrink-0">LINE</span>
                      <span>「愛着ストーリー」を語ってLINE無料自慢査定</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
