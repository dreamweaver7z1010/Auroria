/**
 * Type declarations for CORE ACADEMIC ENGINE
 */

export type SubjectId = string;

export interface SubjectAccentMeta {
  color: string;
  glowClass: string;
  textClass: string;
  borderClass: string;
}

export interface UserPhase {
  id: string;
  currentOverrideState: number | null; // null means auto-calculated based on system date, 1, 2, or 3 means manual override
  systemCalculatedPhase: number;       // 1, 2, or 3
  localTime: string;
  activePhaseId: number;               // the one actually in use
}

export interface DaySchedule {
  dayName: string;
  dayType: "A" | "B" | "C" | string;
  subjects: string[];
  targets?: string;
  extraFlag?: "MAX_LOAD" | "STANDARD" | string;
}

export interface PhaseSchedule {
  phaseId: number;
  phaseName: string;
  description: string;
  dateRange: string;
  rotation: DaySchedule[];
}

export interface TestAnalytics {
  id: string;
  name: string;
  classification: "Mock" | "Monthly" | "Past Paper" | "Unit Test" | string;
  rawScore: number;
  totalMaxPoints: number;
  percentage: number;
  gritLog: string;
  date: string;
  subject?: string; // Subject tag
  // Conditional past paper metadata
  examYear?: string | number;
  examSeries?: string;
}

export interface MistakeVault {
  id: string;
  subject: SubjectId;
  description: string;
  wrongApproach: string;
  correctedSequence: string;
  resolved: boolean;
  dateAdded: string;
  questionImage?: string; // Base64 data or URL string representing the question image
}

/**
 * Onboarding and Saber-Metrics Configuration Types
 */
export interface ComponentConfig {
  name: string;
  maxMarks: number;
}

export interface SubjectConfig {
  name: SubjectId;
  components: ComponentConfig[];
  totalMark: number; // Sum of component maxMarks
  // Saber-Metrics configurations
  totalPaperTarget: number;
  yearRangeStart: number;
  yearRangeEnd: number;
  series: string[]; // e.g. ["Feb/March", "May/June"]
  chronologicalRule: number[]; // Ordered year array e.g., [2024, 2025, 2026]
  componentSequence: string[]; // Ordered component names
  completedTopics: string[]; // List of completed topics from syllabus
}

export interface SyllabusGroup {
  subject: SubjectId;
  groupA: { name: string; topics: string[] };
  groupB: { name: string; topics: string[] };
}

export interface OnboardingConfig {
  board: "CBSE" | "CIE";
  subVariant: "IGCSE" | "AS LEVEL" | "A LEVEL" | "AS/A LEVELS" | "9th Grade" | "10th Grade" | "11th Grade" | "12th Grade" | string;
  subjects: SubjectConfig[];
  schoolStartDate: string; // [D1]
  revisionStartDate: string; // [D2]
  boardExamDate: string; // [D3]
  customSyllabus?: Record<string, { name: string; topics: string[] }[]>;
}

export interface UserAccount {
  username: string;
  onboarded: boolean;
  config: OnboardingConfig | null;
  testAnalytics: TestAnalytics[];
  mistakeVault: MistakeVault[];
  currentOverrideState: number | null;
}

