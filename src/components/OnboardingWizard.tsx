import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, ShieldAlert, BookOpen, Layers, 
  Calendar, ArrowRight, ArrowLeft, Plus, X, 
  PlusCircle, Trash2, Check, HelpCircle, Flame, Star, Upload, FileText
} from "lucide-react";
import { OnboardingConfig, SubjectConfig, ComponentConfig, SubjectId } from "../types";

export const DEFAULT_PREMIUM_SYLLABUS: Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }> = {
  "Chemistry": {
    groupA: {
      name: "Physical Chemistry",
      topics: [
        "Atoms, molecules, and stoichiometry",
        "Atomic structure",
        "Chemical bonding",
        "States of matter",
        "Chemical energetics",
        "Electrochemistry",
        "Equilibria",
        "Reaction kinetics"
      ]
    },
    groupB: {
      name: "Inorganic & Organic Chemistry",
      topics: [
        "Periodic table trends",
        "Group 2 elements",
        "Group 17 (halogens)",
        "Nitrogen and sulfur",
        "Intro to organic chemistry",
        "Hydrocarbons (alkanes + alkenes)",
        "Halogenoalkanes",
        "Alcohols",
        "Organic reaction mechanisms"
      ]
    }
  },
  "Math": {
    groupA: {
      name: "Pure Mathematics 1 (P1)",
      topics: [
        "Quadratics",
        "Functions",
        "Coordinate geometry",
        "Circular measure",
        "Trigonometry",
        "Series",
        "Differentiation",
        "Integration"
      ]
    },
    groupB: {
      name: "Statistics 1 & Mechanics 1",
      topics: [
        "Representation of data",
        "Permutations & combinations",
        "Probability",
        "Discrete random variables",
        "Normal distribution",
        "Forces and equilibrium",
        "Kinematics (motion)",
        "Momentum",
        "Newton’s laws",
        "Energy, work, power"
      ]
    }
  },
  "Physics": {
    groupA: {
      name: "General Physics & Mechanics",
      topics: [
        "Physical quantities and units",
        "Measurement techniques",
        "Kinematics",
        "Dynamics",
        "Forces and equilibrium",
        "Work, energy, power",
        "Momentum"
      ]
    },
    groupB: {
      name: "Waves, Electricity & Modern Physics",
      topics: [
        "Waves",
        "Superposition",
        "Electric fields",
        "Current electricity",
        "Particle physics"
      ]
    }
  },
  "Computer Science": {
    groupA: {
      name: "Theory Fundamentals, Software & Logic",
      topics: [
        "Information representation",
        "Communication and internet technologies",
        "Hardware",
        "Processor fundamentals",
        "System software",
        "Security",
        "Ethics and legal issues"
      ]
    },
    groupB: {
      name: "Programming & Problem Solving",
      topics: [
        "Algorithm design",
        "Pseudocode",
        "Data structures",
        "Programming concepts"
      ]
    }
  },
  "English": {
    groupA: {
      name: "Core Skills & Comprehension Skills",
      topics: [
        "Essay structure (intro, body, conclusion)",
        "Argument building",
        "Critical thinking",
        "Evaluating arguments",
        "Developing examples",
        "Reading for meaning",
        "Inference",
        "Language analysis",
        "Summarising",
        "Persuasive writing"
      ]
    },
    groupB: {
      name: "Topical Content Bank & Practice Units",
      topics: [
        "Government & political systems",
        "Human rights",
        "Justice & law",
        "Education",
        "Globalisation",
        "Medical ethics",
        "Environment",
        "Technology impact",
        "AI & privacy",
        "Media influence",
        "Censorship",
        "Literature & arts",
        "Communication",
        "Essay writing practice",
        "Timed essays",
        "Comprehension practice",
        "Vocabulary building"
      ]
    }
  }
};

export const PREMIUM_SUBJECT_PRESETS: SubjectConfig[] = [
  {
    name: "Chemistry",
    components: [
      { name: "Paper 1 (MCQ)", maxMarks: 40 },
      { name: "Paper 2 (AS Structured)", maxMarks: 60 },
      { name: "Paper 3 (Practical)", maxMarks: 40 }
    ],
    totalMark: 140,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1 (MCQ)", "Paper 2 (AS Structured)", "Paper 3 (Practical)"],
    completedTopics: []
  },
  {
    name: "Physics",
    components: [
      { name: "Paper 1 (MCQ)", maxMarks: 40 },
      { name: "Paper 2 (AS Structured)", maxMarks: 60 },
      { name: "Paper 3 (Practical)", maxMarks: 40 }
    ],
    totalMark: 140,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1 (MCQ)", "Paper 2 (AS Structured)", "Paper 3 (Practical)"],
    completedTopics: []
  },
  {
    name: "Computer Science",
    components: [
      { name: "Paper 1 (Theory Fundamentals)", maxMarks: 75 },
      { name: "Paper 2 (Programming & Logic)", maxMarks: 75 }
    ],
    totalMark: 150,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1 (Theory Fundamentals)", "Paper 2 (Programming & Logic)"],
    completedTopics: []
  },
  {
    name: "Math",
    components: [
      { name: "Paper 1 (Pure Mathematics 1)", maxMarks: 75 },
      { name: "Paper 5 (Probability & Statistics 1)", maxMarks: 50 },
      { name: "Paper 4 (Mechanics 1)", maxMarks: 50 }
    ],
    totalMark: 175,
    totalPaperTarget: 35,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1 (Pure Mathematics 1)", "Paper 5 (Probability & Statistics 1)", "Paper 4 (Mechanics 1)"],
    completedTopics: []
  },
  {
    name: "English",
    components: [
      { name: "Paper 1 (Essay)", maxMarks: 50 },
      { name: "Paper 2 (Comprehension)", maxMarks: 50 }
    ],
    totalMark: 100,
    totalPaperTarget: 20,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1 (Essay)", "Paper 2 (Comprehension)"],
    completedTopics: []
  }
];

export function parseMarkdownSyllabus(text: string): Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }> {
  const lines = text.split("\n");
  const syllabus: Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }> = {};
  
  let currentSubject = "";
  let currentGroupAName = "Theoretical Foundations";
  let currentGroupBName = "Practical Applications";
  let parsedTopics: string[] = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Check subject header e.g. "## Chemistry" or "## 9701 CHEMISTRY"
    if (line.startsWith("##")) {
      // Save previous
      if (currentSubject && parsedTopics.length > 0) {
        const half = Math.ceil(parsedTopics.length / 2);
        syllabus[currentSubject] = {
          groupA: { name: currentGroupAName, topics: parsedTopics.slice(0, half) },
          groupB: { name: currentGroupBName, topics: parsedTopics.slice(half) }
        };
      }
      
      const cleanSub = line.replace(/##/g, "").replace(/🧠|⚡|🧪|💻|📐|🔴|🟢|🔵|🟣/g, "").replace(/\(.*?\)/g, "").trim();
      currentSubject = cleanSub || "Custom Subject";
      parsedTopics = [];
      currentGroupAName = "Core Theoretical Units";
      currentGroupBName = "Applied & Practice Units";
    } else if (line.startsWith("###")) {
      const sectionName = line.replace(/###/g, "").replace(/🟢|🔵|🟣|🔴/g, "").trim();
      if (!parsedTopics.length) {
        currentGroupAName = sectionName;
      } else {
        currentGroupBName = sectionName;
      }
    } else if (line.startsWith("-") || line.startsWith("*")) {
      const topic = line.replace(/^[-*]\s*/, "").replace(/\*\*/g, "").trim();
      if (topic) {
        parsedTopics.push(topic);
      }
    }
  }
  
  if (currentSubject && parsedTopics.length > 0) {
    const half = Math.ceil(parsedTopics.length / 2);
    syllabus[currentSubject] = {
      groupA: { name: currentGroupAName, topics: parsedTopics.slice(0, half) },
      groupB: { name: currentGroupBName, topics: parsedTopics.slice(half) }
    };
  }
  
  return syllabus;
}

interface OnboardingWizardProps {
  onComplete: (config: OnboardingConfig) => Promise<void>;
  username: string;
}

export default function OnboardingWizard({ onComplete, username }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [board, setBoard] = useState<"CBSE" | "CIE">("CIE");
  const [subVariant, setSubVariant] = useState<any>("AS LEVEL");
  const [customSyllabus, setCustomSyllabus] = useState<Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }>>(DEFAULT_PREMIUM_SYLLABUS);
  const [rawSyllabusInput, setRawSyllabusInput] = useState("");
  const [showSyllabusImporter, setShowSyllabusImporter] = useState(false);

  // Subject Configurations Array initiated with premium preset values instead of empty/minimal ones!
  const [subjects, setSubjects] = useState<SubjectConfig[]>(PREMIUM_SUBJECT_PRESETS);

  // Timelines
  const [schoolStartDate, setSchoolStartDate] = useState("2026-06-01");
  const [revisionStartDate, setRevisionStartDate] = useState("2026-10-01");
  const [boardExamDate, setBoardExamDate] = useState("2026-11-20");

  // New subject state
  const [customSubName, setCustomSubName] = useState("");

  // Handler to add subject
  const handleAddSubject = () => {
    const finalName = customSubName.trim();
    if (!finalName) {
      alert("Please enter a subject name.");
      return;
    }
    if (subjects.some(s => s.name.toLowerCase() === finalName.toLowerCase())) {
      alert(`The subject "${finalName}" has already been added.`);
      return;
    }

    const newSub: SubjectConfig = {
      name: finalName,
      components: [
        { name: "Paper 1", maxMarks: 40 }
      ],
      totalMark: 40,
      totalPaperTarget: 30,
      yearRangeStart: 2022,
      yearRangeEnd: 2026,
      series: ["May/June", "Oct/Nov"],
      chronologicalRule: [2025, 2026],
      componentSequence: ["Paper 1"],
      completedTopics: []
    };

    setSubjects([...subjects, newSub]);
    setCustomSubName("");
  };

  // Remove subject by index
  const handleRemoveSubjectByIndex = (index: number) => {
    setSubjects(subjects.filter((_, idx) => idx !== index));
  };

  // Update specific subject parameter by index
  const handleUpdateSubjectByIndex = (index: number, fields: Partial<SubjectConfig>) => {
    setSubjects(subjects.map((s, idx) => {
      if (idx === index) {
        const updated = { ...s, ...fields };
        if (fields.components) {
          updated.totalMark = fields.components.reduce((acc, c) => acc + c.maxMarks, 0);
          updated.componentSequence = fields.components.map(c => c.name);
        }
        return updated;
      }
      return s;
    }));
  };

  // Onboarding Finish handler
  const handleFinish = async () => {
    const config: OnboardingConfig = {
      board,
      subVariant: subVariant || "AS/A LEVELS",
      subjects,
      schoolStartDate,
      revisionStartDate,
      boardExamDate,
      customSyllabus
    };
    await onComplete(config);
  };

  // Pre-calculate Phase Windows Preview on Front-end
  const computePhasesPreview = () => {
    try {
      const today = new Date("2026-05-20T05:49:41Z");
      const d1 = new Date(schoolStartDate + "T00:00:00Z");
      const d2 = new Date(revisionStartDate + "T00:00:00Z");
      const d3 = new Date(boardExamDate + "T00:00:00Z");

      const d2Minus30 = new Date(d2.getTime() - 30 * 24 * 60 * 60 * 1000);
      const d3Minus20 = new Date(d3.getTime() - 20 * 24 * 60 * 60 * 1000);

      const format = (d: Date) => d.toISOString().split("T")[0];

      return {
        ph1: `Today (${format(today)}) ➔ School Startup (${format(d1)})`,
        ph2: `${format(d1)} ➔ Active recall interval (${format(d2Minus30)})`,
        ph3: `${format(d2Minus30)} ➔ Countdowns baseline (${format(d3Minus20)})`,
        ph4: `${format(d3Minus20)} ➔ Board mock finish (${format(d3)})`
      };
    } catch (e) {
      return { ph1: "Calculating...", ph2: "Calculating...", ph3: "Calculating...", ph4: "Calculating..." };
    }
  };

  const preview = computePhasesPreview();

  return (
    <div className="min-h-screen bg-[#06060A] text-slate-200 py-12 px-4 flex items-center justify-center relative bg-cyber-grid">
      {/* Laser Top Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent" />
      
      <div className="max-w-4xl w-full bg-[#0E0E16]/80 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-md relative shadow-2xl overflow-hidden font-mono text-sm">
        
        {/* Terminal Header Info Frame */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFEA00] animate-pulse" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              PROTOCOL CALIBRATOR // USER: {username.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-[#00F0FF] font-bold">STEP {step} OF 3</span>
        </div>

        {/* Progress horizontal steps indicator */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className={`h-1 rounded transition-all ${step >= 1 ? "bg-[#00F0FF]" : "bg-white/10"}`} />
          <div className={`h-1 rounded transition-all ${step >= 2 ? "bg-[#9D00FF]" : "bg-white/10"}`} />
          <div className={`h-1 rounded transition-all ${step >= 3 ? "bg-[#00FF66]" : "bg-white/10"}`} />
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: Academic Board Routing */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="text-[#00F0FF]" size={18} />
                  ACADEMIC BOARD ROUTING SYSTEM
                </h2>
                <p className="text-xs text-slate-400 mt-1 uppercase">
                  Select your active board and cohort variant configuration to configure core rotation matrices.
                </p>
              </div>

              {/* Selector blocks */}
              <div className="max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setBoard("CIE");
                    setSubVariant("AS LEVEL");
                  }}
                  className={`w-full border p-6 rounded-md text-left transition-all relative ${
                    board === "CIE" 
                      ? "bg-[#00F0FF]/10 border-[#00F0FF] text-slate-100 shadow-[0_0_15px_rgba(0,240,255,0.15)]" 
                      : "bg-white/2 border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  <div className="absolute top-2 right-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 rounded-full p-0.5">
                    <Check size={12} />
                  </div>
                  <span className="text-xs uppercase font-extrabold block text-slate-500 mb-1">Variant Bracket A</span>
                  <div className="text-md font-bold uppercase tracking-widest text-[#00F0FF]">CIE Board (Pre-configured)</div>
                  <span className="text-xs text-slate-400 block mt-2 leading-relaxed">
                    Cambridge Assessment International Education (IGCSE, Advanced AS/A levels).
                  </span>
                </button>
              </div>

              {/* Subvariant sub selectors */}
              {board === "CIE" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 bg-[#12121A]/40 p-4 border border-white/5 rounded">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Available CIE Variant Levels:</span>
                  <div className="flex flex-wrap gap-2">
                    {["IGCSE", "AS LEVEL", "A LEVEL"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSubVariant(v)}
                        className={`px-3 py-1.5 rounded text-xs transition-all uppercase border ${
                          subVariant === v 
                            ? "bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] font-black" 
                            : "bg-white/2 border-white/5 text-slate-400 hover:bg-white/5"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Subject, Components Architecture & Saber-metrics */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="text-[#9D00FF]" size={18} />
                  SUBJECT BREAKDOWN & SABER-METRICS MATRIX
                </h2>
                <p className="text-xs text-slate-400 mt-1 uppercase">
                  Add target subjects, define exam papers/components, specify grading parameters, and schedule past-paper rules.
                </p>
              </div>

              {/* Subject Editor Area */}
              <div className="space-y-4">
                
                {/* PREFILL AND PASTE SYLLABUS SECTION */}
                <div className="bg-[#12121A]/80 border border-purple-500/20 p-5 rounded-xl shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <Flame className="text-amber-400 fill-amber-400" size={14} /> 
                        PRE-LOAD CIE AS-LEVEL COURSE & STUDY UNITS PRESET
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        Instantly populates all 5 core subjects (Chemistry, Physics, Computer Science, Math, English) mapped exactly with Cambridge AS-Level code components and grouped chapters.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSubjects(PREMIUM_SUBJECT_PRESETS);
                          setCustomSyllabus(DEFAULT_PREMIUM_SYLLABUS);
                          alert("Premium CIE AS-Level Study Units and components successfully initialized! Proceed below to customize paper weights or add targets.");
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 border border-purple-400/40 text-[10.5px] font-black uppercase rounded-lg flex items-center gap-1.5 transition-all text-white"
                      >
                        <Star size={12} className="fill-amber-300 stroke-amber-300" /> Apply Full AS-Level Preset
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowSyllabusImporter(!showSyllabusImporter);
                        }}
                        className={`px-3 py-1.5 text-[10.5px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-all border ${
                          showSyllabusImporter 
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Upload size={12} /> {showSyllabusImporter ? "Hide Paste Console" : "Upload/Paste Syllabus"}
                      </button>
                    </div>
                  </div>

                  {showSyllabusImporter && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-white/5 pt-4 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1">
                          Custom Syllabus Markdown Pastebox:
                        </span>
                        <p className="text-[10.5px] text-slate-400 leading-normal mb-2 font-mono">
                          Format: Start subjects with <code className="text-[#00F0FF]">## Subject Name</code>, split groups or sections with <code className="text-[#9D00FF]">### Section Name</code>, and write topics starting with <code className="text-[#00FF66]">- Topic Bullet</code>.
                        </p>
                      </div>

                      <textarea
                        value={rawSyllabusInput}
                        onChange={(e) => setRawSyllabusInput(e.target.value)}
                        placeholder={`## Biology (AS Level)
### Core Biomolecules
- Cell structure and imaging
- Carbohydrates and lipids
- Protein structure and dynamics
- Water and membrane bounds

### Practical Applications & Labs
- Enzyme activity kinetics
- Mitosis and chromosome count
- DNA and protein synthesis`}
                        className="w-full h-44 bg-[#0A0A0F] border border-white/10 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#00F0FF] transition-all leading-relaxed whitespace-pre"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!rawSyllabusInput.trim()) {
                              alert("Please paste some text/markdown first.");
                              return;
                            }
                            const parsed = parseMarkdownSyllabus(rawSyllabusInput);
                            const parsedSubjects = Object.keys(parsed);
                            if (parsedSubjects.length === 0) {
                              alert("Failed to find any subjects or topic bullets. Make sure to use ## For Subject titles and - for list items!");
                              return;
                            }

                            // Generate new subject items with Paper 1 by default
                            const newSubjectsToAdd = parsedSubjects.map(subName => {
                              const existing = subjects.find(s => s.name.toLowerCase() === subName.toLowerCase());
                              if (existing) return null;
                              return {
                                name: subName,
                                components: [{ name: "Paper 1", maxMarks: 50 }, { name: "Paper 2", maxMarks: 50 }],
                                totalMark: 100,
                                totalPaperTarget: 30,
                                yearRangeStart: 2022,
                                yearRangeEnd: 2026,
                                series: ["May/June", "Oct/Nov"],
                                chronologicalRule: [2025, 2026],
                                componentSequence: ["Paper 1", "Paper 2"],
                                completedTopics: []
                              };
                            }).filter(Boolean) as SubjectConfig[];

                            setSubjects([...subjects, ...newSubjectsToAdd]);
                            setCustomSyllabus(prev => ({ ...prev, ...parsed }));
                            alert(`Parsed ${parsedSubjects.length} custom syllabus course successfully! Added subjects: ${parsedSubjects.join(", ")}`);
                          }}
                          className="px-4 py-2 bg-[#00F0FF]/25 border border-[#00F0FF] hover:bg-[#00F0FF]/35 text-[#00F0FF] text-[10.5px] font-black uppercase rounded-lg transition-all"
                        >
                          Parse & Merge Syllabus
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Subject Adder Console (Type Name Directly!) */}
                <div className="bg-[#0A0A0F] border border-white/10 p-4 rounded-xl flex flex-col md:flex-row items-end gap-3 justify-between shadow-lg">
                  <div className="w-full md:w-2/3">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">Type Subject Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics, Biology, Further Mathematics..."
                      value={customSubName}
                      onChange={(e) => setCustomSubName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubject();
                        }
                      }}
                      className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none focus:border-[#9D00FF] transition-all text-xs font-bold font-mono"
                    />
                  </div>
                  <button
                    onClick={handleAddSubject}
                    className="w-full md:w-auto px-4 py-2.5 bg-[#9D00FF] text-slate-100 hover:bg-[#9D00FF]/80 rounded font-bold uppercase text-xs flex items-center justify-center gap-1.5 transition-all text-[11px] tracking-wider"
                  >
                    <PlusCircle size={15} /> Add Subject Matrix
                  </button>
                </div>

                {/* Sub-panels representing current subjects */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                  {subjects.map((subj, sIdx) => (
                    <div key={sIdx} className="border border-white/15 bg-[#12121A]/40 p-4 rounded-xl relative hover:border-[#9D00FF]/40 transition-all">
                      
                      {/* Close button */}
                      <button 
                        onClick={() => handleRemoveSubjectByIndex(sIdx)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-[#FF0055] p-1 rounded-full bg-white/5 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="border-b border-white/5 pb-2.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 w-full max-w-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#9D00FF] shrink-0" />
                          <input
                            type="text"
                            value={subj.name}
                            onChange={(e) => {
                              const updatedSubjects = [...subjects];
                              updatedSubjects[sIdx] = { ...updatedSubjects[sIdx], name: e.target.value };
                              setSubjects(updatedSubjects);
                            }}
                            className="bg-[#0A0A0F] border border-white/10 font-black text-slate-200 uppercase py-1 px-2.5 rounded focus:outline-none focus:border-[#9D00FF] text-xs font-mono w-full"
                            title="Edit Subject Name"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5 block font-mono">
                          Total Subject Weight: {subj.totalMark} marks
                        </span>
                      </div>

                      {/* Component papers breakdown - ALL ARE INDIVIDUAL INPUTS AND MANUALLY ADDABLE */}
                      <div className="space-y-4 font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-2 uppercase font-extrabold tracking-wider">
                            Component Papers Configuration (All items are editable inputs):
                          </span>
                          
                          <div className="space-y-2 max-w-2xl">
                            {subj.components.map((comp, cIdx) => (
                              <div key={cIdx} className="bg-[#0A0A0F]/60 border border-white/5 p-2 rounded text-xs flex flex-col sm:flex-row items-center gap-2 justify-between">
                                <div className="flex gap-2 items-center w-full sm:w-auto">
                                  <span className="text-[9px] text-slate-500 uppercase font-black shrink-0">Paper #{cIdx + 1}</span>
                                  <input
                                    type="text"
                                    value={comp.name}
                                    placeholder="e.g. Component 12"
                                    onChange={(e) => {
                                      const updatedComps = subj.components.map((c, i) => 
                                        i === cIdx ? { ...c, name: e.target.value } : c
                                      );
                                      handleUpdateSubjectByIndex(sIdx, { components: updatedComps });
                                    }}
                                    className="w-full sm:w-48 bg-[#12121A] border border-white/10 text-slate-200 px-2 py-1 rounded focus:outline-none focus:border-[#9D00FF] text-xs font-bold"
                                  />
                                </div>

                                <div className="flex gap-2 items-center shrink-0 ml-auto w-full sm:w-auto justify-end">
                                  <span className="text-[9px] text-slate-500 uppercase font-black">Max Marks</span>
                                  <input
                                    type="number"
                                    value={comp.maxMarks}
                                    onChange={(e) => {
                                      const updatedComps = subj.components.map((c, i) => 
                                        i === cIdx ? { ...c, maxMarks: Number(e.target.value) } : c
                                      );
                                      handleUpdateSubjectByIndex(sIdx, { components: updatedComps });
                                    }}
                                    className="w-16 bg-[#12121A] border border-white/10 text-right pr-2 py-1 rounded focus:outline-none text-xs"
                                  />

                                  <button
                                    onClick={() => {
                                      if (subj.components.length <= 1) {
                                        alert("A subject must possess at least one component paper.");
                                        return;
                                      }
                                      const updatedComps = subj.components.filter((_, i) => i !== cIdx);
                                      handleUpdateSubjectByIndex(sIdx, { components: updatedComps });
                                    }}
                                    className="p-1 text-slate-550 hover:text-[#FF0055] transition-all rounded ml-1"
                                    title="Remove Paper"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Dynamic Manual Component/Paper Adder Row */}
                          <div className="bg-[#12121A]/30 border border-dashed border-white/10 p-3 rounded-lg flex flex-col sm:flex-row items-end sm:items-center gap-2 justify-between mt-3 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                              <span className="text-[9.5px] text-[#00F0FF] uppercase font-black shrink-0">[+] Add New Paper:</span>
                              <input
                                type="text"
                                placeholder="Paper Name (e.g. Paper 3)"
                                id={`newCompName-${sIdx}`}
                                className="bg-[#0A0A0F] border border-white/15 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-[#00F0FF] w-full sm:w-40 font-semibold"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const inputEl = document.getElementById(`newCompName-${sIdx}`) as HTMLInputElement;
                                    const marksEl = document.getElementById(`newCompMarks-${sIdx}`) as HTMLInputElement;
                                    if (inputEl && inputEl.value.trim()) {
                                      const name = inputEl.value.trim();
                                      const marks = Number(marksEl?.value || 40);
                                      const updated = [...subj.components, { name, maxMarks: marks }];
                                      handleUpdateSubjectByIndex(sIdx, { components: updated });
                                      inputEl.value = "";
                                    }
                                  }
                                }}
                              />
                              <input
                                type="number"
                                placeholder="Marks"
                                id={`newCompMarks-${sIdx}`}
                                defaultValue={45}
                                className="bg-[#0A0A0F] border border-white/15 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-[#00F0FF] w-16 text-right"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const inputEl = document.getElementById(`newCompName-${sIdx}`) as HTMLInputElement;
                                const marksEl = document.getElementById(`newCompMarks-${sIdx}`) as HTMLInputElement;
                                if (inputEl && inputEl.value.trim()) {
                                  const name = inputEl.value.trim();
                                  const marks = Number(marksEl?.value || 40);
                                  const updated = [...subj.components, { name, maxMarks: marks }];
                                  handleUpdateSubjectByIndex(sIdx, { components: updated });
                                  inputEl.value = "";
                                } else {
                                  alert("Please enter a paper name.");
                                }
                              }}
                              className="px-3 py-1 bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/25 text-[10px] font-extrabold uppercase rounded transition-all shrink-0 w-full sm:w-auto"
                            >
                              + Add Paper
                            </button>
                          </div>
                        </div>

                        {/* Saber-metrics Past Paper tracker inputs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <div>
                            <label className="text-[9px] text-slate-400 uppercase block mb-1 font-bold">Practice Target</label>
                            <input
                              type="number"
                              value={subj.totalPaperTarget}
                              onChange={(e) => handleUpdateSubjectByIndex(sIdx, { totalPaperTarget: Number(e.target.value) })}
                              className="w-full bg-[#0A0A0F] border border-white/10 rounded p-1.5 focus:outline-none focus:border-[#9D00FF] text-center text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] text-slate-400 uppercase block mb-1 font-bold">Horizon Start</label>
                            <input
                              type="number"
                              value={subj.yearRangeStart}
                              onChange={(e) => handleUpdateSubjectByIndex(sIdx, { yearRangeStart: Number(e.target.value) })}
                              className="w-full bg-[#0A0A0F] border border-white/10 rounded p-1.5 focus:outline-none focus:border-[#9D00FF] text-center text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] text-slate-400 uppercase block mb-1 font-bold">Range End</label>
                            <input
                              type="number"
                              value={subj.yearRangeEnd}
                              onChange={(e) => handleUpdateSubjectByIndex(sIdx, { yearRangeEnd: Number(e.target.value) })}
                              className="w-full bg-[#0A0A0F] border border-white/10 rounded p-1.5 focus:outline-none focus:border-[#9D00FF] text-center text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] text-slate-400 uppercase block mb-1 font-bold">Chronological Rule</label>
                            <input
                              type="text"
                              value={subj.chronologicalRule.join(", ")}
                              placeholder="e.g. 2025, 2023, 2026"
                              onChange={(e) => {
                                const years = e.target.value.split(",").map(y => parseInt(y.trim())).filter(y => !isNaN(y));
                                handleUpdateSubjectByIndex(sIdx, { chronologicalRule: years });
                              }}
                              className="w-full bg-[#0A0A0F] border border-white/10 rounded p-1.5 focus:outline-none focus:border-[#9D00FF] text-center text-xs"
                            />
                          </div>
                        </div>

                        {/* Components Order sequence list */}
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block mb-1 font-bold">Component sequencing path:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {subj.componentSequence.map((comp, idx) => (
                              <div key={idx} className="bg-slate-900 border border-[#9D00FF]/30 px-2 py-1 rounded text-[10px] text-slate-300">
                                {idx + 1}. {comp}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                  
                  {subjects.length === 0 && (
                    <div className="text-center p-8 text-slate-500 border border-dashed border-white/10 rounded-lg uppercase text-xs">
                      No subjects configured. Type a subject name above to generate layout matrix.
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          )}

          {/* STEP 3: Timeline Diagnostics & Calculated Phase Engine */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="text-[#00FF66]" size={18} />
                  TIMELINE DIAGNOSTICS & CORES CALCULATION
                </h2>
                <p className="text-xs text-slate-400 mt-1 uppercase">
                  Log your target dates. The state engine computes structural revision windows dynamically of the 2026 calendar.
                </p>
              </div>

              {/* Date selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0A0A0F]/60 p-4 border border-white/5 rounded-md">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">[D1] School Start Date</label>
                  <input
                    type="date"
                    value={schoolStartDate}
                    onChange={(e) => setSchoolStartDate(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 rounded p-2 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">[D2] Revision/Mock Commencement</label>
                  <input
                    type="date"
                    value={revisionStartDate}
                    onChange={(e) => setRevisionStartDate(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 rounded p-2 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">[D3] Board Exam Start Date</label>
                  <input
                    type="date"
                    value={boardExamDate}
                    onChange={(e) => setBoardExamDate(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 rounded p-2 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>

              {/* Phases Calculations Timeline Display */}
              <div className="space-y-3">
                <span className="text-[11px] text-slate-450 uppercase block font-bold text-slate-500">DYNAMIC WINDOW ENGINE PREVIEW:</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Phase 1 */}
                  <div className="border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-3 rounded hover:bg-[#00F0FF]/10 transition-all">
                    <span className="text-[#00F0FF] font-extrabold block text-xs uppercase tracking-wider mb-1">
                      Phase 1: Foundation
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {preview.ph1}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 block leading-normal">
                      Focus: Base concepts, text indexing and terminology drilling blocks.
                    </span>
                  </div>

                  {/* Phase 2 */}
                  <div className="border border-[#9D00FF]/30 bg-[#9D00FF]/5 p-3 rounded hover:bg-[#9D00FF]/10 transition-all">
                    <span className="text-[#9D00FF] font-extrabold block text-xs uppercase tracking-wider mb-1">
                      Phase 2: Active Recall
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {preview.ph2}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 block leading-normal">
                      Focus: Active recall flashcard sweeps & alternating structured scheduling.
                    </span>
                  </div>

                  {/* Phase 3 */}
                  <div className="border border-[#FF0055]/30 bg-[#FF0055]/5 p-3 rounded hover:bg-[#FF0055]/10 transition-all">
                    <span className="text-[#FF0055] font-extrabold block text-xs uppercase tracking-wider mb-1">
                      Phase 3: Past Paper Marathon
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {preview.ph3}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 block leading-normal">
                      Focus: Granular Saber-metrics papers, non-linear tracks, time-attacks.
                    </span>
                  </div>

                  {/* Pre-Exam Sprint */}
                  <div className="border border-[#00FF66]/30 bg-[#00FF66]/5 p-3 rounded relative overflow-hidden">
                    <div className="absolute top-1 right-1 bg-[#00FF66]/20 border border-[#00FF66]/40 text-[8px] text-[#00FF66] px-1 rounded font-black">
                      LOCK-IN
                    </div>
                    <span className="text-[#00FF66] font-extrabold block text-xs uppercase tracking-wider mb-1">
                      Pre-Exam Protocol Windows
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {preview.ph4}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 block leading-normal">
                      System Constraint: Total past papers remaining must hit 100% completion before sprint triggers.
                    </span>
                  </div>

                </div>
              </div>

              {/* Status Alert Badge */}
              <div className="p-3 border border-amber-500/30 bg-amber-500/5 text-xs text-amber-400 font-mono rounded flex items-center gap-3">
                <ShieldAlert className="animate-pulse shrink-0" size={16} />
                <span>
                  <strong>PRE-FLIGHT SYSTEM VERIFICATION:</strong> Onboarding configurations will align database schemas. Verification cycles are fully live and online.
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Buttons Nav Bar */}
        <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-6 z-10 relative">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : null}
            disabled={step === 1}
            className={`px-4 py-2 bg-white/5 border border-white/15 rounded text-xs uppercase uppercase tracking-wider flex items-center gap-1.5 transition-all text-slate-400 hover:text-white ${
              step === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
            }`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#00F0FF]/30 transition-all"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-[#00FF66] border border-[#00FF66] text-white rounded text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all animate-pulse"
            >
              <Check size={14} /> INITIALIZE PROTOCOLS
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
