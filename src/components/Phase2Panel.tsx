import React from "react";
import { motion } from "motion/react";
import { BookOpen, Calendar, Repeat, Zap, Layers, RefreshCw } from "lucide-react";
import SyllabusTracker from "./SyllabusTracker";
import { SubjectConfig, SubjectId } from "../types";

interface Phase2PanelProps {
  userSubjects: SubjectConfig[];
  onToggleTopic: (subject: SubjectId, topic: string, completed: boolean) => Promise<void>;
  loadingToggle: boolean;
  customSyllabus?: Record<string, any>;
  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;
}

export default function Phase2Panel({
  userSubjects,
  onToggleTopic,
  loadingToggle,
  customSyllabus,
  onSaveCustomSyllabus
}: Phase2PanelProps) {
  const rotationDays = [
    { day: "Day 1", subjects: "Chemistry + Mathematics + English", color: "border-[#00F0FF]/25 text-[#00F0FF]" },
    { day: "Day 2", subjects: "Physics + Computer Science + Mathematics", color: "border-purple-500/25 text-purple-400" },
    { day: "Day 3", subjects: "Chemistry + Physics + English", color: "border-[#00FF66]/25 text-[#00FF66]" },
    { day: "Day 4", subjects: "Computer Science + Mathematics + English", color: "border-pink-500/25 text-pink-400" },
    { day: "Day 5", subjects: "Chemistry + Computer Science + Physics", color: "border-[#FFEA00]/25 text-[#FFEA00]" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro Overview Panel */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Layers className="text-purple-400" size={16} />
              PHASE 2: Active Recall & High Practice Density
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">DURATIONS: 4 Months [June 1, 2026 - October 1, 2026] | 122 Days Allocation</p>
          </div>
          <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[10px] font-black uppercase rounded">
            Stage: Recall Loop
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-normal text-xs font-mono">
          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00F0FF] font-black text-[10px] uppercase block">🎯 INTENTIONAL GAIN</span>
            <p className="text-slate-400 text-[10.5px]">Transitioning completely from passive study into highly active recollection loops, topical past papers, and formula consolidation.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#FF0055] font-black text-[10px] uppercase block">⚡ RECALL LOOPS</span>
            <ul className="text-slate-400 text-[10.5px] list-disc list-inside space-y-0.5">
              <li>PRACTISE: Topical AS past papers</li>
              <li>REVISE: Review flashcards daily</li>
            </ul>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00FF66] font-black text-[10px] uppercase block">⏱️ TOTAL STRENGTH</span>
            <p className="text-slate-400 text-[10.5px]">122 full learning days. Systematically cover and re-test all 70 chapters multiple times under pressured intervals.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-purple-400 font-black text-[10px] uppercase block">💡 THE STRATEGY</span>
            <p className="text-slate-400 text-[10.5px]">Do NOT let gaps persist. Whenever an error occurs, transcribe it immediately into your Mistake Notebook Vault.</p>
          </div>
        </div>
      </div>

      {/* Rotation timeline view */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Repeat className="text-purple-400" size={13} />
          PHASE 2 FIVE-DAY ROTATION INTERACTIVE TRACKER
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {rotationDays.map((col, idx) => (
            <motion.div
              whileHover={{ y: -3 }}
              key={idx}
              className={`bg-[#0A0A0F]/85 border ${col.color} p-4 rounded-xl flex flex-col justify-between space-y-3 relative overflow-hidden`}
            >
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">ROTATION ID</span>
                <h4 className="text-md font-black italic tracking-wide">{col.day}</h4>
              </div>

              <div className="p-2.5 bg-white/2 rounded border border-white/5 text-[10.5px] font-mono leading-relaxed text-slate-350">
                {col.subjects}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Embedded Dynamic Syllabus Checklist tracker */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Layers size={13} className="text-[#00F0FF]" />
          ACTIVE RECALL COMPLETED SYLLABUS DIRECTORY
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
