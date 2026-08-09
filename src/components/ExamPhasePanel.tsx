import React from "react";
import { 
  Award, 
  HelpCircle, 
  Flame, 
  Clock, 
  BookMarked, 
  ShieldCheck, 
  Activity, 
  Coffee, 
  Moon, 
  Smartphone, 
  Apple,
  FileCheck,
  Check,
  Sparkles,
  Layers
} from "lucide-react";
import SyllabusTracker from "./SyllabusTracker";
import PastPaperChecklist from "./PastPaperChecklist";
import { SubjectConfig, SubjectId } from "../types";

interface ExamPhasePanelProps {
  userSubjects: SubjectConfig[];
  onToggleTopic: (subject: SubjectId, topic: string, completed: boolean, phaseId?: number) => Promise<void>;
  loadingToggle: boolean;
  customSyllabus?: Record<string, any>;
  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;
  username: string;
}

export default function ExamPhasePanel({
  userSubjects,
  onToggleTopic,
  loadingToggle,
  customSyllabus,
  onSaveCustomSyllabus,
  username
}: ExamPhasePanelProps) {
  return (
    <div className="space-y-6 font-mono">
      
      {/* Intro Context Panel */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF66]/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide font-sans">
              <Flame className="text-[#00FF66] animate-pulse" size={16} />
              PHASE 3: EXAM PHASE & FINAL INTENSIVE REVIEW
            </h2>
            <p className="text-[11px] text-slate-400">DURATIONS: Actual Board Exams Window | Absolute Tactical Precision Mode</p>
          </div>
          <span className="px-2.5 py-0.5 bg-[#00FF66]/10 border border-[#00FF66]/25 text-[#00FF66] text-[10px] font-black uppercase rounded">
            Stage: Live Exams
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-normal text-xs">
          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00F0FF] font-black text-[10px] uppercase block">🎯 INTENTIONAL FOCUS</span>
            <p className="text-slate-400 text-[10.5px]">Master all series papers (Feb/Mar, May/June, Oct/Nov) across paper components.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#FF0055] font-black text-[10px] uppercase block">⚓ LIVE ROTATIONS</span>
            <ul className="text-slate-400 text-[10.5px] list-disc list-inside space-y-0.5">
              <li>Solve full past paper sittings</li>
              <li>Drill Oct/Nov series papers</li>
              <li>Review Mistake Notebook</li>
            </ul>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00FF66] font-black text-[10px] uppercase block">🛡️ EXAM SURVIVAL</span>
            <p className="text-slate-400 text-[10.5px]">Avoid reading completely new theories. Execute defined sign coordinates. Manage sleep and break density.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-purple-400 font-black text-[10px] uppercase block">⏱️ REVIEW ENGINE</span>
            <p className="text-slate-400 text-[10.5px]">Rapidly scan and check off core syllabus units below to verify concept familiarity. Ensure no blindspots linger.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (2/3 width): Critical Strategy, Day before, Gap days */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Critical Exam Day Strategy */}
          <div className="border border-white/5 bg-[#12121A]/70 rounded-xl p-5 text-slate-350 space-y-4">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5 font-sans">
              <ShieldCheck className="text-[#00FF66]" size={14} />
              CRITICAL EXAM DAY STRATEGY BOARD
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Day Before Exam Category */}
              <div className="bg-[#0A0A0F] border border-white/5 p-3.5 rounded-lg space-y-2.5">
                <span className="text-amber-400 font-black text-[10.5px] uppercase block border-b border-white/5 pb-1">1. Day Before Exam (Goal: Precision, Not Overload)</span>
                
                <div className="space-y-2 text-[10.5px] leading-relaxed">
                  <p><strong>🌅 MORNING:</strong> Revise key formulas + quick study of flashcard decks.</p>
                  <p><strong>☀️ AFTERNOON:</strong> Solve exactly 1 light paper or selected targeted questions.</p>
                  <p><strong>🌆 EVENING:</strong> Carefully read through all notes inside the Mistake Notebook.</p>
                  <p><strong>🌌 NIGHT:</strong> Complete STOP! Strictly no late-night cramming. Put away books.</p>
                </div>

                <div className="p-2 border border-yellow-500/10 bg-yellow-500/5 rounded text-[10px] text-[#FFEA00]">
                  <strong>⚠️ FOCUS AREAS:</strong> Weak topics only, core definitions, and highly frequent careless mistakes.
                </div>
              </div>

              {/* Day of Exam Category */}
              <div className="bg-[#0A0A0F] border border-white/5 p-3.5 rounded-lg space-y-2.5">
                <span className="text-[#00FF66] font-black text-[10.5px] uppercase block border-b border-white/5 pb-1">2. Exam Day (Goal: Execution Under Pressure)</span>
                
                <div className="space-y-1.5 text-[10.5px] leading-relaxed">
                  <p><strong>BEFORE SITTING:</strong> Light revision (30-60 min max), formula glance, maintain calm mindset.</p>
                  <p><strong>⚔️ RULE 1 (Scan):</strong> Spend 2–3 min scanning paper. Identify easy vs hard questions first.</p>
                  <p><strong>⚔️ RULE 2 (Attack Order):</strong> 1st: Easy problems, 2nd: Medium, 3rd: Hard algebraic loops.</p>
                  <p><strong>⚔️ RULE 3 (Time Control):</strong> MCQ: Don't overthink. Structured: Show steps clearly.</p>
                  <p className="text-[#00FF66] font-bold">🌟 GOLDEN RULE: If stuck for more than 2 minutes → MOVE IMMEDIATELY!</p>
                </div>

                <div className="p-2 border border-red-500/10 bg-red-500/5 rounded text-[10px] text-red-400">
                  <strong>🚨 AFTER EXAM RULES:</strong> ❌ Don't discuss answers. ❌ Don't overanalyse. ✅ Move immediately to next subject.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Gap Days Recovery Timeline */}
          <div className="border border-white/5 bg-[#12121A]/70 rounded-xl p-5 text-slate-350 space-y-4">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5 font-sans">
              <Clock className="text-[#00F0FF]" size={14} />
              GAP DAYS RECOVERY STRUCTURE & SUBJECT SPECIFIC FOCUS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1.5">
                <span className="text-pink-400 font-extrabold text-[10px] block uppercase">DAY 1: Recovery & Light Start</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Rest 2–3 hours. Do brief flashcard sweeps for the upcoming subject. Engage in light practice.
                </p>
              </div>

              <div className="bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1.5">
                <span className="text-purple-400 font-extrabold text-[10px] block uppercase">DAY 2: Core Academic Work</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Revise all critical chapters. Solve 1 full past paper timed. Analyze all errors and update notebook.
                </p>
              </div>

              <div className="bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1.5">
                <span className="text-[#00FF66] font-extrabold text-[10px] block uppercase">DAY 3: Final Consolidation</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Focus exclusively on known weak chapters. Review definitions and formulas. Rest early.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column (1/3 width): Biometric Fuel Guardrails */}
        <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-350 space-y-4 h-fit">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5 font-sans">
            <Activity className="text-teal-400 animate-pulse" size={14} />
            BIOMETRIC FUEL GUARDRAILS
          </h3>

          <p className="text-[10px] text-slate-400 leading-normal">
            Physical guardrails dictate intellectual stamina. Treat sleep, breaks, and screen boundaries as high-grade inputs.
          </p>

          <div className="space-y-3 text-xs">
            
            {/* Sleep */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Moon className="text-[#00F0FF] shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">6–8 HRS SLEEP MINIMUM</span>
                <p className="text-[10px] text-slate-450">Stamina and logical recall decline by 30% with less than 6 hours.</p>
              </div>
            </div>

            {/* Food */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Apple className="text-[#00FF66] shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">LIGHT FOOD BEFORE SURGERY</span>
                <p className="text-[10px] text-slate-450">Avoid fat-dense, heavy carbs right before paper sittings.</p>
              </div>
            </div>

            {/* Breaks */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Coffee className="text-purple-400 shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">MANDATORY ACTIVE BREAKS</span>
                <p className="text-[10px] text-slate-450">Step completely out of study zone every 90 minutes.</p>
              </div>
            </div>

            {/* Screen time */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Smartphone className="text-[#FF0055] shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">REDUCE SCREEN BEFORE SLEEP</span>
                <p className="text-[10px] text-slate-450">Ditch phone terminals 45 minutes prior to sleep.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <PastPaperChecklist userSubjects={userSubjects} username={username} />

      {/* Syllabus Matrix Checklist with Phase 3 ID */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-sans">
          <BookMarked size={13} className="text-[#00FF66]" />
          RAPID REVISION SYLLABUS CHECKLIST (PHASE 3 MATRIX)
        </h3>
        
        <SyllabusTracker
          userSubjects={userSubjects}
          onToggleTopic={onToggleTopic}
          loadingToggle={loadingToggle}
          customSyllabus={customSyllabus}
          onSaveCustomSyllabus={onSaveCustomSyllabus}
          showTitle={false}
          phaseId={3}
        />
      </div>

    </div>
  );
}
