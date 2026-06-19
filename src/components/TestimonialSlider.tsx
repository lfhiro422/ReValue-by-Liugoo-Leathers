import React, { useState } from "react";
import { TESTIMONIALS } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { User, ShieldAlert, BadgeCheck, Star, Sparkles, Bike } from "lucide-react";

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const current = TESTIMONIALS[activeIndex];

  return (
    <div className="w-full bg-[#11131c] border border-white/[0.03] rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Tab select bar */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-white/5 justify-center sm:justify-start">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeIndex === idx
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10 scale-105"
                : "bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-gray-400 hover:text-gray-200"
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>{t.name} (40〜50代)</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left: Persona profile detail */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative group mx-auto lg:mx-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-amber-500/50 block">
              <img
                src={current.avatarUrl}
                alt={current.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 py-0.5 px-2 rounded-full">
                  {current.bikerType.split("/")[0]}
                </span>
              </div>
            </div>

            <div className="text-center lg:text-left space-y-1">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <h4 className="text-xl font-bold text-white mb-0.5">{current.name}</h4>
                <span className="text-gray-400 text-sm">（{current.age}歳・会社員）</span>
              </div>
              <p className="text-xs text-amber-500 font-mono tracking-tight font-medium">
                {current.subTitle}
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
                <span className="text-xs text-white ml-2 font-bold font-mono">5.0 / 満足度極上</span>
              </div>
            </div>

            {/* Price Comparison Widget */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 shadow-inner">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 text-center">査定額 驚愕の対比データ</div>
              
              {/* Brick and Mortar flat deduction price */}
              <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-red-500/5 border border-red-500/10 text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  他古着総合ショップ（一律減点）
                </span>
                <span className="font-mono line-through">¥{current.estimatedPrice.toLocaleString()}円</span>
              </div>

              {/* Liugoo Approved Additions price */}
              <div className="flex flex-col p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                    リューグー「価値発見（加点）」
                  </span>
                  <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded">約{Math.round((current.finalPrice / current.estimatedPrice) * 10) / 10}倍！</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-[10px] text-gray-400 font-serif">最終お振込</span>
                  <span className="text-2xl font-mono text-amber-400 font-black tracking-tight">
                    ¥{current.finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <span className="text-[9px] text-gray-500 block text-center mt-1">※思い出を加算：美しいシワ・オイルお手入れ履歴がすべて鑑定加点に反映</span>
            </div>
          </div>

          {/* Right: Personal deep narrative */}
          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-amber-500 font-mono block">RIDER EXPERIENCE / SUCCESS STORY</span>
              <h5 className="text-xl sm:text-2xl font-black text-gray-100 leading-tight">
                「{current.storyTitle}」
              </h5>
            </div>

            {/* Gorgeous large quote bubble */}
            <div className="relative border-l-4 border-amber-500 pl-4 py-1 italic text-amber-100/90 font-bold bg-white/[0.01] p-3 rounded-r-xl">
              <span className="absolute -top-4 -left-1 text-5xl font-serif text-amber-500/20 pointer-events-none select-none">“</span>
              <p className="text-sm sm:text-base leading-relaxed">{current.quote}</p>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed space-y-3 whitespace-pre-line">
              <p>{current.fullText}</p>
            </div>

            {/* Jacket Specification sold tag */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
                <span className="text-[10px] text-gray-500 block">実際にお売りいただいた「相棒ジャケット」</span>
                <span className="text-xs font-bold text-gray-200">{current.jacketSold}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  相棒のエイジング（経年変化）が現金に！
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
