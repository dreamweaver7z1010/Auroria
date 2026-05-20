import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
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

interface PastPaperObj {
  id: string;
  year: number;
  name: string;
  series: string;
  completed: boolean;
}

// Preset defaults for AS-level past paper checklist to assist the user straightaway
const DEFAULT_PAPERS_PRE_LOAD: Record<string, Omit<PastPaperObj, "completed">[]> = {
  "Chemistry": [
    { id: "chem_1", year: 2026, series: "May/June", name: "Paper 1 (MCQ)" },
    { id: "chem_2", year: 2026, series: "May/June", name: "Paper 2 (AS Structured)" },
    { id: "chem_3", year: 2026, series: "Oct/Nov", name: "Paper 1 (MCQ)" },
    { id: "chem_4", year: 2026, series: "Oct/Nov", name: "Paper 2 (AS Structured)" },
    { id: "chem_5", year: 2025, series: "May/June", name: "Paper 1 (MCQ)" },
    { id: "chem_6", year: 2025, series: "May/June", name: "Paper 2 (AS Structured)" }
  ],
  "Physics": [
    { id: "phys_1", year: 2026, series: "May/June", name: "Paper 1 (MCQ)" },
    { id: "phys_2", year: 2026, series: "May/June", name: "Paper 2 (AS Structured)" },
    { id: "phys_3", year: 2025, series: "May/June", name: "Paper 1 (MCQ)" },
    { id: "phys_4", year: 2025, series: "May/June", name: "Paper 2 (AS Structured)" }
  ],
  "Math": [
    { id: "math_1", year: 2026, series: "May/June", name: "Paper 1 (Pure Math 1)" },
    { id: "math_2", year: 2026, series: "May/June", name: "Paper 5 (Prob & Stats 1)" },
    { id: "math_3", year: 2025, series: "May/June", name: "Paper 1 (Pure Math 1)" },
    { id: "math_4", year: 2025, series: "May/June", name: "Paper 5 (Prob & Stats 1)" }
  ],
  "Computer Science": [
    { id: "cs_1", year: 2026, series: "May/June", name: "Paper 1 (Theory Fundamentals)" },
    { id: "cs_2", year: 2026, series: "May/June", name: "Paper 2 (Programming & Logic)" },
    { id: "cs_3", year: 2025, series: "May/June", name: "Paper 1 (Theory Fundamentals)" },
    { id: "cs_4", year: 2025, series: "May/June", name: "Paper 2 (Programming & Logic)" }
  ],
  "English": [
    { id: "eng_1", year: 2026, series: "May/June", name: "Paper 1 (Essay)" },
    { id: "eng_2", year: 2026, series: "May/June", name: "Paper 2 (Comprehension)" },
    { id: "eng_3", year: 2025, series: "May/June", name: "Paper 1 (Essay)" },
    { id: "eng_4", year: 2025, series: "May/June", name: "Paper 2 (Comprehension)" }
  ]
};

export default function Phase3Panel({ userSubjects, username }: Phase3PanelProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectId>(userSubjects[0]?.name || "Chemistry");
  
  // Strict past paper rotas from PDF page 2
  const rotaList = [
    { day: "Monday", count: 2, subjects: "Chemistry + Mathematics", color: "text-[#00F0FF]" },
    { day: "Tuesday", count: 2, subjects: "Physics + Computer Science", color: "text-purple-400" },
    { day: "Wednesday", count: 2, subjects: "English + Chemistry", color: "text-[#00FF66]" },
    { day: "Thursday", count: 2, subjects: "Mathematics + Physics", color: "text-pink-400" },
    { day: "Friday", count: 2, subjects: "Computer Science + English", color: "text-[#FFEA00]" },
    { day: "Saturday", count: 4, subjects: "Chemistry + Physics + Mathematics + English", color: "text-purple-300" },
    { day: "Sunday", count: 4, subjects: "Computer Science + English + Chemistry + Physics", color: "text-amber-400" }
  ];

  // Load dynamically added & completed past papers for subjects from local storage to survive tab closures
  const [papersMap, setPapersMap] = useState<Record<string, PastPaperObj[]>>({});
  const [expandedYear, setExpandedYear] = useState<number>(2026);

  // New paper creation inputs
  const [newPaperYear, setNewPaperYear] = useState<number>(2026);
  const [newPaperSeries, setNewPaperSeries] = useState("May/June");
  const [newPaperName, setNewPaperName] = useState("");

  useEffect(() => {
    const key = `pastPapers_${username}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        setPapersMap(JSON.parse(cached));
      } catch (e) {
        initializeDefaultPapers();
      }
    } else {
      initializeDefaultPapers();
    }
  }, [username]);

  const initializeDefaultPapers = () => {
    // Map DEFAULTS with completed: false
    const init: Record<string, PastPaperObj[]> = {};
    Object.keys(DEFAULT_PAPERS_PRE_LOAD).forEach(subj => {
      init[subj] = DEFAULT_PAPERS_PRE_LOAD[subj].map(p => ({ ...p, completed: false }));
    });
    setPapersMap(init);
    savePapers(init);
  };

  const savePapers = (updated: Record<string, PastPaperObj[]>) => {
    const key = `pastPapers_${username}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const handleTogglePaper = (subj: string, id: string) => {
    const updatedSubPapers = (papersMap[subj] || []).map(p => {
      if (p.id === id) return { ...p, completed: !p.completed };
      return p;
    });
    const updated = { ...papersMap, [subj]: updatedSubPapers };
    setPapersMap(updated);
    savePapers(updated);
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaperName.trim()) {
      alert("Please state a paper layout code.");
      return;
    }

    const newPaper: PastPaperObj = {
      id: "p_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      year: Number(newPaperYear),
      series: newPaperSeries,
      name: newPaperName.trim(),
      completed: false
    };

    const updatedSubPapers = [...(papersMap[activeSubject] || []), newPaper];
    const updated = { ...papersMap, [activeSubject]: updatedSubPapers };
    setPapersMap(updated);
    savePapers(updated);

    // reset input
    setNewPaperName("");
  };

  const handleDeletePaper = (subj: string, id: string) => {
    const updatedSubPapers = (papersMap[subj] || []).filter(p => p.id !== id);
    const updated = { ...papersMap, [subj]: updatedSubPapers };
    setPapersMap(updated);
    savePapers(updated);
  };

  // Group papers of active subject by Year
  const currentSubjectPapers = papersMap[activeSubject] || [];
  const yearsRepresented = [2026, 2025, 2024, 2023, 2022, 2021];

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
            <p className="text-slate-400 text-[10.5px]">Complete up to <strong>270 Full papers</strong> in total. Ensure strict review of variant 1, 2, and 3 across years 2023–2026.</p>
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

      {/* Dynamic Past Paper Track suite similar to Syllabus Tracker */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-100 flex items-center gap-2 uppercase tracking-wide">
            <ClipboardCheck size={14} className="text-[#00FF66]" />
            CHRONOLOGICAL PAST PAPER CHECKLIST TRACK
          </h3>

          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 uppercase">
            <span>Saber-Metrics Target: 2022 to 2026 Full Coverage</span>
          </div>
        </div>

        {/* Dynamic add-a-paper controller */}
        <form onSubmit={handleAddPaper} className="bg-[#0A0A0F] border border-white/5 p-3.5 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-wide block">Select Target Year</span>
            <select
              value={newPaperYear}
              onChange={(e) => setNewPaperYear(Number(e.target.value))}
              className="w-full bg-[#12121A] border border-white/10 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              {[2026, 2025, 2024, 2023, 2022, 2021].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-wide block">Exam Series</span>
            <select
              value={newPaperSeries}
              onChange={(e) => setNewPaperSeries(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              <option value="May/June">May/June (M/J)</option>
              <option value="Oct/Nov">Oct/Nov (O/N)</option>
              <option value="Feb/March">Feb/March (F/M)</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-wide block">Paper Name / Variant</span>
            <input
              type="text"
              value={newPaperName}
              onChange={(e) => setNewPaperName(e.target.value)}
              placeholder="e.g. Paper 12 (MCQ Variant 2)"
              className="w-full bg-[#12121A] border border-white/10 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 bg-[#00FF66] hover:opacity-90 text-black font-black uppercase text-[10px] rounded tracking-wide transition-all"
            >
              + Create Paper Node
            </button>
          </div>
        </form>

        {/* Grid containing Subject Rail and Years flow list */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Subject tabs */}
          <div className="md:col-span-1 space-y-2">
            {userSubjects.map(s => {
              const subPapers = papersMap[s.name] || [];
              const doneCount = subPapers.filter(p => p.completed).length;
              const totalCount = subPapers.length || 1;
              const percent = Math.round((doneCount / totalCount) * 100);
              const isSelected = activeSubject === s.name;

              return (
                <button
                  key={s.name}
                  onClick={() => setActiveSubject(s.name)}
                  className={`w-full text-left p-2.5 rounded border transition-all text-[11px] flex justify-between items-center ${
                    isSelected 
                      ? "bg-red-500/10 border-red-500 text-red-400 font-extrabold" 
                      : "bg-white/2 border-white/5 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  <span className="truncate uppercase">{s.name}</span>
                  <span className="text-[9.5px] text-slate-500">{doneCount}/{subPapers.length} papers</span>
                </button>
              );
            })}
          </div>

          {/* Chronological Accordions for Years flow */}
          <div className="md:col-span-3 space-y-3">
            {yearsRepresented.map(yr => {
              const yrPapers = currentSubjectPapers.filter(p => p.year === yr);
              const isExpanded = expandedYear === yr;

              return (
                <div key={yr} className="bg-[#0A0A0F] border border-white/5 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedYear(isExpanded ? 0 : yr)}
                    className="w-full text-left p-3 bg-[#111118]/70 flex items-center justify-between hover:bg-[#11111d] transition-all text-xs"
                  >
                    <span className="font-extrabold text-[#00F0FF]">YEAR INDEX // {yr}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500">({yrPapers.length} Papers Registered)</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 space-y-2 max-h-[200px] overflow-y-auto divide-y divide-white/2">
                      {yrPapers.map(paper => (
                        <div key={paper.id} className="pt-2 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => handleTogglePaper(activeSubject, paper.id)}
                            className="flex-1 text-left flex items-center gap-2.5 group"
                          >
                            {paper.completed ? (
                              <CheckSquare size={13} className="text-[#00FF66] shrink-0" />
                            ) : (
                              <Square size={13} className="text-slate-500 group-hover:text-slate-350 shrink-0" />
                            )}
                            <span className={paper.completed ? "line-through text-slate-500 lowercase font-mono" : "text-slate-200 lowercase font-mono"}>
                              {activeSubject} ({paper.series}) – {paper.name}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDeletePaper(activeSubject, paper.id)}
                            className="p-1 text-slate-500 hover:text-red-500 transition-colors"
                            title="Remove Paper Node"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}

                      {yrPapers.length === 0 && (
                        <div className="text-center py-6 text-slate-600 text-[10px] italic">
                          No papers registered for year {yr}. Use the form above to add a timed target.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
