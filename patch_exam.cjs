const fs = require('fs');
let code = fs.readFileSync('src/components/ExamPhasePanel.tsx', 'utf-8');

// Add import
if (!code.includes('import PastPaperChecklist')) {
  code = code.replace(
    'import SyllabusTracker from "./SyllabusTracker";',
    'import SyllabusTracker from "./SyllabusTracker";\nimport PastPaperChecklist from "./PastPaperChecklist";'
  );
}

// Add username to props
code = code.replace(
  '  customSyllabus?: Record<string, any>;\n  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;\n}',
  '  customSyllabus?: Record<string, any>;\n  onSaveCustomSyllabus?: (subject: string, syllabusData: any) => Promise<void>;\n  username: string;\n}'
);

code = code.replace(
  '  onSaveCustomSyllabus\n}: ExamPhasePanelProps) {',
  '  onSaveCustomSyllabus,\n  username\n}: ExamPhasePanelProps) {'
);

// Add PastPaperChecklist before Syllabus Matrix Checklist
code = code.replace(
  '      {/* Syllabus Matrix Checklist with Phase 3 ID */}',
  '      <PastPaperChecklist userSubjects={userSubjects} username={username} />\n\n      {/* Syllabus Matrix Checklist with Phase 3 ID */}'
);

fs.writeFileSync('src/components/ExamPhasePanel.tsx', code);
