import React, { useState } from "react";
import {
  Sparkles, Flame, Shield, Award, ChevronDown, Check, Bike, HelpCircle, 
  ArrowUpRight, Camera, Key, Lock, Heart, CheckSquare, Square, ThumbsUp, 
  MessageCircle, Star, ShoppingBag, Coins, Navigation, ArrowRight, CornerDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import AssessmentCalculator from "./components/AssessmentCalculator";
import OfficialAppraisal from "./components/OfficialAppraisal";
import LineSimulator from "./components/LineSimulator";
import TestimonialSlider from "./components/TestimonialSlider";
import FaqSection from "./components/FaqSection";

export default function App() {
  // Checklist states for targets
  const [checkedPains, setCheckedPains] = useState<number[]>([0, 2]); // Initial check for visual weight
  
  const pains = [
    {
      id: 0,
      text: "当時は凄く憧れて高金で購入した、思い入れのつまったSchottやルイスレザー。でも最近、体型や好みが変わって着る機会がすっかり減ってしまった。",
    },
    {
      id: 1,
      text: "重厚で厚みがあるためクローゼットで異次元の幅を取る。妻から「保管臭もするし何とかして」とチクチク小言を言われてストレス。",
    },
    {
      id: 2,
      text: "大切に手入れしてきた思い出の「相棒」なので、近所の総合リサイクル店で二束三文の査定額をつけられた時、自分の過去すら否定された気分で悲しかった。",
    },
    {
      id: 3,
      text: "メルカリやヤフオクへの出品も検討したが、肩幅・身幅等の細かいサイズ計測、擦れ箇所の撮影、購入希望者からの値下げ交渉と梱包・発送の手間に心が折れた。",
    }
  ];

  const togglePain = (id: number) => {
    if (checkedPains.includes(id)) {
      setCheckedPains(checkedPains.filter(p => p !== id));
    } else {
      setCheckedPains([...checkedPains, id]);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-200 font-sans selection:bg-amber-500 selection:text-black antialiased">
      
      {/* Upper Promo Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black py-2 px-4 text-center text-xs font-bold font-sans flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-black animate-pulse" />
        <span>【リューグー限定】現在ブランド＆ヴィンテージ革ジャンの「エイジング熟成加点」強化月間実施中！</span>
        <button 
          onClick={() => scrollToSection("calculator-anchor")}
          className="underline hover:no-underline font-black cursor-pointer hidden sm:inline ml-1"
        >
          今すぐ見積もる＆価格チェック →
        </button>
      </div>

      {/* Global Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#090a0f]/90 backdrop-blur-md border-b border-white/[0.04] py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded text-black font-semibold tracking-wider font-sans text-xs sm:text-sm">
              LIUGOO
            </div>
            <div>
              <div className="font-extrabold tracking-tighter text-white text-base sm:text-lg flex items-center gap-1">
                <span>リューグー・リユース</span>
                <span className="text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-500 py-0.5 px-1.5 rounded-sm">革ジャン専門</span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-gray-500">価値発見（加点）方式 鑑定引継ぎサービス</p>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-400">
            <button onClick={() => scrollToSection("pains-anchor")} className="hover:text-amber-400 transition-colors cursor-pointer select-none">
              バイカーの悩み
            </button>
            <button onClick={() => scrollToSection("features-anchor")} className="hover:text-amber-400 transition-colors cursor-pointer select-none">
              選ばれる3つの理由
            </button>
            <button onClick={() => scrollToSection("calculator-anchor")} className="hover:text-amber-400 transition-colors cursor-pointer select-none">
              無料自動査定
            </button>
            <button onClick={() => scrollToSection("line-anchor")} className="hover:text-amber-400 transition-colors cursor-pointer select-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LINE自慢体験
            </button>
            <button onClick={() => scrollToSection("testimonials-anchor")} className="hover:text-amber-400 transition-colors cursor-pointer select-none">
              お客様の声
            </button>
            <button onClick={() => scrollToSection("faqs-anchor")} className="hover:text-amber-400 transition-colors cursor-pointer select-none">
              よくある質問
            </button>
          </nav>

          {/* CTA header button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection("calculator-anchor")}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg flex items-center gap-1 shadow-md shadow-amber-500/15 cursor-pointer text-center"
            >
              <span>無料セルフ判定</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (ファーストビュー) */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:py-28 px-4 sm:px-6">
        
        {/* Background Overlay Visual */}
        <div className="absolute inset-0 z-0 bg-[#090a0f]">
          <img 
            src="/src/assets/images/leather_jacket_hero_1781243864115.jpg" 
            alt="革ジャン・ライダースジャケットのエレガントな経年変化"
            className="w-full h-full object-cover opacity-25 filter grayscale" 
            referrerPolicy="no-referrer"
          />
          {/* Moody vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-[#090a0f]/30"></div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-amber-500/[0.02] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs text-amber-400 font-bold tracking-wide">
              <Bike className="w-4 h-4 shrink-0" />
              <span>本物のアメカジ・バイク乗り達に捧ぐ、日本初の「加点評価」</span>
            </div>

            <div className="space-y-4">
              <p className="text-amber-500 font-mono tracking-widest text-xs sm:text-sm font-extrabold block">
                ◆ 洋服棚の奥で眠らせたままの「相棒」を、本当に必要な次の方へ紡ぎませんか？
              </p>
              
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none">
                <span className="block text-gray-400 text-lg sm:text-2xl font-normal tracking-normal mb-1">
                  総合古着屋の「一律減点」に、がっかりしていませんか？
                </span>
                その擦れも、シワも、<br className="hidden sm:inline" />
                すべてが最高峰の<br />
                <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent underline decoration-amber-500/40">「熟成価値（資産）」</span>になる。
              </h1>
            </div>

            {/* Subcopy */}
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              レザーを知り尽くした日本屈指の革ジャン専門会社だからこそできる<strong className="text-amber-400">「価値発見（加点）方式」</strong>。
              シワや味出し、年季はマイナス査定ではなく、<strong>次の主役へ引き継ぐ勲章</strong>として上乗せ加算。
              面倒なサイズ計測・取引対応を100%カットし、スマホでバトンタッチ。
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 pt-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-gray-500 text-[10px] block mb-1">セルフ判定スピード</span>
                <span className="font-mono font-black text-amber-400 text-sm sm:text-base">最短1分</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-gray-500 text-[10px] block mb-1">レザー鑑定満足度</span>
                <span className="font-mono font-black text-amber-400 text-sm sm:text-base">98.4%</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-gray-500 text-[10px] block mb-1">不当な一律減点</span>
                <span className="font-mono font-black text-amber-400 text-sm sm:text-base">完全ゼロ</span>
              </div>
            </div>

            {/* CTA Buttons row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => scrollToSection("calculator-anchor")}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 ring-4 ring-amber-500/15 hover:scale-[1.02] transition-all text-sm sm:text-base cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>スマホで1分！現在の想定額チェック</span>
                <ChevronDown className="w-5 h-5 animate-bounce stroke-[3]" />
              </button>

              <button
                onClick={() => scrollToSection("line-anchor")}
                className="w-full sm:w-auto bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all text-sm cursor-pointer"
              >
                <span>あなたの愛着を語る！LINE査定体験</span>
              </button>
            </div>

          </div>

          {/* Hero Visual Right: Floating preview of the actual process */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-75 -z-10"></div>
            
            <div className="bg-[#121420]/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] font-mono text-gray-500 tracking-wider">SECURE DIGITAL APPRAISER</span>
              </div>

              {/* Minimal preview image of jacket being valued */}
              <div className="relative rounded-lg overflow-hidden h-48 border border-white/5 bg-gray-950">
                <img 
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600" 
                  alt="Schott vintage Double Riders on display" 
                  className="w-full h-full object-cover filter brightness-75"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated AR sommelier scanner lines */}
                <div className="absolute inset-x-0 top-1/4 h-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse"></div>
                
                {/* Floating additions labels visually */}
                <span className="absolute bottom-3 left-3 bg-black/75 border border-amber-500/50 rounded px-2 py-0.5 text-[9px] font-mono text-amber-400 font-bold animate-bounce/5">
                  ✓ 【加点】美アコーディオンシワ +¥6,000
                </span>
                <span className="absolute top-4 right-4 bg-black/75 border border-emerald-500/50 rounded px-2 py-0.5 text-[9px] font-mono text-emerald-400 font-bold">
                  ✓ 【加点】極上茶芯の出現 +¥12,000
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>ITEM TYPE: Schott 613US ONE STAR</span>
                  <span className="text-emerald-400 font-bold">加算継続中</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-gray-400">プロ鑑定予想:</span>
                  <span className="text-xl font-mono text-amber-400 font-black tracking-tight">¥62,000 〜 ¥84,000</span>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("calculator-anchor")}
                className="w-full bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-xs py-2.5 rounded-lg font-bold transition-all"
              >
                あなたの相棒の「加点レンジ」を確かめる
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Guarantee Logos strip */}
      <section className="bg-[#11131c] py-6 border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-6 text-xs text-gray-400 font-bold">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>レザーソムリエ有資格ライター審査</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <span>安心の返送料・手数料100%全額無料</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span>最短当日スピードお振込み対応</span>
          </div>
        </div>
      </section>

      {/* Sympathy & Pain points section (共感・お悩み代弁) */}
      <section id="pains-anchor" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">TARGET AUDIENCE INTENT</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            「いつかまた着る」そう胸にしまいながら、<br className="sm:hidden" />
            何年も眠っている革ジャンはありませんか？
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
            クローゼット、そして家族のプレッシャーに葛藤する本物のレザー愛好家の皆様へ。一度チェックをつけて、あなたの状態と照らし合わせてみてください。
          </p>
        </div>

        {/* Dynamic interactive pain checkbox box */}
        <div className="max-w-3xl mx-auto bg-[#11131c] border border-white/[0.02] p-6 sm:p-8 rounded-2xl space-y-4 shadow-xl relative">
          <div className="absolute top-2 right-4 text-[9px] font-mono text-gray-500 select-none hidden sm:block">BIKER ATTACHMENT INDEX</div>
          
          <div className="space-y-3.5">
            {pains.map((p, idx) => {
              const isChecked = checkedPains.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePain(p.id)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-4 cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-amber-500/[0.06] border-amber-500/60 text-white"
                      : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-gray-400"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <div className="w-5 h-5 bg-amber-500 text-black rounded flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-gray-600 rounded bg-black/30"></div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dynamic feedback triggered by selections */}
          <AnimatePresence>
            {checkedPains.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed space-y-1"
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>そのお悩み、すべて「リューグー価値発見リユース」が解決します！</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-xs">
                  ご自身が育てた「相棒」を一律減点する、総合買取店で悲しい思いをされるのはもう終わりにしませんか？ 
                  愛着を正当評価し、納得の資金へ転換。さらに次のレザー愛好家という次のオーナーへのバトンタッチを私たちが完璧に保証いたします。
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => scrollToSection("features-anchor")}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-2 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>なぜリューグーなら他社と全く異なる価格が出せるのか？</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Solution Presentation 3-Step Section (画期的手軽さ) */}
      <section className="bg-[#0f111a] py-20 border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">SIMPLE 3-STEP SYSTEM</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              自宅にいながら「わずか1分」で完了。<br />あなたの革ジャンの価値をプロが正当に評価します！
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
              一切の面倒を排除。部屋から一歩も出ずに、あなたの大切な一着を最も気持ちよく、納得のいくスピードでバトンタッチできる仕組みです。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-[#141624] border border-white/[0.03] p-6 rounded-2xl relative space-y-4 hover:border-amber-500/30 transition-all group">
              <div className="absolute top-4 right-6 font-mono text-6xl font-black text-white/[0.02] group-hover:text-amber-500/[0.04] transition-colors leading-none pointer-events-none">01</div>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">STEP 01</span>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">簡単セルフ判定 ＆ LINE自慢入力</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  下段の自動見積もりから、ブランド・形状・こだわり加点箇所を入力するか、LINEからパシャパシャと4箇所の写真を撮って送るだけ。
                </p>
              </div>
              <div className="bg-[#0d0e15] py-2 px-3 rounded text-[11px] border border-white/[0.05] text-amber-400/90 font-mono">
                ✓ ご自身の手入れ・思い出を伝えるほど加算
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#141624] border border-white/[0.03] p-6 rounded-2xl relative space-y-4 hover:border-amber-500/30 transition-all group">
              <div className="absolute top-4 right-6 font-mono text-6xl font-black text-white/[0.02] group-hover:text-amber-500/[0.04] transition-colors leading-none pointer-events-none">02</div>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">STEP 02</span>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">無料郵送キット（箱）に詰めて送るだけ</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  査定目安にご納得いただけましたら、ご自宅に「無料梱包郵送キット」をお届け。革ジャンを詰め、着払い。自宅へ集荷が来るため発送も極めて簡単！
                </p>
              </div>
              <div className="bg-[#0d0e15] py-2 px-3 rounded text-[11px] border border-white/[0.05] text-amber-400/90 font-mono">
                ✓ 着払い伝票・緩衝材・段ボールすべて無料
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#141624] border border-white/[0.03] p-6 rounded-2xl relative space-y-4 hover:border-amber-500/30 transition-all group">
              <div className="absolute top-4 right-6 font-mono text-6xl font-black text-white/[0.02] group-hover:text-amber-500/[0.04] transition-colors leading-none pointer-events-none">03</div>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">STEP 03</span>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">最速スピードお振込み</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  到着後、レザーソムリエが精密なエイジング加点確認。ご提示した本査定金額にご納得いただけましたら、最速スピードでご指定口座へお振込。
                </p>
              </div>
              <div className="bg-[#0d0e15] py-2 px-3 rounded text-[11px] border border-white/[0.05] text-amber-400/90 font-mono">
                ✓ キャンセル返送料も当店が全額負担！
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-amber-500 font-semibold mb-2">※ 査定だけでもOK。まずは「相棒」の現在の潜在価値を遊び感覚で見てみるだけでの大歓迎です。</p>
          </div>

        </div>
      </section>

      {/* Benefits / USP Reasons (選ばれる3つの理由) */}
      <section id="features-anchor" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">OUR UNIQUE BENEFITS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            なぜリューグーが、多くの革ジャン愛好家・バイカーたちに選ばれるのか？<br />3つの強力な理由
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
            他ブランドの単なる「古いもの処分」とは一線を画す。革ジャン愛を正当に継承するためのプロフェッショナルな強みをご案内します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Reason 1 */}
          <div className="bg-[#11131c] border border-white/[0.02] p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform relative">
            <div className="space-y-4">
              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 w-fit">
                <MessageCircle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                理由 1：その場で金額がわかる「即時セルフ査定」＆愛が深まる「LINE無料自慢査定」
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                面倒な個人情報入力は一切不要。自動簡易シミュレーターを使ってその場で即座に査定目安レンジが表示されます。
                さらに「自分だけのライディング歴」や「こだわりのオイル保湿状態」をLINEから気軽に選んで、熱が注がれた分だけのプレミアム加点を受けることができます。
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[11px] text-amber-400 flex items-center gap-1.5 font-bold">
              <span>詳細のLINE自慢体験シミュレーターは下段搭載</span>
            </div>
          </div>

          {/* Reason 2 */}
          <div className="bg-[#11131c] border border-white/[0.02] p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform">
            <div className="space-y-4">
              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 w-fit">
                <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                理由 2：アタリ、シワ、擦れは誇り！「価値発見（加点）方式」
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                一般的なネット買取業者では「傷があるからマイナス」「シワがあるから-3,000円」と一律減点。
                しかし、アメカジやビンテージにおいてアタリや極上の「茶芯（下地が見える風合い）」、ライディングに伴う蛇腹シワは他と代えがたい【芸術（エイジング魅力）】。リューグーのレザーソムリエが、状態を「熟熟成」としてポジティブに現金加算します。
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[11px] text-emerald-400 flex items-center gap-1.5 font-bold">
              <span>美シワ・茶芯出現で最高 +¥15,000上乗せ実績あり</span>
            </div>
          </div>

          {/* Reason 3 */}
          <div className="bg-[#11131c] border border-white/[0.02] p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform">
            <div className="space-y-4">
              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 w-fit">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                理由 3：革を知り尽くした「レザー自社再生ノウハウ」と高い評価のブランド安心感
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                私たちは長年にわたりオリジナル本革ジャケットの展開から、ハイエンドなライダースの数々を販売する専門店。
                お預かりした革の最高ポテンシャルを引き出して再メンテナンス、クリーニングできる専門工房を直営しています。
                どんなにヤレた革でも最高級のクリーニング技術を持ち、次の大切にしてくれるバイカー、マニア層へ確実にバトンを渡せるため、限界ギリギリの高額買い付けが可能です。
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[11px] text-gray-500 flex items-center gap-1.5 font-mono">
              <span>DIRECT EXPORT & CARE SYSTEM</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Interactive Section: Official Appraisal System */}
      <section id="calculator-anchor" className="py-20 bg-gradient-to-b from-[#090a0f] via-[#10121d] to-[#090a0f] border-t border-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

          <div className="text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">REALTIME APPRAISAL SYSTEM</span>
            <h2 className="text-3xl font-black text-white">
              今すぐ査定額を確認 → そのまま本査定申込
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              ブランド・モデル・状態・詳細条件を選ぶだけ。リアルタイムで査定金額を表示します。<br />
              気に入ったらそのまま本査定を申し込んでください。送料・キャンセル料は完全無料です。
            </p>
          </div>

          <OfficialAppraisal />

          <AssessmentCalculator onOpenLine={() => scrollToSection("line-anchor")} />

        </div>
      </section>

      {/* LINE Appraiser Interactive Simulator Area */}
      <section id="line-anchor" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left instructions */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-[#06C755] font-mono font-bold block">VIRTUAL SOCIAL EXAMINER</span>
            <h2 className="text-3xl font-black text-white leading-tight">
              LINE「自慢入力フォーム」の<br className="hidden sm:inline" />流れをその場で体験！
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              LINE査定は無機質なシステムではありません。私たちが誇りに思うのは、<strong>「あなたと革ジャンのストーリー（愛情）を引き出し、それを加点に変換する温かい人間関係」</strong>。
            </p>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              右のシミュレーターの返答ボタンを押してみてください。
              オイルメンテナンス歴や、愛車（バイク）での旅の思い出を話すことで、当店のレザーソムリエがどのように愛情を受け止め、【上乗せ加算】するかがその場に浮かび上がります！
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-gray-400">
                <Check className="w-4 h-4 text-[#06C755] shrink-0" />
                <span>スマホ1台、メッセージの追加だけで簡単査定の準備完了</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-400">
                <Check className="w-4 h-4 text-[#06C755] shrink-0" />
                <span>傷の状態をそのまま自慢できる、安心のバトン譲渡式</span>
              </div>
            </div>
          </div>

          {/* Right LINE App Simulator Container */}
          <div className="lg:col-span-7">
            <LineSimulator />
          </div>

        </div>
      </section>

      {/* Customer Success Stories Testimonial Section (お客様の声) */}
      <section id="testimonials-anchor" className="py-20 bg-[#0c0d15] border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">VOICES OF EXPERIENCE</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              「クローゼットも心もスッキリしました！」<br className="sm:hidden" />
              お客様からの喜びの声
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
              実際に一律一掃リサイクル店。あるいは面倒なフリマ出品を避け、リューグーの鑑定を選んで頂いた40代会社員バイカー織田栄治さんなど、リアルな成功体験談です。
            </p>
          </div>

          <TestimonialSlider />

        </div>
      </section>

      {/* FAQ Section (よくある質問) */}
      <section id="faqs-anchor" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">よくあるご質問（FAQ）</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            ユーザー様が革ジャン本査定時やお振込、キャンセルに抱きやすい不安事項について、先回りして誠実にご回答いたします。
          </p>
        </div>

        <FaqSection />

      </section>

      {/* Final Back Push Call To Action Banner */}
      <section className="py-20 bg-gradient-to-br from-[#10121d] via-[#161a29] to-[#090a0f] border-t border-amber-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full scale-50"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold block">DECISION & FUTURE TRADING</span>
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              あなたの相棒の「今の価値」、<br className="sm:hidden" />今すぐ確かめてみませんか？
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              査定金額はその場ですぐに画面に表示されます。
              クローゼットの奥で眠らせたまま、年数が経って価値が下がってしまう前に。
              まずは1分、無料のセルフ査定（お宝探し）からお気軽にお試しください。
            </p>
          </div>

          {/* Main grand CTA Button */}
          <div className="space-y-4">
            <button
              onClick={() => scrollToSection("calculator-anchor")}
              className="w-full max-w-md mx-auto bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-5 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 border-b-4 border-amber-700 hover:border-amber-600 active:translate-y-0.5 active:border-b-2 hover:scale-[1.01] transition-all text-base sm:text-lg cursor-pointer select-none"
            >
              <Sparkles className="w-5 h-5 shrink-0 animate-spin" />
              <span>1分でわかる！現在の査定金額を今すぐチェックする（無料）</span>
              <ArrowRight className="w-5 h-5 shrink-0 stroke-[3]" />
            </button>
            <p className="text-[10px] text-gray-500">※会員登録不要・手数料キャンセル料完全無料・ノーリスクで簡単確認</p>
          </div>

          {/* Quick links to Line directly */}
          <div className="flex justify-center">
            <button
              onClick={() => scrollToSection("line-anchor")}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>LINE査定の流れ・詳細はこちら</span>
              <CornerDownRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Global Footer Area */}
      <footer className="bg-[#06070a] border-t border-white/[0.04] py-12 px-4 sm:px-6 text-gray-500 text-xs text-center">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 font-bold">
            <button onClick={() => scrollToSection("pains-anchor")} className="hover:text-amber-500 transition-colors cursor-pointer">バイカーの悩み</button>
            <button onClick={() => scrollToSection("features-anchor")} className="hover:text-amber-500 transition-colors cursor-pointer">誇れる3つの強み</button>
            <button onClick={() => scrollToSection("calculator-anchor")} className="hover:text-amber-500 transition-colors cursor-pointer">無料自動判定</button>
            <button onClick={() => scrollToSection("testimonials-anchor")} className="hover:text-amber-500 transition-colors cursor-pointer">思い出サクセス談</button>
            <button onClick={() => scrollToSection("faqs-anchor")} className="hover:text-amber-500 transition-colors cursor-pointer">よくある質問</button>
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <p className="font-extrabold text-white text-sm">Liugoo Leathers Reuse（リューグー・リユース）</p>
            <p className="text-[10px] text-gray-500">運営: リューグー株式会社 ｜ 東京都渋谷区恵比寿 | 古物商許可証番号 東京都公安委員会 第12345678号</p>
            <p className="text-[10px] leading-relaxed">
              当店は、Schott・Lewis Leathers・vansonをはじめとする一流アメカジ・ヴィンテージレザージャケットの専門クリーニング・買取再生引継ぎ専門店です。
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.03] space-y-4">
            <p className="text-[9px] text-gray-600">
              © {new Date().getFullYear()} Liugoo Leathers Reuse. All Rights Reserved. ※本サイト内のレビューおよび価格データはシミュレーション演出を含み、状態や時期で変動する本査定に基づきます。
            </p>
            
            {/* Elegant tiny credits avoiding margin clutter but keeping trust */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[9px]">レザーソムリエ常駐オフィシャル認証サイト</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
