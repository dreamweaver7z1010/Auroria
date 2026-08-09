import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { OnboardingConfig } from '../types';
import { Calendar, GitCommit, Target, Zap, Clock, ShieldCheck, Milestone, GitBranch } from 'lucide-react';

interface RoadmapVisualizerProps {
  config: OnboardingConfig;
}

export default function RoadmapVisualizer({ config }: RoadmapVisualizerProps) {
  // Parsing dates
  const startDate = new Date(config.schoolStartDate);
  const revDate = new Date(config.revisionStartDate);
  const examDate = new Date(config.boardExamDate);

  // Derive intermediate milestones based on time spans
  const totalDays = (examDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const startToRevDays = (revDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

  // Milestones:
  // 1. Term Start (schoolStartDate)
  // 2. Syllabus 50% Checkpoint (midway to revDate)
  // 3. Phase 1 Complete / Revision Starts (revisionStartDate)
  // 4. Past Papers / Phase 2 (midway to examDate from revDate)
  // 5. Board Exams (boardExamDate)

  const halfRevDate = new Date(startDate.getTime() + (startToRevDays / 2) * (1000 * 3600 * 24));
  const preExamDate = new Date(examDate.getTime() - 30 * 24 * 3600 * 1000); // 1 month before

  const milestones = [
    {
      id: "term-start",
      title: "ACADEMIC TERM INITIALIZED",
      date: startDate,
      icon: GitCommit,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      desc: "School term begins. Phase 1 syllabus coverage starts across all CIE subjects."
    },
    {
      id: "mid-syllabus",
      title: "SYLLABUS 50% CHECKPOINT",
      date: halfRevDate,
      icon: Target,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      desc: "Target completion of first half of content. Early topical past paper integration."
    },
    {
      id: "revision-start",
      title: "PHASE 1 COMPLETE // REVISION STARTS",
      date: revDate,
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      desc: "All theoretical content should be covered. Shifting entirely to yearly past papers."
    },
    {
      id: "pre-exam",
      title: "PHASE 3 // PRE-EXAM DRILL",
      date: preExamDate,
      icon: ShieldCheck,
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/30",
      desc: "T-Minus 30 Days. Full mock simulations under timed conditions."
    },
    {
      id: "board-exams",
      title: "CIE BOARD EXAMS",
      date: examDate,
      icon: Milestone,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      desc: "Final testing window begins. Maintain operational focus."
    }
  ];

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 py-1 px-2.5 bg-indigo-500/15 border-l border-b border-indigo-500/20 text-indigo-400 font-black text-[9px] uppercase tracking-widest rounded-bl">
          CIE ROADMAP VISUALIZER
        </div>
        
        <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide mb-6 border-b border-white/5 pb-3 mt-2">
          <Calendar className="text-indigo-400" size={18} />
          ACADEMIC TIMELINE & MILESTONES
        </h2>

        <div className="relative pt-4 pb-12">
          {/* Main vertical line */}
          <div className="absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-1 bg-slate-800 rounded transform sm:-translate-x-1/2 z-0" />

          <div className="space-y-12 sm:space-y-16 relative z-10">
            {milestones.map((m, idx) => {
              const isPast = m.date < now;
              const isNext = !isPast && (idx === 0 || milestones[idx - 1].date < now);
              
              return (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 \${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Card */}
                  <div className={`flex-1 w-full sm:w-1/2 \${idx % 2 === 0 ? 'sm:text-left sm:pl-8' : 'sm:text-right sm:pr-8'}`}>
                    <div className={`border p-4 rounded-xl \${isPast ? 'bg-[#0A0A0F]/80 border-slate-700/50' : m.bgColor + ' ' + m.borderColor} \${isNext ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}`}>
                      <div className={`text-[10px] font-black uppercase mb-1 \${isPast ? 'text-slate-500' : m.color}`}>
                        {m.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        {isNext && <span className="ml-2 bg-white/10 px-1.5 py-0.5 rounded text-white animate-pulse">UPCOMING</span>}
                      </div>
                      <h3 className={`text-sm font-bold mb-2 \${isPast ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                        {m.title}
                      </h3>
                      <p className={`text-[11px] \${isPast ? 'text-slate-500' : 'text-slate-300'}`}>
                        {m.desc}
                      </p>

                      {/* Tech Tree Branches (Subjects) */}
                      {!isPast && config.subjects && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                          {config.subjects.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-[9px] font-mono uppercase text-slate-400">
                              <GitBranch size={10} className="text-slate-600" />
                              <span className="truncate">{sub.name} Node Target</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Node Icon */}
                  <div className="absolute left-[11px] sm:left-1/2 transform sm:-translate-x-1/2 flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#0A0A0F] \${isPast ? 'border-slate-600 text-slate-600' : isNext ? m.borderColor + ' ' + m.color + ' shadow-[0_0_15px_currentColor]' : m.borderColor + ' ' + m.color}`}>
                      <m.icon size={14} />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block flex-1 sm:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
