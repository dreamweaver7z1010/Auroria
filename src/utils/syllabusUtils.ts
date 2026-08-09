import { SubjectConfig, SubjectId } from "../types";

export const DEFAULT_PRESET_SYLLABUS: Record<string, { name: string; topics: string[] }[]> = {
  "Chemistry": [
    {
      name: "Physical Chemistry",
      topics: [
        "Atomic structure",
        "Atoms, molecules and stoichiometry",
        "Chemical bonding",
        "States of matter",
        "Chemical energetics",
        "Electrochemistry",
        "Equilibria",
        "Reaction kinetics"
      ]
    },
    {
      name: "Inorganic Chemistry",
      topics: [
        "The Periodic Table: chemical periodicity",
        "Group 2",
        "Group 17",
        "Nitrogen and sulfur"
      ]
    },
    {
      name: "Organic Chemistry",
      topics: [
        "An introduction to AS Level organic chemistry",
        "Hydrocarbons",
        "Halogen compounds",
        "Hydroxy compounds",
        "Carbonyl compounds",
        "Carboxylic acids and derivatives",
        "Nitrogen compounds",
        "Polymerisation",
        "Organic synthesis"
      ]
    }
  ],
  "Physics": [
    {
      name: "Physical Units",
      topics: [
        "Physical quantities and units"
      ]
    },
    {
      name: "Mechanics",
      topics: [
        "Kinematics",
        "Dynamics",
        "Forces, density and pressure",
        "Work, energy and power",
        "Deformation of solids"
      ]
    },
    {
      name: "Waves & Electricity",
      topics: [
        "Waves",
        "Superposition",
        "Electricity",
        "D.C. circuits",
        "Particle physics"
      ]
    }
  ],
  "Computer Science": [
    {
      name: "Theory (Paper 1)",
      topics: [
        "Information representation",
        "Communication and internet technologies",
        "Hardware",
        "Processor fundamentals",
        "System software",
        "Security, privacy and data integrity",
        "Ethics and ownership",
        "Databases"
      ]
    },
    {
      name: "Problem-solving & Programming (Paper 2)",
      topics: [
        "Algorithm design and problem-solving",
        "Programming (pseudocode / high-level language)",
        "Data structures and algorithms",
        "Software development"
      ]
    }
  ],
  "Math": [
    {
      name: "Pure Mathematics (Paper 1)",
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
    {
      name: "Probability & Statistics (Paper 5)",
      topics: [
        "Representation of data",
        "Permutations and combinations",
        "Probability",
        "Discrete random variables",
        "The normal distribution"
      ]
    }
  ],
  "English": [
    {
      name: "Core Structure & Skills",
      topics: [
        "Essay (Paper 1): One essay (600–700 words) from 10 questions",
        "Comprehension (Paper 2): Compulsory questions on unseen texts"
      ]
    }
  ]
};

export const normalizeSubjectName = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("chem")) return "Chemistry";
  if (lower.includes("phys")) return "Physics";
  if (lower.includes("comput") || lower.includes("cs")) return "Computer Science";
  if (lower.includes("math")) return "Math";
  if (lower.includes("english") || lower.includes("general paper") || lower.includes("8021")) return "English";
  return name;
};

export const getSyllabusMap = (
  subjName: string,
  customSyllabus?: Record<string, any>,
  userSubjects?: SubjectConfig[]
): { name: string; topics: string[] }[] => {
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

  const sObj = userSubjects?.find(s => s.name === subjName);
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

export function calculatePhaseProgress(
  userSubjects: SubjectConfig[] = [],
  customSyllabus: Record<string, any> = {},
  phaseId: number
): number {
  if (!userSubjects || userSubjects.length === 0) return 0;

  let totalTopicsCount = 0;
  let completedTopicsCount = 0;

  userSubjects.forEach(subject => {
    const map = getSyllabusMap(subject.name, customSyllabus, userSubjects);
    const allTopics = map.flatMap(g => g.topics);
    const subjectTotal = allTopics.length || 1;
    totalTopicsCount += subjectTotal;

    const pKey = `completedTopics_phase${phaseId}`;
    const rawCompleted = (subject as any)?.[pKey] || (phaseId === 1 ? subject.completedTopics : []) || [];
    const completedSet = new Set<string>(rawCompleted);

    // Count how many topics from the syllabus map are present in completedSet
    const completedInMap = allTopics.filter(t => completedSet.has(t)).length;
    
    // Fallback: if user checked off topics directly that match or count length
    const actualCompleted = Math.min(subjectTotal, Math.max(completedInMap, rawCompleted.length));
    completedTopicsCount += actualCompleted;
  });

  if (totalTopicsCount === 0) return 0;
  return Math.round((completedTopicsCount / totalTopicsCount) * 100);
}
