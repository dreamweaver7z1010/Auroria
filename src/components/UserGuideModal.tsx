import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, BookMarked, Award, Flame, ShieldAlert, Folder, Cpu } from "lucide-react";

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "WELCOME TO SABER STUDY PORTAL",
      subtitle: "FOR STUDENTS, BY STUDENTS — STRICTLY OPTIMIZED FOR CIE AS & A LEVEL",
      icon: Cpu,
      color: "text-[#00F0FF]",
      borderColor: "border-[#00F0FF]/30",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Saber Study Portal is an elite academic tracking operating system designed to guide Cambridge International AS & A Level candidates from syllabus coverage to exam mastery.
          </p>
          <div className="p-3 bg-[#0A0A0F] border border-white/5 rounded-xl space-y-2 text-[11px]">
            <div className="text-[#00F0FF] font-bold">CORE ARCHITECTURAL PRINCIPLES:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Dynamic Subject Isolation:</strong> Everything you see is 100% scoped to your enrolled subjects.</li>
              <li><strong>Zero-Data Leakage:</strong> Non-enrolled subjects never appear in your daily HUD or metrics.</li>
              <li><strong>Phase-Based Progression:</strong> Automatically calculates your revision phase based on school & exam dates.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "DYNAMIC PHASE ENGINE",
      subtitle: "STRATEGIC REVISION TIMELINE AUTOMATION",
      icon: BookMarked,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            The portal divides your academic timeline into 4 distinct phases based on your exam series dates:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
            <div className="p-2.5 bg-[#0A0A0F] border border-amber-500/20 rounded-lg">
              <span className="font-bold text-amber-400 block uppercase">Phase 1: Syllabus Coverage</span>
              <span className="text-slate-400">Topic-by-topic group rotation (Group A vs Group B).</span>
            </div>
            <div className="p-2.5 bg-[#0A0A0F] border border-indigo-500/20 rounded-lg">
              <span className="font-bold text-indigo-400 block uppercase">Phase 2: Active Recall</span>
              <span className="text-slate-400">5-day horizontal recall drills tracking uncompleted topics.</span>
            </div>
            <div className="p-2.5 bg-[#0A0A0F] border border-red-500/20 rounded-lg">
              <span className="font-bold text-red-500 block uppercase">Phase 3: Past Paper Marathon</span>
              <span className="text-slate-400">High-intensity past paper schedule & daily orders HUD.</span>
            </div>
            <div className="p-2.5 bg-[#0A0A0F] border border-teal-500/20 rounded-lg">
              <span className="font-bold text-teal-400 block uppercase">Pre-Exam & Exam-Phase</span>
              <span className="text-slate-400">Mistake vault resolution & final sprint review.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "ACADEMIC SCOREBOARD & METRICS",
      subtitle: "REAL-TIME SCORE LOGGING & CONCEPT GAP DIAGNOSTICS",
      icon: Award,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Log test scores, past paper raw marks, and mock exam results to view your progress analytics:
          </p>
          <div className="p-3 bg-[#0A0A0F] border border-white/5 rounded-xl space-y-2 text-[11px]">
            <div className="font-bold text-slate-200 uppercase">PROGRESS INDICATOR STATUS RULES:</div>
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Score &lt; 70%: <strong>Laser Crimson</strong> with <code>[WARNING: CONCEPT GAP]</code></span>
            </div>
            <div className="flex items-center gap-2 text-[#00F0FF]">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
              <span>Score 70% - 90%: <strong>Laser Cyan</strong> with <code>[SYSTEM STABLE]</code></span>
            </div>
            <div className="flex items-center gap-2 text-[#00FF66]">
              <span className="w-2 h-2 rounded-full bg-[#00FF66]" />
              <span>Score &gt; 90%: <strong>Matrix Green</strong> with <code>[SYSTEM MASTERED]</code></span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "MISTAKE VAULT & CLOUD RESOURCE DRIVE",
      subtitle: "ACTIVE RECALL ERROR NOTEBOOK & CLOUD BACKUP",
      icon: Folder,
      color: "text-[#00FF66]",
      borderColor: "border-[#00FF66]/30",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Capture mistakes from past paper sessions to ensure errors are never repeated:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
            <div className="p-2.5 bg-[#0A0A0F] border border-white/5 rounded-lg space-y-1">
              <span className="font-bold text-[#00FF66] uppercase block">Mistake Notebook</span>
              <span className="text-slate-400">Log question description, wrong approach, and corrected sequence. Mark resolved when mastered.</span>
            </div>
            <div className="p-2.5 bg-[#0A0A0F] border border-white/5 rounded-lg space-y-1">
              <span className="font-bold text-purple-400 uppercase block">Cloud Resource Bank</span>
              <span className="text-slate-400">Access official CIE syllabus specifications, formula booklets, and upload your own study notes & PDFs.</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const IconComponent = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-[#12121A] border border-white/10 rounded-2xl p-6 font-mono text-slate-200 relative shadow-2xl overflow-hidden space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-white/5 border ${currentStep.borderColor} ${currentStep.color}`}>
                <IconComponent size={20} />
              </div>
              <div>
                <h2 className={`text-base font-extrabold uppercase tracking-wider ${currentStep.color}`}>
                  {currentStep.title}
                </h2>
                <p className="text-[9.5px] text-slate-500 uppercase tracking-widest">
                  {currentStep.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="min-h-[160px]">
            {currentStep.content}
          </div>

          {/* Stepper Dots & Navigation */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === step ? "w-6 bg-purple-500" : "w-2 bg-white/10 hover:bg-white/20"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-3.5 py-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-slate-200 text-xs uppercase font-bold flex items-center gap-1"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              )}

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev + 1)}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  Next <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-[#00FF66] hover:bg-[#00FF66]/80 text-black text-xs font-extrabold uppercase flex items-center gap-1 cursor-pointer"
                >
                  Enter Portal <CheckCircle2 size={13} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
