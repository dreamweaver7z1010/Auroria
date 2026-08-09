import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Sparkles, ArrowRight, CheckCircle2, Compass, BookOpen } from "lucide-react";

interface WalkthroughPromptModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function WalkthroughPromptModal({
  isOpen,
  onAccept,
  onDecline
}: WalkthroughPromptModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono text-xs animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="w-full max-w-lg bg-[#0F172A] border border-[#00F0FF]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6 text-slate-100"
        >
          {/* Decorative Top Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] via-purple-500 to-emerald-400" />
          
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#00F0FF]/15 border border-[#00F0FF]/30 rounded-2xl text-[#00F0FF] shrink-0">
              <Compass size={28} className="animate-spin-slow" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles size={11} /> Registration & Setup Complete
              </div>
              <h2 className="text-base font-black uppercase text-slate-100 tracking-wider">
                Welcome to Saber Study Platform!
              </h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Your Cambridge AS & A Level syllabus rotation, exam timelines, and Cloud SQL databases are synchronized.
              </p>
            </div>
          </div>

          {/* Body Question Box */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/60 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[#00F0FF] font-bold text-xs uppercase">
              <BookOpen size={16} />
              <span>Interactive Website Tour</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Do you need a walkthrough of the website to learn how to track past papers, log test scores, resolve mistakes in the vault, and use the Gemini AI Tutor?
            </p>
          </div>

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onDecline}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              No thanks, I'm ready
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="w-full py-3 px-4 bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-extrabold rounded-xl shadow-lg shadow-[#00F0FF]/20 text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
            >
              Yes, show me around! <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
