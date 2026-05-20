import React from "react";
import { 
  Award, 
  HelpCircle, 
  Smile, 
  Flame, 
  Clock, 
  BookMarked, 
  ShieldCheck, 
  Activity, 
  Coffee, 
  Moon, 
  Smartphone, 
  Apple,
  Briefcase
} from "lucide-react";
import SyllabusTracker from "./SyllabusTracker";
import { SubjectConfig, SubjectId } from "../types";

interface ExamPhasePanelProps {
  userSubjects: SubjectConfig[];
  onToggleTopic: (subject: SubjectId, topic: string, completed: boolean) => Promise<void>;
  loadingToggle: boolean;
  customSyllabus?: Record<string, any>;
  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;
}

export default function ExamPhasePanel({
  userSubjects,
  onToggleTopic,
  loadingToggle,
  customSyllabus,
  onSaveCustomSyllabus
}: ExamPhasePanelProps) {
  return (
    <div className="space-y-6">
      
      {/* Intro Context Panel */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF66]/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Flame className="text-[#00FF66] animate-pulse" size={16} />
              EXAM PHASE: PEAK INTELLECTUAL PERFORMANCE
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">DURATIONS: Actual Board Exams Window | Absolute Tactical Precision Mode</p>
          </div>
          <span className="px-2.5 py-0.5 bg-[#00FF66]/10 border border-[#00FF66]/25 text-[#00FF66] text-[10px] font-black uppercase rounded">
            Stage: Live Exams
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-normal text-xs font-mono">
          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00F0FF] font-black text-[10px] uppercase block">🎯 INTENTIONAL FOCUS</span>
            <p className="text-slate-400 text-[10.5px]">This phase focuses entirely on reviewing full materials, identifying patterns in common questions, and executing strategy under high exam pressure.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#FF0055] font-black text-[10px] uppercase block">⚓ LIVE ROTATIONS</span>
            <ul className="text-slate-400 text-[10.5px] list-disc list-inside space-y-0.5">
              <li>Practising targeted questions</li>
              <li>Settle the latest past papers</li>
              <li>Review the Mistake Notebook</li>
            </ul>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00FF66] font-black text-[10px] uppercase block">🛡️ EXAM SURVIVAL</span>
            <p className="text-slate-400 text-[10.5px]">Avoid reading completely new theories. Execute defined sign coordinates. Manage sleep, break density, and biometric nutrition.</p>
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
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="text-[#00FF66]" size={14} />
              CRITICAL EXAM DAY STRATEGY BOARD
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
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
                  <strong>⚠️ FOCUS AREAS:</strong> Weak topics only, core definitions, and highly frequent careles mistakes.
                </div>
              </div>

              {/* Day of Exam Category */}
              <div className="bg-[#0A0A0F] border border-white/5 p-3.5 rounded-lg space-y-2.5">
                <span className="text-[#00FF66] font-black text-[10.5px] uppercase block border-b border-white/5 pb-1">2. Exam Day (Goal: Execution Under Pressure)</span>
                
                <div className="space-y-1.5 text-[10.5px] leading-relaxed">
                  <p><strong>BEFORE THE SITTING:</strong> Light revision (30-60 min max), formula glance, maintain calm mindset (no panic revision).</p>
                  <p><strong>⚔️ RULE 1 (Scan):</strong> Spend 2–3 min scanning paper. Identify easy vs hard questions first.</p>
                  <p><strong>⚔️ RULE 2 (Attack Order):</strong> 1st: Easy problems, 2nd: Medium, 3rd: Hard algebraic loops.</p>
                  <p><strong>⚔️ RULE 3 (Time Control):</strong> MCQ: Don't overthink. Structured: Show steps clearly. Long Q: Don't get stuck.</p>
                  <p className="text-[#00FF66] font-bold">🌟 GOLDEN RULE: If stuck for more than 2 minutes → MOVE IMMEDIATELY!</p>
                </div>

                <div className="p-2 border border-red-500/10 bg-red-500/5 rounded text-[10px] text-red-400">
                  <strong>🚨 AFTER EXAM RULES:</strong> ❌ Don't discuss answers. ❌ Don't overanalyse or dwell. ✅ Move immediately to next subject.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Gap Days Recovery Timeline */}
          <div className="border border-white/5 bg-[#12121A]/70 rounded-xl p-5 text-slate-350 space-y-4">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
              <Clock className="text-[#00F0FF]" size={14} />
              GAP DAYS RECOVERY STRUCTURE & SUBJECT SPECIFIC FOCUS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1.5">
                <span className="text-pink-400 font-extrabold text-[10px] block uppercase">DAY 1: Recovery & Light Start</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Rest 2–3 hours. Do brief flashcard sweeps for the upcoming subject. Engage in light practice, no heavy timed sprints.
                </p>
              </div>

              <div className="bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1.5">
                <span className="text-purple-400 font-extrabold text-[10px] block uppercase">DAY 2: Core Academic Work</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Revise all critical chapters. Solve 1 full past paper timed. Analyze all errors and update the mistake notebook.
                </p>
              </div>

              <div className="bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1.5">
                <span className="text-[#00FF66] font-extrabold text-[10px] block uppercase">DAY 3: Final Consolidation</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Focus exclusively on known weak chapters. Review definitions and formulas. Rest and sleep early.
                </p>
              </div>
            </div>

            {/* Subject-Specific focus timeline */}
            <div className="bg-[#0A0A0F] border border-white/5 p-4 rounded-xl space-y-2.5 text-xs font-mono">
              <span className="text-slate-300 font-black uppercase text-[10px] tracking-wider block">⚡ SUBJECT-SPECIFIC BULLET GAINS</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-[10px] leading-relaxed text-slate-400">
                <div className="p-2 border border-[#FFEA00]/10 bg-white/1 rounded space-y-1">
                  <strong className="text-[#FFEA00] uppercase block">🧪 Chemistry</strong>
                  <p>Focus: Organic reactions, definitions, stoichiometry calculations. Careless errors cost the most Marks.</p>
                </div>
                <div className="p-2 border border-[#00FF66]/10 bg-white/1 rounded space-y-1">
                  <strong className="text-[#00FF66] uppercase block">⚡ Physics</strong>
                  <p>Focus: Mathematical units, formula applications, explanation keywords. Vague reasoning loses easy marks.</p>
                </div>
                <div className="p-2 border border-[#00F0FF]/10 bg-white/1 rounded space-y-1">
                  <strong className="text-[#00F0FF] uppercase block">📐 Math</strong>
                  <p>Focus: Pure calculation speed, accuracy, question types. Zero time for thinking, focus purely on execution.</p>
                </div>
                <div className="p-2 border border-pink-500/10 bg-white/1 rounded space-y-1">
                  <strong className="text-pink-400 uppercase block">💻 CS (9618)</strong>
                  <p>Focus: Writing definitions, logic flow clarity, structure answers. Mimic standard marking guidelines.</p>
                </div>
                <div className="p-2 border border-purple-500/10 bg-white/1 rounded space-y-1">
                  <strong className="text-purple-400 uppercase block">✍️ English</strong>
                  <p>Focus: Developing coherent arguments, relevant examples, time control. Avoid overcomplicating essays.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column (1/3 width): Biometric Fuel Guardrails */}
        <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-350 space-y-4 h-fit">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
            <Activity className="text-teal-400 animate-pulse" size={14} />
            BIOMETRIC FUEL GUARDRAILS
          </h3>

          <p className="text-[10px] text-slate-400 font-mono leading-normal">
            Physical guardrails dictate intellectual stamina. Treat sleep, breaks, and screen boundaries as high-grade inputs.
          </p>

          <div className="space-y-3 font-mono text-xs">
            
            {/* Sleep */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Moon className="text-[#00F0FF] shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">6–8 HRS SLEEP MINIMUM</span>
                <p className="text-[10px] text-slate-450">Stamina and logical recall decline by 30% with less than 6 hours. Stop study prior to sleepy hours.</p>
              </div>
            </div>

            {/* Food */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Apple className="text-[#00FF66] shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">LIGHT FOOD BEFORE SURGERY</span>
                <p className="text-[10px] text-slate-450">Avoid fat-dense, heavy carbs right before paper sittings. Glucose spikes cause brain fog and fatigue.</p>
              </div>
            </div>

            {/* Breaks */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Coffee className="text-purple-400 shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">MANDATORY ACTIVE BREAKS</span>
                <p className="text-[10px] text-slate-450">Intersperse Pomodoros with physical dynamic movement. Step completely out of study zone every 90 minutes.</p>
              </div>
            </div>

            {/* Screen time */}
            <div className="flex items-start gap-2.5 p-2 bg-[#0A0A0F] border border-white/5 rounded-lg">
              <Smartphone className="text-[#FF0055] shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-200 text-[10.5px] block uppercase">REDUCE SCREEN BEFORE SLEEP</span>
                <p className="text-[10px] text-slate-450">Blue excitation prevents slow-wave deep recovery. Ditch phone terminals 45 minutes prior to sleep.</p>
              </div>
            </div>

          </div>

          <div className="p-2.5 bg-yellow-400/5 border border-yellow-400/10 rounded-lg text-[9.5px] text-yellow-400 leading-normal font-mono uppercase">
            <strong>💡 DAILY TEMPLATE SUMMARY:</strong>
            <br />• EXAM TOMORROW: Revise + Light Practice
            <br />• EXAM TODAY: Execute attack strategy
            <br />• GAP DAY: Revise + 1 paper + Fix slips
          </div>
        </div>

      </div>

      {/* Syllabus Study Unit Accordion included inside Exam Phase exactly as requested! */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <BookMarked size={13} className="text-[#00FF66]" />
          RAPID REVISION SYLLABUS CHECKLIST (CORE MATRIX)
        </h3>
        
        <SyllabusTracker
          userSubjects={userSubjects}
          onToggleTopic={onToggleTopic}
          loadingToggle={loadingToggle}
          customSyllabus={customSyllabus}
          onSaveCustomSyllabus={onSaveCustomSyllabus}
          showTitle={false}
        />
      </div>

    </div>
  );
}
