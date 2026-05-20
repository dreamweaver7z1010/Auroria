import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, 
  BookMarked, 
  Trash2, 
  CheckSquare, 
  Square, 
  Plus, 
  AlertCircle, 
  HelpCircle,
  FileCheck,
  Search,
  BookOpen,
  Image,
  X
} from "lucide-react";
import { MistakeVault, SubjectConfig } from "../types";

interface PreExamPanelProps {
  userSubjects: SubjectConfig[];
  mistakes: MistakeVault[];
  onAddMistake: (newMistake: Omit<MistakeVault, "id" | "resolved" | "dateAdded">) => Promise<void>;
  onResolveMistake: (id: string) => Promise<void>;
}

export default function PreExamPanel({
  userSubjects,
  mistakes,
  onAddMistake,
  onResolveMistake
}: PreExamPanelProps) {
  // Adder state
  const [subjectSelected, setSubjectSelected] = useState(userSubjects[0]?.name || "Chemistry");
  const [description, setDescription] = useState("");
  const [wrongApproach, setWrongApproach] = useState("");
  const [correctedSequence, setCorrectedSequence] = useState("");
  const [questionImage, setQuestionImage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQuestionImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !wrongApproach.trim() || !correctedSequence.trim()) {
      alert("Provide error details, wrong approach, and corrective actions.");
      return;
    }

    try {
      await onAddMistake({
        subject: subjectSelected,
        description: description.trim(),
        wrongApproach: wrongApproach.trim(),
        correctedSequence: correctedSequence.trim(),
        questionImage: questionImage.trim() || undefined
      });

      // Reset
      setDescription("");
      setWrongApproach("");
      setCorrectedSequence("");
      setQuestionImage("");
    } catch {
      alert("Failed recording error slip.");
    }
  };

  // Filter mistakes
  const filteredMistakes = mistakes.filter(m => {
    const matchesSearch = m.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.wrongApproach.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.correctedSequence.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = filterSubject === "ALL" || m.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      
      {/* Intro Overview Panel */}
      <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
          <div>
            <h2 className="text-md font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="text-teal-400" size={16} />
              PRE-EXAM PHASE: THE FINAL 15-DAY COMBAT WINDOW
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">DURATIONS: 15 Days [January 16 - January 31] (CS m/j: March 15 - April 20)</p>
          </div>
          <span className="px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/25 text-teal-400 text-[10px] font-black uppercase rounded">
            Stage: High Alert
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-normal text-xs font-mono">
          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00F0FF] font-black text-[10px] uppercase block">🎯 INTENTIONAL GAIN</span>
            <p className="text-slate-400 text-[10.5px]">Seal all operational leaks. Read and review every item logged inside your mistake notebooks. Never repeat any historical errors.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#FF0055] font-black text-[10px] uppercase block">📑 THE OCT/NOV DRILL</span>
            <p className="text-slate-400 text-[10.5px]">Attempt the 3 variants of OCT/NOV 2026. This exposes the latest question styles introduced by board examiners.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-[#00FF66] font-black text-[10px] uppercase block">📇 RECALIBRATIONS</span>
            <p className="text-slate-400 text-[10.5px]">Analyze previous papers, do a sweep of flashcard decks, and re-read complex textbook units where marks were dropped.</p>
          </div>

          <div className="space-y-1 bg-[#0A0A0F] border border-white/5 p-3 rounded-lg">
            <span className="text-purple-400 font-black text-[10px] uppercase block">🔒 ZERO OVERLOAD</span>
            <p className="text-slate-400 text-[10.5px]">Avoid reading completely new textbook subjects from scratch. Stay consolidated on what has already been practiced.</p>
          </div>
        </div>
      </div>

      {/* Interactive Mistake Vault Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Adder workspace forms */}
        <div className="lg:col-span-1 border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative h-fit space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-100 flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <BookMarked size={14} className="text-teal-400" />
            FILE A NEW CARELESS ERROR NODE
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wide">Target Subject Tag</span>
              <select
                value={subjectSelected}
                onChange={(e) => setSubjectSelected(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-teal-400 focus:outline-none"
              >
                {userSubjects.map(s => (
                  <option key={s.name} value={s.name}>{s.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wide">Error Description / Slip Details</span>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Substituted incorrect signs during kinematics acceleration integration"
                className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wide">Wrong/Faulty Approach</span>
              <textarea
                rows={2}
                value={wrongApproach}
                onChange={(e) => setWrongApproach(e.target.value)}
                placeholder="e.g. Used positive g (+9.81) directly even though project velocity points upward"
                className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wide">Corrected Sequence / Active Strategy</span>
              <textarea
                rows={2}
                value={correctedSequence}
                onChange={(e) => setCorrectedSequence(e.target.value)}
                placeholder="e.g. Draw vector coordinates first. Define motion sign conventions immediately."
                className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1 bg-[#0A0A0F]/50 border border-white/5 p-2 rounded-lg space-y-2">
              <span className="text-[9.5px] text-slate-400 uppercase font-black tracking-wide block">📷 Question Screenshot (Optional)</span>
              <div className="space-y-1.5 font-mono">
                <input
                  type="text"
                  value={questionImage.startsWith("data:") ? "" : questionImage}
                  onChange={(e) => setQuestionImage(e.target.value)}
                  placeholder="Paste link to question image..."
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2 py-1 text-slate-200 text-[11px] placeholder-slate-650 focus:border-teal-400 focus:outline-none"
                />
                
                <div className="flex items-center justify-between text-[8px] text-slate-500 uppercase font-bold tracking-wider">
                  <span>or browse local file:</span>
                  {questionImage && (
                    <button 
                      type="button" 
                      onClick={() => setQuestionImage("")}
                      className="text-red-400 hover:underline hover:text-red-350 cursor-pointer font-bold"
                    >
                      [clear image]
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="text-[10px] text-slate-500 cursor-pointer w-full file:bg-white/5 file:border-0 file:px-2 file:py-0.5 file:rounded file:text-slate-350 hover:file:bg-white/10"
                />

                {questionImage && (
                  <div className="mt-1.5 border border-white/15 p-1 rounded bg-[#0A0A0F] relative">
                    <img 
                      src={questionImage} 
                      alt="Question attachment preview" 
                      className="max-h-24 w-full object-contain rounded bg-slate-900"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-90 text-white font-black uppercase text-[10px] tracking-widest rounded-lg shadow-lg cursor-pointer animate-pulse"
            >
              + File Slip into Notebook
            </button>
          </form>
        </div>

        {/* Mistake lists workspace view */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Header search controls */}
          <div className="bg-[#0A0A0F] border border-white/5 p-4.5 rounded-xl flex flex-col sm:flex-row items-center gap-3.5 text-xs">
            <div className="flex-1 w-full relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search mistake logs, keywords, correct processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-widest shrink-0">Filter Subject:</span>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-[#12121A] border border-white/10 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none uppercase font-bold"
              >
                <option value="ALL">ALL Subjects</option>
                {userSubjects.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List display */}
          <div className="space-y-3.5">
            {filteredMistakes.map(item => (
              <motion.div
                layout
                key={item.id}
                className={`border p-4.5 rounded-xl shadow-xl transition-all relative overflow-hidden font-mono text-xs text-slate-350 bg-[#12121A]/70 ${
                  item.resolved 
                    ? "border-emerald-500/20 opacity-60" 
                    : "border-[#FF0055]/15"
                }`}
              >
                {/* Glow hint */}
                <div className={`absolute top-0 left-0 w-1 h-full ${item.resolved ? "bg-emerald-500" : "bg-[#FF0055]"}`} />

                <div className="flex items-start justify-between gap-1 border-b border-white/5 pb-2 mb-2.5">
                  <div className="space-y-0.5">
                    <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/15 rounded text-[9px] font-black uppercase tracking-wider block w-fit">
                      {item.subject.toUpperCase()}
                    </span>
                    <h4 className="text-slate-100 font-extrabold text-[12px]">{item.description}</h4>
                  </div>

                  <button
                    onClick={() => onResolveMistake(item.id)}
                    className="p-1 px-2 border border-white/15 hover:border-teal-400 hover:bg-teal-400/5 text-slate-400 hover:text-teal-400 rounded text-[9.5px] font-extrabold uppercase shrink-0 tracking-wider transition-all flex items-center gap-1"
                  >
                    {item.resolved ? (
                      <>
                        <FileCheck size={11} className="text-emerald-400" />
                        Resolved
                      </>
                    ) : (
                      <>
                        <AlertCircle size={11} className="text-[#FF0055]" />
                        Review Done
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10.5px]">
                  <div className="p-2.5 bg-red-950/10 border border-red-500/10 rounded-lg space-y-1">
                    <span className="text-[#FF0055] font-black text-[9px] uppercase tracking-wider block">🚫 FAULTY/WRONG APPROACH IN TEST</span>
                    <p className="text-slate-400 italic">"{item.wrongApproach}"</p>
                  </div>

                  <div className="p-2.5 bg-emerald-950/10 border border-emerald-500/10 rounded-lg space-y-1">
                    <span className="text-[#00FF66] font-black text-[9px] uppercase tracking-wider block">✅ CORRECTED PROCESS SEQUENCE</span>
                    <p className="text-slate-300 font-bold">"{item.correctedSequence}"</p>
                  </div>
                </div>

                {item.questionImage && (
                  <div className="mt-3 p-2.5 bg-[#0A0A0F] border border-white/5 rounded-lg space-y-1.5 font-mono">
                    <span className="text-[9px] text-[#00F0FF] uppercase font-black tracking-wider block flex items-center gap-1.5">
                      <Image size={11} className="text-[#00F0FF]" /> ATTACHED QUESTION REFERENCE
                    </span>
                    <a href={item.questionImage} target="_blank" rel="noopener noreferrer" title="View full image in standard tab" className="block w-fit">
                      <img
                        src={item.questionImage}
                        alt="Question screenshot reference"
                        className="max-h-52 max-w-full object-contain rounded border border-white/10 hover:border-teal-400 transition-all cursor-zoom-in"
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  </div>
                )}

                <div className="text-[8.5px] text-slate-550 pt-2.5 flex justify-between uppercase">
                  <span>LOG ID: {item.id}</span>
                  <span>DATE REGISTERED: {item.dateAdded}</span>
                </div>
              </motion.div>
            ))}

            {filteredMistakes.length === 0 && (
              <div className="text-center py-12 bg-[#0A0A0F] border border-white/5 rounded-xl text-slate-550 font-mono">
                No mistakes matching criteria logged. Fill mistakes inside the left console to start your notebook vault!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
