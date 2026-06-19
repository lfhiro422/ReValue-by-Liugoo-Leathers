import React, { useState } from "react";
import { FAQS } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, CheckCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen
                ? "bg-[#141622] border-amber-500/30 shadow-lg shadow-amber-500/5"
                : "bg-[#0f1015] border-white/5 hover:border-white/10"
            }`}
          >
            {/* Accordion Trigger Header */}
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 transition-colors cursor-pointer select-none"
            >
              <div className="flex gap-3 items-start">
                <HelpCircle className={`w-5 h-5 mt-0.5 shrink-0 ${isOpen ? "text-amber-500" : "text-gray-500"}`} />
                <span className={`font-bold text-sm sm:text-base leading-snug ${isOpen ? "text-white" : "text-gray-300"}`}>
                  {faq.question}
                </span>
              </div>
              
              <div className={`mt-1 p-1 rounded-full bg-white/5 border border-white/5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-amber-500/10 border-amber-500/20 text-amber-500" : "text-gray-400"}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Accordion Body Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed space-y-3 pl-14 pr-8 border-t border-white/[0.03]">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs pt-1">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>私たちは愛着そのものを減点査定いたしません。</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
