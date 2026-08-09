import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckSquare, 
  Square, 
  Book, 
  Upload, 
  FileText, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles, 
  Trash2,
  Check,
  Plus,
  FolderPlus,
  BookOpen,
  FileCheck,
  Flame,
  ShieldCheck,
  Zap
} from "lucide-react";
import { SubjectId, SubjectConfig } from "../types";
import { DEFAULT_PRESET_SYLLABUS, normalizeSubjectName, getSyllabusMap as getSyllabusMapUtil } from "../utils/syllabusUtils";

interface SyllabusTrackerProps {
  userSubjects: SubjectConfig[];
  onToggleTopic: (subject: SubjectId, topic: string, completed: boolean, phaseId?: number) => Promise<void>;
  loadingToggle: boolean;
  customSyllabus?: Record<string, any>;
  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;
  showTitle?: boolean;
  phaseId?: number;
}

export default function SyllabusTracker({ 
  userSubjects, 
  onToggleTopic, 
  loadingToggle,
  customSyllabus = {},
  onSaveCustomSyllabus,
  showTitle = true,
  phaseId
}: SyllabusTrackerProps) {
  const firstSub = userSubjects[0]?.name || "Chemistry";
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(firstSub);

  // If selected subject is no longer in user's state, fallback
  const activeSubject = userSubjects.some(s => s.name === selectedSubject) 
    ? selectedSubject 
    : firstSub;

  const sCfg = userSubjects.find(s => s.name === activeSubject);
  const pKey = phaseId ? `completedTopics_phase${phaseId}` : "completedTopics";
  const completedList = new Set<string>((sCfg as any)?.[pKey] || sCfg?.completedTopics || []);

  // Form states matching chronological checklist style 
  const [targetGroup, setTargetGroup] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [expandedGroupName, setExpandedGroupName] = useState<string>("");

  // Console paster upload states
  const [panelOpen, setPanelOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [parseMode, setParseMode] = useState<"TEXT" | "PREVIEW">("TEXT");
  const [parsedPreview, setParsedPreview] = useState<{ name: string; topics: string[] }[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse custom database syllabus fallback
  const getSyllabusMap = (subjName: string): { name: string; topics: string[] }[] => {
    const rawVal = customSyllabus && customSyllabus[subjName];
    if (rawVal) {
      if (Array.isArray(rawVal)) {
        return rawVal;
      }
      const arr: { name: string; topics: string[] }[] = [];
      if (rawVal.groupA) arr.push({ name: rawVal.groupA.name, topics: rawVal.groupA.topics || [] });
      if (rawVal.groupB) arr.push({ name: rawVal.groupB.name, topics: rawVal.groupB.topics || [] });
      return arr;
    }

    const matchedKey = normalizeSubjectName(subjName);
    if (DEFAULT_PRESET_SYLLABUS[matchedKey]) {
      return DEFAULT_PRESET_SYLLABUS[matchedKey];
    }

    const sObj = userSubjects.find(s => s.name === subjName);
    if (sObj && sObj.components && sObj.components.length > 0) {
      return sObj.components.map(comp => ({
        name: comp.name,
        topics: [
          `${comp.name}: Theoretical Principles & Key Terms`,
          `${comp.name}: Structured Problem Solving & Analysis`,
          `${comp.name}: Case Studies & Applied Exercises`
        ]
      }));
    }
    
    return [
      {
        name: `${subjName} Paper 1 Core Theory`,
        topics: [
          "Theoretical Framework Overview",
          "Key Definitions & Conceptual Models",
          "Foundational Principles"
        ]
      },
      {
        name: `${subjName} Paper 2 Applied Analysis`,
        topics: [
          "Advanced Methodical Applications",
          "Structured Exam Questions",
          "Evaluation & Case Study Analysis"
        ]
      }
    ];
  };

  const calculateSyllabusProgress = (subjName: SubjectId) => {
    const s = userSubjects.find(sc => sc.name === subjName);
    const pKeySub = phaseId ? `completedTopics_phase${phaseId}` : "completedTopics";
    const completedCount = ((s as any)?.[pKeySub] || s?.completedTopics || []).length;
    const map = getSyllabusMap(subjName);
    const totalTopicsInSyllabus = map.reduce((sum, g) => sum + g.topics.length, 0) || 1;
    return parseFloat(((completedCount / totalTopicsInSyllabus) * 100).toFixed(0));
  };

  // Calculate combat readiness metrics
  const activeSyllabusPct = calculateSyllabusProgress(activeSubject);
  const combatReadinessPct = activeSyllabusPct;

  const currentSyllabus = getSyllabusMap(activeSubject);

  // Keep first group expanded by default if state is empty
  React.useEffect(() => {
    if (currentSyllabus.length > 0 && !expandedGroupName) {
      setExpandedGroupName(currentSyllabus[0].name);
    }
  }, [activeSubject]);

  // Dispatch helper to add custom named groups and topic chapters
  const handleAddNewTopicNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetGroup.trim()) {
      alert("Please state a Group Category name (e.g. Inorganic Chemistry).");
      return;
    }
    if (!newTopicName.trim()) {
      alert("Please enter a Topic or Chapter title.");
      return;
    }

    const groupToFind = targetGroup.trim();
    const topicToAdd = newTopicName.trim();

    let updatedList = [...currentSyllabus];
    const existingGroupIdx = updatedList.findIndex(
      g => g.name.toLowerCase() === groupToFind.toLowerCase()
    );

    if (existingGroupIdx !== -1) {
      updatedList[existingGroupIdx] = {
        ...updatedList[existingGroupIdx],
        topics: [...updatedList[existingGroupIdx].topics, topicToAdd]
      };
    } else {
      updatedList.push({
        name: groupToFind,
        topics: [topicToAdd]
      });
    }

    if (onSaveCustomSyllabus) {
      await onSaveCustomSyllabus(activeSubject, updatedList);
      setNewTopicName("");
      setExpandedGroupName(groupToFind);
    }
  };

  // Delete an entire group
  const handleDeleteGroup = async (groupName: string) => {
    if (confirm(`Are you sure you want to delete this group units list: "${groupName}"?`)) {
      const updated = currentSyllabus.filter(g => g.name !== groupName);
      if (onSaveCustomSyllabus) {
        await onSaveCustomSyllabus(activeSubject, updated);
      }
    }
  };

  // Delete a topic in a group by index
  const handleDeleteTopic = async (groupName: string, topicIndex: number) => {
    const updated = currentSyllabus.map(g => {
      if (g.name === groupName) {
        return {
          ...g,
          topics: g.topics.filter((_, i) => i !== topicIndex)
        };
      }
      return g;
    });
    if (onSaveCustomSyllabus) {
      await onSaveCustomSyllabus(activeSubject, updated);
    }
  };

  // Drag and drop parser callbacks
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPastedText(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleStartParseSyllabus = () => {
    if (!pastedText.trim()) {
      alert("Please enter draft or load default constants first.");
      return;
    }
    const lines = pastedText.split("\n");
    const parsedGroups: { name: string; topics: string[] }[] = [];
    let currentGroupName = "Pasted Chapter Group";
    let currentTopics: string[] = [];

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;
      if (cleanLine.startsWith("##") || cleanLine.startsWith("###")) {
        if (currentTopics.length > 0) {
          parsedGroups.push({ name: currentGroupName, topics: currentTopics });
          currentTopics = [];
        }
        currentGroupName = cleanLine.replace(/^[#\s]+/, "").trim();
      } else {
        const item = cleanLine.replace(/^[-*•🔴💡🔥✅]+/, "").replace(/^\d+[\.\)]+\s*/, "").trim();
        if (item.length > 2 && item.length < 120) {
          currentTopics.push(item);
        }
      }
    });

    if (currentTopics.length > 0) {
      parsedGroups.push({ name: currentGroupName, topics: currentTopics });
    }

    if (parsedGroups.length === 0) {
      const simpleList: string[] = [];
      lines.forEach(l => {
        const cl = l.trim().replace(/^[-*•]+/, "").trim();
        if (cl.length > 3 && cl.length < 90) simpleList.push(cl);
      });
      if (simpleList.length > 0) {
        parsedGroups.push({ name: "Imported Study Group", topics: simpleList });
      } else {
        alert("Could not identify topics format directory.");
        return;
      }
    }

    setParsedPreview(parsedGroups);
    setParseMode("PREVIEW");
  };

  const persistSyllabusToDB = async () => {
    if (!parsedPreview || !onSaveCustomSyllabus) return;
    await onSaveCustomSyllabus(activeSubject, parsedPreview);
    setParseMode("TEXT");
    setPastedText("");
    setParsedPreview(null);
    setPanelOpen(false);
  };

  const handleResetToPresetSyllabus = async () => {
    if (!onSaveCustomSyllabus) return;
    if (confirm(`Reset and adopt raw default Cambridge AS-Level presets for "${activeSubject}"?`)) {
      await onSaveCustomSyllabus(activeSubject, null);
      setPanelOpen(false);
    }
  };

  return (
    <div className="border border-white/5 bg-[#12121A]/80 backdrop-blur-md rounded-xl p-5 relative overflow-hidden font-mono text-xs space-y-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9D00FF]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title & View Switcher header block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {showTitle && (
            <h3 className="text-xs font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="text-amber-500 animate-pulse shrink-0" size={14} />
              {phaseId === 3 ? "PHASE 3 EXAM MASTERY MATRIX" : "CHRONOLOGICAL SYLLABUS CHECKLIST TRACK"}
            </h3>
          )}

          {/* Syllabus Checklist header */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded text-[10px] font-bold uppercase">
            <BookOpen size={12} />
            Syllabus Checklist
          </div>
        </div>

        {/* Combat Readiness Indicator Banner */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0A0A0F] border border-white/10 rounded-lg text-[10px]">
            <Flame className="text-[#00FF66] animate-pulse" size={13} />
            <span className="text-slate-400 font-bold uppercase">COMBAT READINESS:</span>
            <span className="font-extrabold text-[#00FF66] text-xs">{combatReadinessPct}%</span>
          </div>

          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="px-3 py-1 bg-[#12121A] border border-white/10 hover:border-[#9D00FF] hover:bg-[#9D00FF]/10 text-slate-300 font-bold rounded flex items-center gap-1.5 transition-all text-[10px] uppercase cursor-pointer"
          >
            <Upload size={11} className="text-[#9D00FF]" />
            Bulk Paste
            {panelOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {panelOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 border border-white/10 bg-[#0A0A0F]/90 rounded-xl space-y-4 shadow-2xl relative overflow-hidden text-slate-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#00F0FF]" />
              <span className="text-[10px] font-black text-slate-200 uppercase">
                BULK BULLET INTEGRATOR SOURCE // {activeSubject.toUpperCase()}
              </span>
            </div>
            {customSyllabus[activeSubject] && (
              <button
                onClick={handleResetToPresetSyllabus}
                className="px-2 py-0.5 border border-[#FFEA00]/30 hover:bg-[#FFEA00]/10 text-[#FFEA00] rounded text-[9px] flex items-center gap-1 transition-all uppercase cursor-pointer font-bold"
              >
                Reset Default Presets
              </button>
            )}
          </div>

          {parseMode === "TEXT" ? (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 font-mono">
                Support markdown list imports. Mark your custom groups with ## and topics with simple bullet lines:
              </p>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`## Physical Chemistry\n- Atomic structure\n- Chemical bonding\n\n## Inorganic Chemistry\n- Periodic table trends`}
                className="w-full bg-[#12121A] border border-white/10 text-slate-200 px-3 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-[#00F0FF] transition-all"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    const key = normalizeSubjectName(activeSubject);
                    const preset = DEFAULT_PRESET_SYLLABUS[key];
                    if (preset) {
                      setPastedText(preset.map(g => `## ${g.name}\n` + g.topics.map(t => `- ${t}`).join("\n")).join("\n\n"));
                    } else {
                      alert("No default presets available for this subject name.");
                    }
                  }}
                  className="mr-auto px-2.5 py-1 bg-slate-950 border border-white/10 hover:bg-slate-900 text-slate-300 rounded text-[9px] uppercase font-bold cursor-pointer"
                >
                  Load As-Level Presets
                </button>
                <button
                  onClick={handleStartParseSyllabus}
                  className="px-3 py-1 bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/25 font-bold uppercase rounded text-[9px] transition-all cursor-pointer"
                >
                  Parse Structure
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[9px] text-[#00F0FF] uppercase block font-bold">STRUCTURE READY TO INTEGRATE:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[160px] overflow-y-auto">
                {parsedPreview?.map((group, idx) => (
                  <div key={idx} className="bg-[#12121A] p-2 border border-white/5 rounded text-[10px]">
                    <div className="text-[#00F0FF] font-bold border-b border-[#00F0FF]/10 pb-0.5 mb-1 flex justify-between uppercase">{group.name} <span>({group.topics.length})</span></div>
                    <div className="text-slate-400 space-y-0.5">
                      {group.topics.slice(0, 3).map((t, ti) => <div className="truncate" key={ti}>• {t}</div>)}
                      {group.topics.length > 3 && <div className="text-slate-650 italic text-[9px]">+{group.topics.length - 3} more</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button onClick={() => setParseMode("TEXT")} className="px-2 py-1 border border-white/10 text-slate-400 rounded hover:text-white cursor-pointer uppercase font-bold">Back</button>
                <button onClick={persistSyllabusToDB} className="px-3 py-1 bg-amber-500 text-black font-black uppercase rounded shadow-lg hover:opacity-90 cursor-pointer">Compile Integration Track</button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Main interactive form to input topics into own named group */}
      <form onSubmit={handleAddNewTopicNode} className="bg-[#0A0A0F] border border-white/15 p-3.5 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wide flex justify-between">
              <span>Group Name / Category</span>
              {currentSyllabus.length > 0 && <span className="text-[#00F0FF] text-[8px] italic pr-1">Use list or type new</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                list={`groups-list-${activeSubject}`}
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                placeholder="e.g. Physical Chemistry, Organic, Mechanics"
                className="w-full bg-[#12121A] border border-white/10 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
              <datalist id={`groups-list-${activeSubject}`}>
                {currentSyllabus.map(g => (
                  <option key={g.name} value={g.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wide block">Topic Name / Lesson Title</label>
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="e.g. Nucleophilic substitution mechanisms"
              className="w-full bg-[#12121A] border border-white/10 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-400 font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-black font-black uppercase text-[10px] rounded tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FolderPlus size={12} />
              + File Topic Node
            </button>
          </div>
        </form>

      {/* Layout Grid containing Subject left rail and customizable checklists */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Left selector rail */}
        <div className="md:col-span-1 space-y-2">
          {userSubjects.map(s => {
            const topicProgress = calculateSyllabusProgress(s.name);
            const isSelected = activeSubject === s.name;
            return (
              <button
                key={s.name}
                onClick={() => setSelectedSubject(s.name)}
                className={`w-full text-left p-2.5 rounded border transition-all text-[11px] relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold shadow" 
                    : "bg-white/2 border-white/5 text-slate-400 hover:bg-white/5"
                }`}
              >
                {customSyllabus[s.name] && (
                  <span className="absolute top-0 right-0 py-0.5 px-1 bg-[#00F0FF]/15 text-[#00F0FF] text-[6.5px] font-black tracking-widest uppercase rounded-bl border-l border-b border-[#00F0FF]/10">
                    CUSTOM
                  </span>
                )}
                <div className="flex justify-between items-center w-full pr-1 font-mono uppercase tracking-wide">
                  <span className="truncate max-w-[120px]">{s.name}</span>
                  <span className={`${isSelected ? "text-[#00FF66]" : "text-slate-500"} font-bold text-[10px]`}>
                    {topicProgress}%
                  </span>
                </div>
                
                {/* Single Progress bar line */}
                <div className="w-full bg-white/5 h-1.5 rounded mt-2 overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-500 ${isSelected ? "bg-amber-400" : "bg-slate-700"}`} 
                    style={{ width: `${topicProgress}%` }} 
                    title={`Syllabus Progress: ${topicProgress}%`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right side area: SYLLABUS CHECKLIST */}
        <div className="md:col-span-3">
          <div className="space-y-3">
            {currentSyllabus.map((group, maxIdx) => {
              const isExpanded = expandedGroupName === group.name;
              const subCompletedList = group.topics.filter(t => completedList.has(t));
              
              return (
                <div key={maxIdx} className="bg-[#0A0A0F] border border-white/5 rounded-lg overflow-hidden">
                  
                  {/* Accordion Header bar */}
                  <div 
                    className="w-full text-left p-3.5 bg-[#111118]/70 flex items-center justify-between hover:bg-[#11111d] transition-all text-xs border-b border-white/3 cursor-pointer"
                    onClick={() => setExpandedGroupName(isExpanded ? "" : group.name)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-amber-400 tracking-wider text-[11.5px] uppercase">
                        STUDY GROUP // {group.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({subCompletedList.length}/{group.topics.length} Done)
                      </span>
                    </div>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      {/* Delete group action */}
                      <button
                        onClick={() => handleDeleteGroup(group.name)}
                        className="p-1 px-1.5 border border-[#FF0055]/20 hover:bg-[#FF0055]/15 text-[#FF0055] rounded hover:border-[#FF0055]/40 transition-colors cursor-pointer mr-2"
                        title="Delete entire group and topics"
                      >
                        <Trash2 size={11} />
                      </button>
                      <button 
                        onClick={() => setExpandedGroupName(isExpanded ? "" : group.name)}
                        className="text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsed elements */}
                  {isExpanded && (
                    <div className="p-3.5 space-y-2.5 max-h-[250px] overflow-y-auto divide-y divide-white/2">
                      {group.topics.map((topic, ti) => {
                        const done = completedList.has(topic);
                        return (
                          <div key={ti} className="pt-2 flex items-center justify-between text-[11px] font-mono group">
                            <button
                              disabled={loadingToggle}
                              onClick={() => onToggleTopic(activeSubject, topic, !done, phaseId)}
                              className="flex-1 text-left flex items-center gap-2.5 cursor-pointer"
                            >
                              {done ? (
                                <CheckSquare size={13} className="text-[#00FF66] shrink-0" />
                              ) : (
                                <Square size={13} className="text-slate-500 group-hover:text-slate-300 shrink-0" />
                              )}
                              <span className={done ? "line-through text-slate-500 font-medium" : "text-slate-200"}>
                                {topic}
                              </span>
                            </button>

                            <button
                              onClick={() => handleDeleteTopic(group.name, ti)}
                              className="p-1 text-slate-600 hover:text-[#FF0055] transition-colors cursor-pointer"
                              title="Remove topic node"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        );
                      })}

                      {group.topics.length === 0 && (
                        <div className="text-center py-6 text-slate-650 text-[10px] italic">
                          No custom units nested. Use the top category form to file topic records.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {currentSyllabus.length === 0 && (
              <div className="text-center py-10 bg-[#0A0A0F] border border-white/5 rounded-lg text-slate-500 font-mono">
                All chronological syllabus paths empty. File some custom categories using the input panel.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
