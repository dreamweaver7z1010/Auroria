import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import PastPaperChecklist from "./PastPaperChecklist";
import { 
  ClipboardCheck, 
  Flame, 
  Calendar, 
  Plus, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Trash2,
  ListTodo
} from "lucide-react";
import { SubjectConfig, SubjectId } from "../types";

interface Phase3PanelProps {
  userSubjects: SubjectConfig[];
  username: string;
}

export default function Phase3Panel({ userSubjects, username }: Phase3PanelProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectId>(userSubjects[0]?.name || "General");

  // Keep activeSubject aligned with userSubjects
  useEffect(() => {
    if (userSubjects.length > 0 && !userSubjects.some(s => s.name === activeSubject)) {
      setActiveSubject(userSubjects[0].name);
    }
  }, [userSubjects, activeSubject]);

  // Strict past paper rotas dynamically generated from user's enrolled subjects
  const subNames = userSubjects.map(s => s.name);
  const count = subNames.length;
  const getRotaSubj = (offset: number) => {
    if (count === 0) return "No Enrolled Subjects";
    if (count === 1) return subNames[0];
    const a = subNames[offset % count];
    const b = subNames[(offset + 1) % count];
    return `${a} + ${b}`;
  };
  const allSubjsStr = subNames.join(" + ");

  const rotaList = [
    { day: "Monday", count: 2, subjects: getRotaSubj(0), color: "text-[#00F0FF]" },
    { day: "Tuesday", count: 2, subjects: getRotaSubj(1), color: "text-purple-400" },
    { day: "Wednesday", count: 2, subjects: getRotaSubj(2), color: "text-[#00FF66]" },
    { day: "Thursday", count: 2, subjects: getRotaSubj(3), color: "text-pink-400" },
    { day: "Friday", count: 2, subjects: getRotaSubj(4), color: "text-[#FFEA00]" },
    { day: "Saturday", count: count || 1, subjects: allSubjsStr || "Enrolled Subjects", color: "text-purple-300" },
    { day: "Sunday", count: count || 1, subjects: allSubjsStr || "Enrolled Subjects", color: "text-amber-400" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Flame className="text-red-500 fill-red-500" size={16} />
              PHASE 3: PAST PAPER MARATHON DRILL
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">DURATIONS: 3 Months [October 1, 2026 - January 15, 2027] | 107 Days ALLOCATION</p>
          </div>
          <span className="px-2.5 py-0.5 bg-[#FF0055]/10 border border-[#FF0055]/25 text-[#FF0055] text-[10px] font-black uppercase rounded animate-pulse">
            State: TIMED MARATHON
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-normal text-xs font-mono">
          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00F0FF] font-black text-[10px] uppercase block">🎯 INTENTIONAL GAIN</span>
            <p className="text-slate-400 text-[10.5px]">Acquire lightning speed under real timed constraints. Practise full duration papers instead of topic modules to notice layout shifts.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#FF0055] font-black text-[10px] uppercase block">⚔️ PERFORMANCE TARGET</span>
            <p className="text-slate-400 text-[10.5px]">Complete up to <strong>270 Full papers</strong> in total across years 2023–2026.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00FF66] font-black text-[10px] uppercase block">⏱️ ROTATION METRIC</span>
            <p className="text-slate-400 text-[10.5px]">Solve 2 full papers daily on weekdays and 4 papers daily during the weekend. Follow the strict rota grid below.</p>
          </div>
        </div>
      </div>

      {/* Strict rotation schedule */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <ListTodo className="text-red-500" size={13} />
          STRICT PAST PAPER WEEKLY SCHEDULE ROTATIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs leading-normal">
          {rotaList.map((item, idx) => (
            <div key={idx} className="bg-[#0a0a0f] border border-white/5 p-3 rounded-xl flex flex-col justify-between space-y-2">
              <div className="border-b border-white/5 pb-1 flex justify-between items-center">
                <span className="font-extrabold text-slate-400">{item.day}</span>
                <span className="px-1 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded">
                  {item.count} Papers
                </span>
              </div>
              <p className={`font-mono text-[10.5px] ${item.color} leading-snug`}>
                {item.subjects}
              </p>
            </div>
          ))}
        </div>
      </div>

      <PastPaperChecklist userSubjects={userSubjects} username={username} />
    </div>
  );
}