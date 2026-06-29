import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle, Smile, Camera, User, BadgeAlert, Plus } from "lucide-react";

interface Message {
  id: string;
  sender: "sommelier" | "user";
  text: string;
  time: string;
  image?: string;
  bonusTag?: string;
}

export default function LineSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "sommelier",
      text: "こんにちは！レザージャケット査定専門会社『ReValue by Liugoo Leathers』のレザーソムリエAIと人間鑑定士ハイブリッド査定ラインへようこそ！🏍️",
      time: "22:55"
    },
    {
      id: "m2",
      sender: "sommelier",
      text: "私たちは一般的な何でも古着屋さんと異なり、あなたの相棒との思い出や、育てられた『シワ・茶芯などのエイジング（熟成）』を徹底的に【加点】する『価値発見方式』を採用しています。",
      time: "22:55"
    },
    {
      id: "m3",
      sender: "sommelier",
      text: "査定したい革ジャンの状態や、あなたが注いだ愛着について教えてください。以下から気になるお話（自慢・状態）を選んでみてください！👇",
      time: "22:56"
    }
  ]);

  const [activeActions, setActiveActions] = useState<string[]>([
    "owner-story",
    "oil-care",
    "photo-upload"
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bot messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const triggerReply = (userAction: string) => {
    let userMsgText = "";
    let sommelierReplies: Message[] = [];
    const currentTime = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

    if (userAction === "owner-story") {
      userMsgText = "20代の頃、一生モノだと思って購入したSchottワンスターです！週末は愛車SR400でのソロツーリングにいっつも着ていました。アームホールのシワはライディングの誇りです！✨";
      sommelierReplies = [
        {
          id: `r-${Date.now()}-1`,
          sender: "sommelier",
          text: "素晴らしいお話をありがとうございます！YAMAHAのSR400とSchott。まさに男の夢、大人のアメカジスタイルですね！ジャケットに刻まれた腕のシワは、長距離ライディングでの加減速の確かな証拠です。",
          time: currentTime
        },
        {
          id: `r-${Date.now()}-2`,
          sender: "sommelier",
          text: "一般的なリサイクルショップでは『シワだらけ』と減点される箇所ですが、リューグーではライディング・シワを、美しい風格証として判定いたします！",
          time: currentTime,
          bonusTag: "【相棒ライディング歴史加点】 +¥7,000"
        }
      ];
      setActiveActions(activeActions.filter((a) => a !== "owner-story"));
    } else if (userAction === "oil-care") {
      userMsgText = "毎年、梅雨前とシースオン前に、マスタングペースト（高級馬油）をしっかりと手で塗り込んで栄養を与えていたので、革の柔らかさは最高です。カビ臭もありません！";
      sommelierReplies = [
        {
          id: `r-${Date.now()}-1`,
          sender: "sommelier",
          text: "マスタングペースト（ホースオイル）でのメンテナンス、最高の手入れ方法です！革の内部にしっかりと油分が満ち、劣化やコシ折れが見られません。モチモチしたコシと極上のしっとり感がありますね！",
          time: currentTime
        },
        {
          id: `r-${Date.now()}-2`,
          sender: "sommelier",
          text: "このオイルコンディションの良さは、専門工房スタッフが再仕上げしやすく、次のオーナーへ最高の状態で引き継げるため、高く評価されます！",
          time: currentTime,
          bonusTag: "【オイル養分ケア状態優良加点】 +¥8,000"
        }
      ];
      setActiveActions(activeActions.filter((a) => a !== "oil-care"));
    } else if (userAction === "photo-upload") {
      userMsgText = "革ジャンのエイジング具合（袖のアタリや茶芯）の写真を送ります。パシャリ！📸";
      sommelierReplies = [
        {
          id: `r-${Date.now()}-1`,
          sender: "sommelier",
          text: "写真を確認いたしました！…鳥肌が立ちました！袖の端、縫い合わせのフチの部分から、下地の茶色が最高の風合いで露出しています（茶芯 / Tea-Core）。",
          time: currentTime,
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: `r-${Date.now()}-2`,
          sender: "sommelier",
          text: "ブラック顔料が落ち、革本来のブラウンが浮き出るこの『茶芯』は、ヴィンテージマニアにとってお宝です。一律減点どころか、超大型プレミアム加点を直ちに付与いたします！🔥",
          time: currentTime,
          bonusTag: "【激希少：骨董価値茶芯加点】 +¥15,000"
        }
      ];
      setActiveActions(activeActions.filter((a) => a !== "photo-upload"));
    }

    // Add User Message
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        sender: "user",
        text: userMsgText,
        time: currentTime
      }
    ]);

    // Delay Bot Reply for reality feel
    setTimeout(() => {
      setMessages((prev) => [...prev, sommelierReplies[0]]);
      
      setTimeout(() => {
        setMessages((prev) => [...prev, sommelierReplies[1]]);
      }, 1000);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "m1",
        sender: "sommelier",
        text: "チャットがリセットされました。愛着のあるあなたの革ジャンについて、自慢を教えてください！🏍️",
        time: ""
      }
    ]);
    setActiveActions(["owner-story", "oil-care", "photo-upload"]);
  };

  return (
    <div className="w-full bg-[#0d0e12] border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* LINE Header */}
      <div className="bg-[#06C755] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white relative">
              革
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-green-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-green-500 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">ReValue by Liugoo Leathers（革ジャン専門鑑定）</span>
              <span className="bg-white/20 text-white text-[9px] px-1 rounded font-bold">公式</span>
            </div>
            <span className="text-[10px] text-white/85 flex items-center gap-1">
              ● オンライン鑑定常駐
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetChat} 
            className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 py-1 px-2 rounded-md transition-all cursor-pointer"
          >
            会話を戻す
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#7590b1] space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar for bot */}
            {msg.sender === "sommelier" && (
              <div className="w-8 h-8 rounded-full bg-gray-900 border border-camel-500/30 flex items-center justify-center text-[10px] font-black text-camel-400 shrink-0 select-none">
                SOM
              </div>
            )}

            {/* Bubble */}
            <div className={`flex flex-col max-w-[75%] space-y-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#8af7a6] text-gray-900 rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.text}
                
                {msg.image && (
                  <div className="mt-2.5 rounded-lg overflow-hidden border border-gray-100">
                    <img 
                      src={msg.image} 
                      alt="エイジング実例" 
                      className="w-full object-cover max-h-36" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Bonus Tag Alert */}
              {msg.bonusTag && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-600 border border-emerald-400/30 text-white font-mono text-xs font-black py-1 px-3 rounded-lg shadow-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{msg.bonusTag}</span>
                </motion.div>
              )}

              <span className="text-[9px] text-white/50">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Interactive Action Suggesters (Simulated Keyboards) */}
      <div className="bg-[#1f222e] p-3 border-t border-white/5">
        <p className="text-[10px] text-gray-400 mb-2 max-w-full text-center flex items-center justify-center gap-1.5 font-bold">
          <span>👇 下記の返答ボタンをタップして、レザーソムリエとの会話を体感</span>
        </p>
        
        {activeActions.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {activeActions.includes("owner-story") && (
              <button
                onClick={() => triggerReply("owner-story")}
                className="w-full bg-white/[0.04] hover:bg-camel-500/10 hover:border-camel-500/50 hover:text-camel-400 border border-white/5 p-2.5 text-xs text-left text-gray-300 rounded-lg flex items-center justify-between transition-all cursor-pointer group"
              >
                <span className="font-semibold text-xs py-0.5 px-2 bg-camel-500/10 rounded mr-2 shrink-0 border border-camel-500/20 text-camel-500">愛着ストーリー</span>
                <span className="truncate flex-1">「20代で購入、SR400でのライディングの思い出…」</span>
                <span className="text-camel-500 text-[10px] group-hover:translate-x-1 transition-transform">話す →</span>
              </button>
            )}
            
            {activeActions.includes("oil-care") && (
              <button
                onClick={() => triggerReply("oil-care")}
                className="w-full bg-white/[0.04] hover:bg-camel-500/10 hover:border-camel-500/50 hover:text-camel-400 border border-white/5 p-2.5 text-xs text-left text-gray-300 rounded-lg flex items-center justify-between transition-all cursor-pointer group"
              >
                <span className="font-semibold text-xs py-0.5 px-2 bg-camel-500/10 rounded mr-2 shrink-0 border border-camel-500/20 text-camel-500">丁寧な手入れ</span>
                <span className="truncate flex-1">「毎年マスタングペーストやミンクオイルで大切に…」</span>
                <span className="text-camel-500 text-[10px] group-hover:translate-x-1 transition-transform">話す →</span>
              </button>
            )}

            {activeActions.includes("photo-upload") && (
              <button
                onClick={() => triggerReply("photo-upload")}
                className="w-full bg-white/[0.04] hover:bg-camel-500/10 hover:border-camel-500/50 hover:text-camel-400 border border-white/5 p-2.5 text-xs text-left text-gray-300 rounded-lg flex items-center justify-between transition-all cursor-pointer group"
              >
                <span className="font-semibold text-xs py-0.5 px-2 bg-camel-500/10 rounded mr-2 shrink-0 border border-camel-500/20 text-camel-500">シワ・茶芯</span>
                <span className="truncate flex-1">「【写真送付】袖のアタリやヴィンテージ風の茶芯の…」</span>
                <span className="text-camel-500 text-[10px] group-hover:translate-x-1 transition-transform">画像を送る →</span>
              </button>
            )}
          </div>
        ) : (
          <div className="py-2.5 text-center px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>すべてのシミュレーションを完了しました！</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-1">リアルLINE査定では、あなたの「語り」次第でさらに高額査定に導きます！</p>
          </div>
        )}
      </div>
    </div>
  );
}
