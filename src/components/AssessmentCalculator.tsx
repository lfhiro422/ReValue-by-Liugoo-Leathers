import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BRANDS, STYLE_OPTIONS, AGING_FACTORS } from "../data";
import { Award, Flame, Sparkles, Plus, Check, ChevronRight, RotateCcw, Shield, Map, Coins, HelpCircle } from "lucide-react";

interface AssessmentCalculatorProps {
  onOpenLine: () => void;
}

export default function AssessmentCalculator({ onOpenLine }: AssessmentCalculatorProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("schott");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("double");
  const [selectedAgingIds, setSelectedAgingIds] = useState<string[]>([]);
  const [yearsOwned, setYearsOwned] = useState<number>(5);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Real-time calculated price
  const calculateResult = () => {
    const brand = BRANDS.find((b) => b.id === selectedBrandId) || BRANDS[0];
    const style = STYLE_OPTIONS.find((s) => s.id === selectedStyleId) || STYLE_OPTIONS[0];
    
    let subtotal = brand.basePrice * style.multiplier;
    
    // Add years owned loyalty bonus (e.g., ¥800 per year up to 30 years to reward long-term companionship!)
    const yearsBonus = yearsOwned * 800;
    
    // Sum selected aging factor bonuses
    const activeFactors = AGING_FACTORS.filter((af) => selectedAgingIds.includes(af.id));
    const agingExtra = activeFactors.reduce((sum, af) => sum + af.bonusAmount, 0);
    
    const finalMin = Math.round(subtotal + yearsBonus + agingExtra * 0.85);
    const finalMax = Math.round((subtotal + yearsBonus + agingExtra) * 1.15);
    
    return {
      basePrice: brand.basePrice,
      styleMultiplier: style.multiplier,
      styleName: style.name,
      brandName: brand.name,
      yearsBonus,
      agingExtra,
      finalMin: Math.max(10000, Math.floor(finalMin / 1000) * 1000), // round to nearest thousand
      finalMax: Math.max(15000, Math.floor(finalMax / 1000) * 1000),
      totalAgingAdditionsCount: selectedAgingIds.length
    };
  };

  const currentResult = calculateResult();
  
  // For animated price counter ticker
  const [animatedMin, setAnimatedMin] = useState<number>(10000);
  const [animatedMax, setAnimatedMax] = useState<number>(15000);

  useEffect(() => {
    if (step === 4) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        setIsCalculating(false);
        // Instant tick to final values or step-up
        let startMin = currentResult.finalMin - 5000;
        let startMax = currentResult.finalMax - 7000;
        
        let minTicker = setInterval(() => {
          startMin += 500;
          if (startMin >= currentResult.finalMin) {
            setAnimatedMin(currentResult.finalMin);
            clearInterval(minTicker);
          } else {
            setAnimatedMin(startMin);
          }
        }, 30);

        let maxTicker = setInterval(() => {
          startMax += 700;
          if (startMax >= currentResult.finalMax) {
            setAnimatedMax(currentResult.finalMax);
            clearInterval(maxTicker);
          } else {
            setAnimatedMax(startMax);
          }
        }, 30);
        
        return () => {
          clearInterval(minTicker);
          clearInterval(maxTicker);
        };
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [step, selectedBrandId, selectedStyleId, selectedAgingIds, yearsOwned]);

  const toggleAgingFactor = (id: string) => {
    if (selectedAgingIds.includes(id)) {
      setSelectedAgingIds(selectedAgingIds.filter((item) => item !== id));
    } else {
      setSelectedAgingIds([...selectedAgingIds, id]);
    }
  };

  const handleReset = () => {
    setSelectedBrandId("schott");
    setSelectedStyleId("double");
    setSelectedAgingIds([]);
    setYearsOwned(5);
    setStep(1);
  };

  const selectedBrand = BRANDS.find(b => b.id === selectedBrandId);

  return (
    <div id="quick-calculator" className="w-full bg-[#11131c] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Golden Highlight Border Trim */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
      
      {/* Header Tabs */}
      <div className="px-6 py-4 bg-[#181a26]/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 flex items-center gap-2 text-sm sm:text-base">
              こだわり価値発見！ <span className="text-amber-400 text-xs py-0.5 px-2 bg-amber-500/10 rounded border border-amber-500/20">無料自動簡易査定</span>
            </h3>
            <p className="text-xs text-gray-400">1分であなたの相棒の「熟成度」を加点判定</p>
          </div>
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center gap-1.5 text-xs">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`px-2.5 py-1 rounded-md font-mono ${
                step === s
                  ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/25"
                  : step > s
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                  : "bg-white/5 text-gray-500 border border-white/5"
              }`}
            >
              {s === 4 ? "RESULT" : `0${s}`}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT BRAND */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs uppercase tracking-wider text-amber-500 font-mono block mb-1">Step 01 / Brand Selection</label>
                <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1">
                  査定する革ジャンの「ブランド」をお選びください
                </h4>
                <p className="text-xs text-gray-400 mt-1">※その他アメカジ・ミリタリー・ヴィンテージブランドもすべて歓迎します</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandId(brand.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between group transition-all relative overflow-hidden ${
                      selectedBrandId === brand.id
                        ? "bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/5 text-white"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-sm sm:text-base group-hover:text-amber-400 transition-colors">
                        {brand.name}
                      </span>
                      {selectedBrandId === brand.id && (
                        <div className="bg-amber-500 text-black p-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 truncate w-full">
                      代表モデル: {brand.popularModels.slice(0, 2).join(", ")}
                    </span>
                    {selectedBrandId === brand.id && (
                      <div className="absolute right-0 bottom-0 w-8 h-8 bg-amber-500/5 rounded-tl-full flex items-end justify-end p-1">
                        <span className="text-[9px] text-amber-400 font-bold">SELECT</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center cursor-pointer"
                >
                  <span>スタイル選択に進む</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT STYLE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs uppercase tracking-wider text-amber-500 font-mono block mb-1">Step 02 / Style Design</label>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  ライダースの「形状・スタイル」をお選びください
                </h4>
                <p className="text-xs text-gray-400 mt-1">選択されたスタイルにより、最新の流通相場掛け率(最高1.15倍)が自動適用されます</p>
              </div>

              <div className="space-y-3">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all relative ${
                      selectedStyleId === style.id
                        ? "bg-amber-500/10 border-amber-500/80 text-white"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedStyleId === style.id ? "border-amber-500 bg-amber-500" : "border-gray-600"
                      }`}>
                        {selectedStyleId === style.id && <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>}
                      </div>
                      <span className="text-sm sm:text-base font-semibold group-hover:text-amber-400">
                        {style.name}
                      </span>
                    </div>
                    {style.multiplier > 1.0 && (
                      <span className="text-[10px] sm:text-xs font-mono bg-amber-500/10 text-amber-400 font-bold py-0.5 px-2 rounded border border-amber-500/20">
                        相場価値 +{Math.round((style.multiplier - 1) * 100)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-6 rounded-xl flex items-center gap-2 justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>ブランド選択に戻る</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all justify-center cursor-pointer"
                >
                  <span>愛着（エイジング加点）入力へ</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: AGING & VALUE DISCOVERY */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs uppercase tracking-wider text-amber-500 font-mono block mb-1">Step 03 / Value Discovery & Aging</label>
                <h4 className="text-lg sm:text-xl font-bold text-white flex items-center flex-wrap gap-2">
                  あなたが大切に育てた「自慢のエイジング・こだわり」を選択
                </h4>
                <p className="text-xs text-amber-400 font-medium mt-1">
                  ★リューグーの独自指標！ 他店では【すれキズ＝減点】される項目も、当店なら【ヴィンテージ成熟度】としてすべて【現金加点評価】致します。
                </p>
              </div>

              {/* Companion Tenure Slider */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-gray-300">この革ジャンの所有年数（相棒歴）</span>
                  <span className="font-mono text-amber-400 font-bold text-base bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {yearsOwned} 年間
                  </span>
                </div>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={yearsOwned}
                    onChange={(e) => setYearsOwned(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>1年（大切にお試し）</span>
                    <span>10年（貫禄）</span>
                    <span>20年以上（熟成ゴールド）</span>
                  </div>
                </div>
              </div>

              {/* Aging Checkbox Grid */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {AGING_FACTORS.map((factor) => {
                  const isChecked = selectedAgingIds.includes(factor.id);
                  let iconElement = <Sparkles className="w-4 h-4" />;
                  if (factor.id === "creases") iconElement = <Flame className="w-4 h-4" />;
                  if (factor.id === "liner") iconElement = <Shield className="w-4 h-4" />;
                  if (factor.id === "treatment") iconElement = <Sparkles className="w-4 h-4" />;
                  
                  return (
                    <div
                      key={factor.id}
                      onClick={() => toggleAgingFactor(factor.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 cursor-pointer select-none transition-all ${
                        isChecked
                          ? "bg-amber-500/[0.08] border-amber-500/80 text-white"
                          : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? "border-amber-500 bg-amber-500 text-black" : "border-gray-600 bg-black/30"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs sm:text-sm font-bold ${isChecked ? "text-amber-400" : "text-gray-300"}`}>
                              {factor.name}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                              <Plus className="w-2 h-2" />
                              加点査定！
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{factor.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold block">
                          +¥{factor.bonusAmount.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-gray-500 block">加点目安</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action Area */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-6 rounded-xl flex items-center gap-2 justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>スタイルに戻る</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-4 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all text-base justify-center cursor-pointer"
                >
                  <span>AI×レザーソムリエ 加点スピード査定を実行</span>
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: RESULT / INTERACTIVE QUOTE */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {isCalculating ? (
                /* Simulated Loading Screen */
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/10"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-mono text-xs text-amber-500 tracking-widest animate-pulse">ANALYZING SPECIFICATIONS...</p>
                    <h5 className="font-bold text-gray-200">AI＆レザーソムリエが「熟成加点」を計算中</h5>
                    <p className="text-xs text-gray-400 max-w-xs">一律減点のリサイクルショップデータベースと異なり、あなたが育てたエイジング（擦れ、シワ、オイル質感）をポジティブ加点に組み替えています...</p>
                  </div>
                </div>
              ) : (
                /* Appraisal Certificate Result */
                <div className="space-y-5">
                  <div className="bg-gradient-to-br from-[#1c1f2e] to-[#121420] border border-amber-500/30 p-5 sm:p-6 rounded-2xl relative overflow-hidden shadow-inner">
                    {/* Security watermark pattern */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] border-4 border-amber-500 rounded-full pointer-events-none flex items-center justify-center">
                      <span className="font-mono font-bold text-lg select-none">LIUGOO REUSE APPROVED</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 tracking-wider block">APPROVED ESTIMATE</span>
                        <h4 className="text-sm font-bold text-gray-300">リューグー価値発見：簡易鑑定書</h4>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 animate-bounce">
                        加点評価完了！
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 text-xs">
                      <div>
                        <span className="text-gray-500 block">ご査定ブランド</span>
                        <span className="font-bold text-gray-200 text-sm sm:text-base">{currentResult.brandName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">スタイル形状</span>
                        <span className="font-bold text-gray-200">{currentResult.styleName.split("（")[0]}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">お付き合い歴（相棒歴）</span>
                        <span className="font-semibold text-amber-400 font-mono text-sm">{yearsOwned} 年（長期加点適用）</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">見つかった誇るべき加点箇所</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">{currentResult.totalAgingAdditionsCount} 箇所（加算：+¥{currentResult.agingExtra.toLocaleString()}）</span>
                      </div>
                    </div>

                    {/* Highly stylized ticking final price */}
                    <div className="py-6 text-center space-y-1">
                      <span className="text-xs text-gray-400 block tracking-wider">★減点されない、加点方式の本革買取予想レンジ</span>
                      <div className="flex items-baseline justify-center gap-2 flex-wrap">
                        <span className="text-gray-400 text-xs sm:text-sm font-semibold">目安査定額</span>
                        <span className="text-3xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight glow-text drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                          ¥{animatedMin.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm sm:text-xl font-bold font-mono">〜</span>
                        <span className="text-3xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight glow-text drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                          ¥{animatedMax.toLocaleString()}
                        </span>
                        <span className="text-emerald-400 text-sm font-bold block sm:inline ml-1">(税込)</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        ※近所の何でもリサイクル店で「{selectedBrand?.basePrice ? Math.floor(selectedBrand.basePrice * 0.15).toLocaleString() : "4,000"}円」と言われた革ジャンも、驚きの評価に育っている場合がございます！
                      </p>
                    </div>

                    {/* Breakdown bar */}
                    <div className="mt-2 space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>ベースモデル参考市場価格:</span>
                        <span className="font-mono">¥{(selectedBrand?.basePrice || 35000).toLocaleString()}</span>
                      </div>
                      {yearsOwned > 0 && (
                        <div className="flex justify-between text-amber-400">
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
                    </div>
                  </div>

                  <div className="bg-amber-500/5 text-gray-300 rounded-xl p-4 border border-amber-500/20 text-xs leading-relaxed space-y-2">
                    <h5 className="font-bold text-amber-400 flex items-center gap-1">
                      💡 さらに高額に？LINE無料自慢査定で「愛着の歴史」を聞かせてください
                    </h5>
                    <p>
                      この金額はあくまで簡易見積もりです。LINEの<strong>「自慢入力フォーム」</strong>で「いつ頃どこにツーリングへ連れて行ったか」「どんな手入れをしてきたか」といった物語（ストーリー）を自慢してください。本査定でさらにレザーソムリエが喜びの熱血加点(最高1.5倍)をお付けします！
                    </p>
                  </div>

                  {/* Multi-action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 font-medium py-3 px-5 rounded-xl flex items-center gap-2 justify-center cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>もう一度試す</span>
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
