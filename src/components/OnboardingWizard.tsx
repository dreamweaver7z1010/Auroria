import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, ShieldAlert, BookOpen, Layers, 
  Calendar, ArrowRight, ArrowLeft, Plus, X, 
  PlusCircle, Trash2, Check, HelpCircle, Flame, Star, Upload, FileText
} from "lucide-react";
import { OnboardingConfig, SubjectConfig, ComponentConfig, SubjectId } from "../types";

export const AS_SUBJECT_PRESETS: SubjectConfig[] = [
  {
    name: "Physics (9702)",
    components: [
      { name: "Paper 1: Multiple Choice", maxMarks: 40 },
      { name: "Paper 2: AS Level Structured Questions", maxMarks: 60 },
      { name: "Paper 3: Advanced Practical Skills", maxMarks: 40 }
    ],
    totalMark: 140,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Multiple Choice", "Paper 2: AS Level Structured Questions", "Paper 3: Advanced Practical Skills"],
    completedTopics: []
  },
  {
    name: "Mathematics (9709)",
    components: [
      { name: "Paper 1: Pure Mathematics 1", maxMarks: 75 },
      { name: "Paper 5: Probability & Statistics 1", maxMarks: 50 }
    ],
    totalMark: 125,
    totalPaperTarget: 35,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Pure Mathematics 1", "Paper 5: Probability & Statistics 1"],
    completedTopics: []
  },
  {
    name: "Chemistry (9701)",
    components: [
      { name: "Paper 1: Multiple Choice", maxMarks: 40 },
      { name: "Paper 2: AS Level Structured Questions", maxMarks: 60 },
      { name: "Paper 3: Advanced Practical Skills", maxMarks: 40 }
    ],
    totalMark: 140,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Multiple Choice", "Paper 2: AS Level Structured Questions", "Paper 3: Advanced Practical Skills"],
    completedTopics: []
  },
  {
    name: "Biology (9700)",
    components: [
      { name: "Paper 1: Multiple Choice", maxMarks: 40 },
      { name: "Paper 2: AS Level Structured Questions", maxMarks: 60 },
      { name: "Paper 3: Advanced Practical Skills", maxMarks: 40 }
    ],
    totalMark: 140,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Multiple Choice", "Paper 2: AS Level Structured Questions", "Paper 3: Advanced Practical Skills"],
    completedTopics: []
  },
  {
    name: "Computer Science (9618)",
    components: [
      { name: "Paper 1: Theory Fundamentals", maxMarks: 75 },
      { name: "Paper 2: Fundamental Problem-solving and Programming Skills", maxMarks: 75 }
    ],
    totalMark: 150,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Theory Fundamentals", "Paper 2: Fundamental Problem-solving and Programming Skills"],
    completedTopics: []
  },
  {
    name: "English General Paper (8021)",
    components: [
      { name: "Paper 1: Essay", maxMarks: 50 },
      { name: "Paper 2: Comprehension", maxMarks: 50 }
    ],
    totalMark: 100,
    totalPaperTarget: 20,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Essay", "Paper 2: Comprehension"],
    completedTopics: []
  },
  {
    name: "Accounting (9706)",
    components: [
      { name: "Paper 1: Fundamentals of Accounting (Multiple Choice)", maxMarks: 30 },
      { name: "Paper 2: Fundamentals of Accounting (Structured Questions)", maxMarks: 90 }
    ],
    totalMark: 120,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Fundamentals of Accounting (Multiple Choice)", "Paper 2: Fundamentals of Accounting (Structured Questions)"],
    completedTopics: []
  },
  {
    name: "Economics (9708)",
    components: [
      { name: "Paper 1: AS Level Multiple Choice", maxMarks: 30 },
      { name: "Paper 2: AS Level Data Response and Essays", maxMarks: 60 }
    ],
    totalMark: 90,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: AS Level Multiple Choice", "Paper 2: AS Level Data Response and Essays"],
    completedTopics: []
  },
  {
    name: "Business (9609)",
    components: [
      { name: "Paper 1: Business Concepts 1", maxMarks: 40 },
      { name: "Paper 2: Business Concepts 2", maxMarks: 60 }
    ],
    totalMark: 100,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Business Concepts 1", "Paper 2: Business Concepts 2"],
    completedTopics: []
  },
  {
    name: "Psychology (9990)",
    components: [
      { name: "Paper 1: Approaches, Issues and Debates", maxMarks: 60 },
      { name: "Paper 2: Research Methods", maxMarks: 60 }
    ],
    totalMark: 120,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 1: Approaches, Issues and Debates", "Paper 2: Research Methods"],
    completedTopics: []
  }
];

export const A_SUBJECT_PRESETS: SubjectConfig[] = [
  {
    name: "Physics (9702)",
    components: [
      { name: "Paper 4: A Level Structured Questions", maxMarks: 100 },
      { name: "Paper 5: Planning, Analysis and Evaluation", maxMarks: 30 }
    ],
    totalMark: 130,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 4: A Level Structured Questions", "Paper 5: Planning, Analysis and Evaluation"],
    completedTopics: []
  },
  {
    name: "Mathematics (9709)",
    components: [
      { name: "Paper 3: Pure Mathematics 3", maxMarks: 75 },
      { name: "Paper 6: Probability & Statistics 2", maxMarks: 50 }
    ],
    totalMark: 125,
    totalPaperTarget: 35,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: Pure Mathematics 3", "Paper 6: Probability & Statistics 2"],
    completedTopics: []
  },
  {
    name: "Chemistry (9701)",
    components: [
      { name: "Paper 4: A Level Structured Questions", maxMarks: 100 },
      { name: "Paper 5: Planning, Analysis and Evaluation", maxMarks: 30 }
    ],
    totalMark: 130,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 4: A Level Structured Questions", "Paper 5: Planning, Analysis and Evaluation"],
    completedTopics: []
  },
  {
    name: "Biology (9700)",
    components: [
      { name: "Paper 4: A Level Structured Questions", maxMarks: 100 },
      { name: "Paper 5: Planning, Analysis and Evaluation", maxMarks: 30 }
    ],
    totalMark: 130,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 4: A Level Structured Questions", "Paper 5: Planning, Analysis and Evaluation"],
    completedTopics: []
  },
  {
    name: "Computer Science (9618)",
    components: [
      { name: "Paper 3: Advanced Theory", maxMarks: 75 },
      { name: "Paper 4: Practical (A hands-on, onscreen programming exam)", maxMarks: 75 }
    ],
    totalMark: 150,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: Advanced Theory", "Paper 4: Practical (A hands-on, onscreen programming exam)"],
    completedTopics: []
  },
  {
    name: "English Language (9093)",
    components: [
      { name: "Paper 3: Text Analysis", maxMarks: 50 },
      { name: "Paper 4: Language Topics", maxMarks: 50 }
    ],
    totalMark: 100,
    totalPaperTarget: 20,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: Text Analysis", "Paper 4: Language Topics"],
    completedTopics: []
  },
  {
    name: "Accounting (9706)",
    components: [
      { name: "Paper 3: Financial Accounting", maxMarks: 75 },
      { name: "Paper 4: Cost and Management Accounting", maxMarks: 50 }
    ],
    totalMark: 125,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: Financial Accounting", "Paper 4: Cost and Management Accounting"],
    completedTopics: []
  },
  {
    name: "Economics (9708)",
    components: [
      { name: "Paper 3: A Level Multiple Choice", maxMarks: 30 },
      { name: "Paper 4: A Level Data Response and Essays", maxMarks: 60 }
    ],
    totalMark: 90,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: A Level Multiple Choice", "Paper 4: A Level Data Response and Essays"],
    completedTopics: []
  },
  {
    name: "Business (9609)",
    components: [
      { name: "Paper 3: Business Strategy", maxMarks: 60 },
      { name: "Paper 4: Business Decision-Making", maxMarks: 40 }
    ],
    totalMark: 100,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["Feb/March", "May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: Business Strategy", "Paper 4: Business Decision-Making"],
    completedTopics: []
  },
  {
    name: "Psychology (9990)",
    components: [
      { name: "Paper 3: Specialist Options: Theory", maxMarks: 60 },
      { name: "Paper 4: Specialist Options: Case Studies", maxMarks: 60 }
    ],
    totalMark: 120,
    totalPaperTarget: 30,
    yearRangeStart: 2022,
    yearRangeEnd: 2026,
    series: ["May/June", "Oct/Nov"],
    chronologicalRule: [2025, 2026, 2024],
    componentSequence: ["Paper 3: Specialist Options: Theory", "Paper 4: Specialist Options: Case Studies"],
    completedTopics: []
  }
];

export const AS_SYLLABUS_PRESETS: Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }> = {
  "Physics (9702)": {
    groupA: {
      name: "Physical Quantities & Mechanics",
      topics: ["Physical quantities & units", "Kinematics", "Dynamics", "Forces, density and pressure", "Work, energy, power", "Deformation of solids"]
    },
    groupB: {
      name: "Waves, Electricity & Nuclear",
      topics: ["Waves", "Superposition", "Current electricity", "D.C. circuits", "Particle physics & nuclear structure"]
    }
  },
  "Mathematics (9709)": {
    groupA: {
      name: "Pure Mathematics 1 (P1)",
      topics: ["Quadratics", "Functions", "Coordinate geometry", "Circular measure", "Trigonometry", "Series", "Differentiation", "Integration"]
    },
    groupB: {
      name: "Probability & Statistics 1 (S1)",
      topics: ["Representation of data", "Permutations & combinations", "Probability", "Discrete random variables", "Normal distribution"]
    }
  },
  "Chemistry (9701)": {
    groupA: {
      name: "Physical Chemistry Foundations",
      topics: ["Atoms, molecules & stoichiometry", "Atomic structure", "Chemical bonding", "States of matter", "Chemical energetics", "Electrochemistry", "Equilibria", "Reaction kinetics"]
    },
    groupB: {
      name: "Inorganic & Organic Chemistry",
      topics: ["The Periodic Table", "Group 2", "Group 17", "Nitrogen and sulfur", "Organic chemistry intro", "Hydrocarbons", "Halogenoalkanes", "Alcohols", "Carbonyl compounds", "Carboxylic acids"]
    }
  },
  "Biology (9700)": {
    groupA: {
      name: "Cell Structure & Biochemistry",
      topics: ["Cell structure and design", "Biological molecules", "Enzymes", "Cell membranes and transport", "Mitotic cell cycle", "Nucleic acids & protein synthesis"]
    },
    groupB: {
      name: "Physiology & Pathogens",
      topics: ["Transport in plants", "Transport in mammals", "Gas exchange and smoking", "Infectious diseases", "Immunity mechanisms"]
    }
  },
  "Computer Science (9618)": {
    groupA: {
      name: "Theory Fundamentals",
      topics: ["Information representation", "Communication & web", "Hardware", "Processor fundamentals", "System software", "Security", "Ethics"]
    },
    groupB: {
      name: "Fundamental Problem-solving & Coding",
      topics: ["Algorithm design", "Data structures", "Programming concepts", "Software engineering models"]
    }
  },
  "English General Paper (8021)": {
    groupA: {
      name: "Core Essay Construction",
      topics: ["Deconstructing questions", "Essay structuring", "Developing examples", "Style & persuasive tone"]
    },
    groupB: {
      name: "Comprehension & Analysis",
      topics: ["Analyzing texts", "Interpreting written data", "Linguistic devices", "Summary writing rules"]
    }
  },
  "Accounting (9706)": {
    groupA: {
      name: "Fundamentals of Financial Accounting",
      topics: ["Double-entry systems", "Verification controls", "Sole trader statements", "Partnership accounts"]
    },
    groupB: {
      name: "Fundamentals of Cost Accounting",
      topics: ["Material cost & logistics", "Labor cost strategies", "Absorption costing", "Marginal costing rules"]
    }
  },
  "Economics (9708)": {
    groupA: {
      name: "Microeconomic Fundamentals",
      topics: ["Basic economic ideas", "Demand & supply", "Market equilibrium", "Price elasticity"]
    },
    groupB: {
      name: "Macroeconomic Policy",
      topics: ["Aggregate demand & supply", "Economic integration", "Balance of payments", "Inflation indices"]
    }
  },
  "Business (9609)": {
    groupA: {
      name: "Business Activity & People",
      topics: ["Business and its environment", "People in business", "Marketing paradigms"]
    },
    groupB: {
      name: "Operations & Finance Concepts",
      topics: ["Operations management", "Finance and accounting", "Budgets and cashflows"]
    }
  },
  "Psychology (9990)": {
    groupA: {
      name: "Core Biological & Cognitive Studies",
      topics: ["Biological approach in social settings", "Cognitive memory sweeps", "Learning approach models"]
    },
    groupB: {
      name: "Research Methodology",
      topics: ["Experimental designs", "Self-reports & surveys", "Case study approaches", "Ethics guidelines"]
    }
  }
};

export const A_SYLLABUS_PRESETS: Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }> = {
  "Physics (9702)": {
    groupA: {
      name: "Advanced Mechanics & Thermal",
      topics: ["Circular motion", "Gravitational fields", "Temperature & ideal gas", "Thermodynamics", "Oscillations & frequency"]
    },
    groupB: {
      name: "Electromagnetism, Quantum & Medical",
      topics: ["Electric fields", "Capacitance", "Magnetic fields", "Electromagnetic induction", "Quantum physics", "Nuclear & medical physics"]
    }
  },
  "Mathematics (9709)": {
    groupA: {
      name: "Pure Mathematics 3 (P3)",
      topics: ["Algebraic methods", "Logarithmic curves", "Trigonometry rules", "Calculus integration", "Numerical solutions", "Complex numbers"]
    },
    groupB: {
      name: "Probability & Statistics 2 (S2)",
      topics: ["Poisson distribution", "Linear combinations", "Continuous random variables", "Sampling and estimation", "Hypothesis testing"]
    }
  },
  "Chemistry (9701)": {
    groupA: {
      name: "Advanced Physical Chemistry",
      topics: ["Chemical energetics A2", "Advanced electrochemistry", "Acid-base equilibria", "Kinetics & transition elements", "Transition colors"]
    },
    groupB: {
      name: "Advanced Inorganic & Organic",
      topics: ["Arenes and substitution", "Halogen compounds", "Hydroxy compounds", "Nitrogen compounds", "Polymerisation", "Analytical synthesis"]
    }
  },
  "Biology (9700)": {
    groupA: {
      name: "Energy & Coordination",
      topics: ["Energy & respiration", "Photosynthesis systems", "Homeostasis regulation", "Co-ordination in plants/animals"]
    },
    groupB: {
      name: "Inheritance, Ecosystems & Tech",
      topics: ["Inheritance genetics", "Selection and evolution", "Classification, biodiversity", "Genetic technologies"]
    }
  },
  "Computer Science (9618)": {
    groupA: {
      name: "Advanced Theory Concepts",
      topics: ["Data representation advanced", "Communication & networks", "System software deep-dive", "AI & cloud security"]
    },
    groupB: {
      name: "Practical Programming (Paper 4)",
      topics: ["Low-level assembly", "Declarative paradigms", "Advanced recursion, OOP", "Project diagnostics"]
    }
  },
  "English Language (9093)": {
    groupA: {
      name: "Text Analysis Skills",
      topics: ["Audience and text purpose", "Linguistic devices", "Comparative prose analysis", "Coherence patterns"]
    },
    groupB: {
      name: "Language Topics Deep-Dive",
      topics: ["Language acquisition stages", "Language change timeline", "Global English spread", "Language & self identity"]
    }
  },
  "Accounting (9706)": {
    groupA: {
      name: "Advanced Financial Accounting",
      topics: ["Preparation of complex statements", "Cash flow diagnostics", "Business transitions", "Consolidations"]
    },
    groupB: {
      name: "Advanced Cost & Management",
      topics: ["Activity-based costing", "Standard variance analysis", "Capital investment appraisal", "Joint products costing"]
    }
  },
  "Economics (9708)": {
    groupA: {
      name: "Advanced Microeconomics",
      topics: ["Consumer behavior curves", "Production & advanced cost", "Market structures & oligopoly", "Micro-market failures"]
    },
    groupB: {
      name: "Advanced Macroeconomics",
      topics: ["Economic growth models", "Unemployment indices", "Macro stability goals", "International financial flows"]
    }
  },
  "Business (9609)": {
    groupA: {
      name: "Strategic Management Models",
      topics: ["Understanding strategy", "Strategic choices", "Implementation guidelines", "Risk and control matrices"]
    },
    groupB: {
      name: "Decision-Making Matrices",
      topics: ["Strategic analysis tools", "Investment appraisals", "Critical path project planning", "Risk analysis"]
    }
  },
  "Psychology (9990)": {
    groupA: {
      name: "Specialist Options: Theory",
      topics: ["Clinical mental health theories", "Consumer behavioral theories", "Health psychology theories", "Organizational psychological models"]
    },
    groupB: {
      name: "Specialist Options: Case Studies",
      topics: ["Clinical therapeutic sweeps", "Consumer choices experiments", "Medical obedience trials", "Workplace productivity groups"]
    }
  }
};

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
  const [customSyllabus, setCustomSyllabus] = useState<Record<string, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }>>(AS_SYLLABUS_PRESETS);
  const [rawSyllabusInput, setRawSyllabusInput] = useState("");
  const [showSyllabusImporter, setShowSyllabusImporter] = useState(false);

  // Subject Configurations Array initiated with premium preset values instead of empty/minimal ones!
  const [subjects, setSubjects] = useState<SubjectConfig[]>(AS_SUBJECT_PRESETS);

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
                    Cambridge Assessment International Education (Advanced AS & A Levels).
                  </span>
                </button>
              </div>

              {/* Subvariant sub selectors */}
              {board === "CIE" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 bg-[#12121A]/40 p-4 border border-white/5 rounded">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Available CIE Variant Levels:</span>
                  <div className="flex flex-wrap gap-2">
                    {["AS LEVEL", "A LEVEL", "AS & A LEVEL"].map(v => (
                      <button
                        key={v}
                        onClick={() => {
                          setSubVariant(v);
                          if (v === "AS LEVEL") {
                            setSubjects(AS_SUBJECT_PRESETS);
                            setCustomSyllabus(AS_SYLLABUS_PRESETS);
                          } else if (v === "A LEVEL") {
                            setSubjects(A_SUBJECT_PRESETS);
                            setCustomSyllabus(A_SYLLABUS_PRESETS);
                          } else if (v === "AS & A LEVEL") {
                            setSubjects([...AS_SUBJECT_PRESETS, ...A_SUBJECT_PRESETS]);
                            setCustomSyllabus({ ...AS_SYLLABUS_PRESETS, ...A_SYLLABUS_PRESETS });
                          }
                        }}
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
                        PRE-LOAD CIE {subVariant} COURSE & STUDY UNITS PRESET
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        Instantly populates all standard {subVariant} subjects mapped exactly with Cambridge code components and grouped syllabus directories.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (subVariant === "A LEVEL") {
                            setSubjects(A_SUBJECT_PRESETS);
                            setCustomSyllabus(A_SYLLABUS_PRESETS);
                            alert("Premium CIE A-Level Study Units and components successfully initialized! Proceed below to customize weights or add targets.");
                          } else if (subVariant === "AS & A LEVEL") {
                            setSubjects([...AS_SUBJECT_PRESETS, ...A_SUBJECT_PRESETS]);
                            setCustomSyllabus({ ...AS_SYLLABUS_PRESETS, ...A_SYLLABUS_PRESETS });
                            alert("Premium CIE AS & A-Level Study Units and components successfully initialized! Proceed below to customize weights or add targets.");
                          } else {
                            setSubjects(AS_SUBJECT_PRESETS);
                            setCustomSyllabus(AS_SYLLABUS_PRESETS);
                            alert("Premium CIE AS-Level Study Units and components successfully initialized! Proceed below to customize weights or add targets.");
                          }
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 border border-purple-400/40 text-[10.5px] font-black uppercase rounded-lg flex items-center gap-1.5 transition-all text-white"
                      >
                        <Star size={12} className="fill-amber-300 stroke-amber-300" /> Apply Full {subVariant} Preset
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
