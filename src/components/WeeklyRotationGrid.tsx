import { motion } from "motion/react";
import { ListCollapse, RefreshCw, Layers, Calendar, Flame, GraduationCap, CheckCircle } from "lucide-react";
import { DaySchedule, UserPhase } from "../types";
import { getSubjectAccent } from "./CyberGlowStyles";

interface WeeklyRotationGridProps {
  engineState: UserPhase;
  schedule: DaySchedule[];
}

export default function WeeklyRotationGrid({ engineState, schedule }: WeeklyRotationGridProps) {
  
  // Custom headers depending on phase active
  const getPhaseHeadline = () => {
    switch (engineState.activePhaseId) {
      case 1:
        return "PHASE 1 ROTATION LOGS // COHORT CORE BASELINE";
      case 2:
        return "PHASE 2 ROTATION LOGS // 5-DAY ACTIVE RETRIEVAL SPANS";
      case 3:
        return "PHASE 3 ROTATION LOGS // 7-DAY PAST PAPER ULTIMAX RUNS";
      default:
        return "ACTIVE STUDY SCHEDULER";
    }
  };

  const getPhaseVisualDescriptor = () => {
    switch (engineState.activePhaseId) {
      case 1:
        return "Double text drills targeting base syllabus sections. Structured 3-Day loop cycles.";
      case 2:
        return "Systematic active recall intervals targeting recall splits. Interactive timeline grid.";
      case 3:
        return "Maximum-intensity exam simulation schedule. Time-controlled past papers (Years 2021-2026).";
      default:
        return "";
    }
  };

  return (
    <div className="relative border border-white/5 bg-[#12121A]/40 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-white/5 gap-4">
        <div>
          <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
            <Layers className="text-[#FFEA00] shrink-0" size={18} />
            {getPhaseHeadline()}
          </h2>
          <p className="font-mono text-[11px] text-slate-550 mt-1 uppercase text-slate-400">
            {getPhaseVisualDescriptor()}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] bg-[#0A0A0F]/80 px-3 py-1.5 rounded border border-white/5">
          <RefreshCw size={12} className="text-[#00FF66] animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-slate-400">STATE SYNCD: INTERLOCK {schedule.length} INTERVALS</span>
        </div>
      </div>

      {/* Render layouts conditionally based on Phase */}
      
      {/* PHASE 1: 3 Column Massive Bracket Grid Layout */}
      {engineState.activePhaseId === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {schedule.map((day, idx) => {
            return (
              <div 
                key={day.dayName}
                className="relative bg-[#0A0A0F]/90 border border-white/10 rounded-md p-5 group flex flex-col justify-between"
              >
                {/* Visual Terminal square bracket decorators */}
                <div className="absolute top-2 left-2 text-xs font-mono text-slate-600 font-bold">{"["}</div>
                <div className="absolute top-2 right-2 text-xs font-mono text-slate-600 font-bold">{"]"}</div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <span className="font-mono text-xs font-bold text-[#00F0FF] tracking-widest uppercase">
                      {day.dayName}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500 font-extrabold uppercase bg-white/5 px-2 py-0.5 rounded">
                      TYPE {day.dayType}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">Allocated Subjects:</span>
                    <div className="flex flex-wrap gap-2">
                      {day.subjects.map((subj) => {
                        const style = getSubjectAccent(subj);
                        return (
                          <div 
                            key={subj} 
                            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border ${style.glowClass} ${style.textClass} font-semibold transition-all duration-300`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {subj}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">Schedule Directives:</span>
                  <div className="font-mono text-[11px] text-slate-300 bg-white/5 p-2 rounded leading-relaxed">
                    {day.targets}
                  </div>
                </div>

                {/* Sub corner neon bar on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00F0FF] group-hover:w-full transition-all duration-300" />
              </div>
            );
          })}
        </motion.div>
      )}

      {/* PHASE 2: 5-Day Horizontal Timeline Timeline Layout */}
      {engineState.activePhaseId === 2 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-2"
        >
          {schedule.map((day, idx) => {
            return (
              <div 
                key={day.dayName}
                className="relative bg-[#0A0A0F]/90 border border-white/10 rounded-md p-4 group flex flex-col justify-between hover:border-[#9D00FF]/40 transition-all duration-300"
              >
                <div className="absolute top-2 right-2 text-slate-600 text-[10px] font-mono font-black">
                  0{idx + 1}
                </div>

                <div>
                  <div className="pb-2 border-b border-white/5 mb-3">
                    <h4 className="text-[11px] font-mono font-bold text-[#9D00FF] tracking-wider uppercase truncate">
                      {day.dayName}
                    </h4>
                    <span className="text-[9px] font-mono text-slate-550 block text-slate-500 font-extrabold uppercase mt-0.5">
                      SEGMENT {day.dayType}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider block">Recall Targets:</span>
                    <div className="flex flex-col gap-1.5">
                      {day.subjects.map((subj) => {
                        const style = getSubjectAccent(subj);
                        return (
                          <div 
                            key={subj} 
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono border ${style.glowClass} ${style.textClass} font-semibold`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span className="truncate">{subj}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 bg-white/2 p-2 rounded-sm text-[10px] font-mono text-slate-400">
                  {day.targets}
                </div>

                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#9D00FF] group-hover:w-full transition-all duration-300" />
              </div>
            );
          })}
        </motion.div>
      )}

      {/* PHASE 3: High-Intensity 7-Day past paper load layout */}
      {engineState.activePhaseId === 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4"
        >
          {schedule.map((day, idx) => {
            const isWeekend = day.extraFlag === "MAX_LOAD" || day.dayName === "SATURDAY" || day.dayName === "SUNDAY";
            return (
              <div 
                key={day.dayName}
                className={`relative bg-[#020205] border rounded-md p-4 group flex flex-col justify-between transition-all duration-300 ${
                  isWeekend 
                    ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)] bg-amber-500/2" 
                    : "border-white/10 hover:border-crimson/50"
                }`}
              >
                <div>
                  <div className="pb-2 border-b border-white/5 mb-3 flex items-center justify-between">
                    <h4 className={`text-[11px] font-mono font-bold tracking-widest uppercase ${isWeekend ? "text-amber-500" : "text-slate-200"}`}>
                      {day.dayName}
                    </h4>
                    {isWeekend && (
                      <Flame size={12} className="text-amber-500 shrink-0 animate-bounce" />
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <span className="text-[9px] uppercase font-mono text-slate-500 tracking-widest block">Simulation Split:</span>
                    <div className="flex flex-col gap-1.5">
                      {day.subjects.map((subj) => {
                        const style = getSubjectAccent(subj);
                        const isCS = subj === "Computer Science";
                        return (
                          <div 
                            key={subj} 
                            className={`flex flex-col justify-between p-1.5 rounded text-[10px] font-mono border ${style.glowClass} ${style.textClass} font-semibold`}
                          >
                            <span className="font-bold flex items-center gap-1 mb-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {subj}
                            </span>
                            <span className="text-[8px] font-mono text-slate-500 text-right">
                              Range: {isCS ? "2021-2026" : "2022-2026"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`mt-2 border-t border-white/5 p-2 rounded-sm text-[9px] font-mono leading-normal select-none ${
                    isWeekend 
                      ? "bg-amber-500/10 text-amber-200 uppercase font-black tracking-tighter" 
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {day.targets}
                </div>

                <div className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 ${isWeekend ? "bg-amber-500 group-hover:w-full" : "bg-rose-500 group-hover:w-full"}`} />
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Legend Block */}
      <div className="mt-6 p-4 bg-[#0A0A0F]/60 border border-white/5 rounded flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <GraduationCap size={14} className="text-[#00F0FF]" />
          <span className="text-slate-400">Tactical Syllabi Tracking Activated:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1 text-[#00F0FF]">
            <span className="w-2.0 h-2.0 rounded-full bg-[#00F0FF] inline-block w-1.5 h-1.5" /> Chemistry
          </span>
          <span className="flex items-center gap-1 text-[#9D00FF]">
            <span className="w-2.0 h-2.0 rounded-full bg-[#9D00FF] inline-block w-1.5 h-1.5" /> Physics
          </span>
          <span className="flex items-center gap-1 text-[#FFEA00]">
            <span className="w-2.0 h-2.0 rounded-full bg-[#FFEA00] inline-block w-1.5 h-1.5" /> Mathematics
          </span>
          <span className="flex items-center gap-1 text-[#00FF66]">
            <span className="w-2.0 h-2.0 rounded-full bg-[#00FF66] inline-block w-1.5 h-1.5" /> Computer Science
          </span>
          <span className="flex items-center gap-1 text-[#FF0055]">
            <span className="w-2.0 h-2.0 rounded-full bg-[#FF0055] inline-block w-1.5 h-1.5" /> English Lit
          </span>
        </div>
      </div>
    </div>
  );
}
