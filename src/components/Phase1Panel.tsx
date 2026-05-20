import React from "react";
import { BookOpen, Calendar, Users, Zap, Clock, Activity } from "lucide-react";
import SyllabusTracker from "./SyllabusTracker";
import { SubjectConfig, SubjectId } from "../types";

interface Phase1PanelProps {
  userSubjects: SubjectConfig[];
  onToggleTopic: (subject: SubjectId, topic: string, completed: boolean) => Promise<void>;
  loadingToggle: boolean;
  customSyllabus?: Record<string, any>;
  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;
}

export default function Phase1Panel({
  userSubjects,
  onToggleTopic,
  loadingToggle,
  customSyllabus,
  onSaveCustomSyllabus
}: Phase1PanelProps) {
  return (
    <div className="space-y-6">
      
      {/* Intro Overview Panel */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Calendar className="text-amber-400" size={16} />
              PHASE 1: Foundations & Core Introduction
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">DURATIONS: 2 Months [April 1, 2026 - June 1, 2026] | 60 Days Allocation</p>
          </div>
          <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-black uppercase rounded">
            Stage: Introduction
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-normal text-xs font-mono">
          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00F0FF] font-black text-[10px] uppercase block">🎯 INTENTIONAL GAIN</span>
            <p className="text-slate-400 text-[10.5px]">Mostly a comprehensive introduction to syllabus components, key theoretical frameworks, and initial diagnostic reading.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#FF0055] font-black text-[10px] uppercase block">📚 CORE PROTOCOL</span>
            <ul className="text-slate-400 text-[10.5px] list-disc list-inside space-y-0.5">
              <li>STUDY: Videos, notes, textbooks</li>
              <li>PRACTISE: Topical exercises</li>
              <li>REVISE: Formulate flashcards</li>
            </ul>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00FF66] font-black text-[10px] uppercase block">⏱️ TIME MATRIX</span>
            <p className="text-slate-400 text-[10.5px]">60 operational calendar days. Mapped chapters: 70 core elements in total.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-purple-400 font-black text-[10px] uppercase block">💡 DIAGNOSES CORE</span>
            <p className="text-slate-400 text-[10.5px]">Check off textbook chapters below as they are reviewed in lectures. Ensure 100% completion before Phase 2 starts.</p>
          </div>
        </div>
      </div>

      {/* Phase 1 Daily Templates - Page 1 & 6 of PDF */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Clock className="text-amber-400" size={13} />
          PHASE 1 DAILY THREE-DAY TYPING TEMPLATE (ACTIVE CYCLING)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Day Type A */}
          <div className="border border-[#FFEA00]/20 bg-[#0A0A0F]/80 p-4.5 rounded-xl space-y-3 relative overflow-hidden transition-all hover:border-[#FFEA00]/40">
            <div className="absolute top-0 right-0 w-8 h-8 bg-[#FFEA00]/5 rounded-bl-3xl" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFEA00]/10 text-[#FFEA00] border border-[#FFEA00]/25 text-[10px] font-black flex items-center justify-center">A</span>
              <span className="text-[11px] font-black text-slate-100 uppercase">Day Type A // Core Heavy</span>
            </div>
            
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-[#00F0FF] font-bold block">Chemistry</span>
                <span className="text-[9.5px]">Physical Chemistry / Organic Chapters Drill</span>
              </div>
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-purple-400 font-bold block">Mathematics</span>
                <span className="text-[9.5px]">Pure Mathematics (Paper 1) Foundations</span>
              </div>
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-[#FF0055] font-bold block">English General Paper</span>
                <span className="text-[9.5px]">Core Structural Skills & Paper 1 Essay writing</span>
              </div>
            </div>
          </div>

          {/* Day Type B */}
          <div className="border border-purple-500/20 bg-[#0A0A0F]/80 p-4.5 rounded-xl space-y-3 relative overflow-hidden transition-all hover:border-purple-500/40">
            <div className="absolute top-0 right-0 w-8 h-8 bg-purple-500/5 rounded-bl-3xl" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/25 text-[10px] font-black flex items-center justify-center">B</span>
              <span className="text-[11px] font-black text-slate-100 uppercase">Day Type B // Logic & Mechanics</span>
            </div>
            
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-[#00FF66] font-bold block">Physics</span>
                <span className="text-[9.5px]">Mechanics & Physical quant boundaries</span>
              </div>
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-pink-400 font-bold block">Computer Science</span>
                <span className="text-[9.5px]">Theory & Logical software fundamentals</span>
              </div>
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-purple-400 font-bold block">Mathematics</span>
                <span className="text-[9.5px]">Probability & Statistics 1 (Paper 5) Units</span>
              </div>
            </div>
          </div>

          {/* Day Type C */}
          <div className="border border-pink-500/20 bg-[#0A0A0F]/80 p-4.5 rounded-xl space-y-3 relative overflow-hidden transition-all hover:border-pink-500/40">
            <div className="absolute top-0 right-0 w-8 h-8 bg-pink-500/5 rounded-bl-3xl" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/25 text-[10px] font-black flex items-center justify-center">C</span>
              <span className="text-[11px] font-black text-slate-100 uppercase">Day Type C // Inorganic & Waves</span>
            </div>
            
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-[#00F0FF] font-bold block">Chemistry</span>
                <span className="text-[9.5px]">Inorganic periodicity, Groups 2 & 17</span>
              </div>
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-[#00FF66] font-bold block">Physics</span>
                <span className="text-[9.5px]">Modern Waves, Superposition & Electricity</span>
              </div>
              <div className="p-2 border border-white/5 bg-[#12121A]/80 rounded text-slate-350">
                <span className="text-[#FF0055] font-bold block">English General Paper</span>
                <span className="text-[9.5px]">Comprehension practice & Topic content banks</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Dynamic Syllabus Checklist tracker */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity size={13} className="text-[#00F0FF]" />
          PHASE 1 COMPLETED MATRIX CHAPTER CHECKLIST
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
