const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert calculations before `return (` at line 694
const insertCode = `
  const userSubjectsList = config?.subjects || [];
  const customSyllabusDict = config?.customSyllabus;
  const phase1Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 1);
  const phase2Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 2);
  const phase3Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 3);
  const preExamPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 4);
  const examPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 5);
`;
code = code.replace(
  '  const fontScaleClass = fontScale === "compact" ? "text-[90%]" : fontScale === "large" ? "text-[110%]" : "text-[100%]";\n\n  return (',
  '  const fontScaleClass = fontScale === "compact" ? "text-[90%]" : fontScale === "large" ? "text-[110%]" : "text-[100%]";\n' + insertCode + '\n  return ('
);

// Remove the calculations from the IIFE
code = code.replace(
  '          const userSubjectsList = config?.subjects || [];\n          const customSyllabusDict = config?.customSyllabus;\n          const phase1Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 1);\n          const phase2Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 2);\n          const phase3Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 3);\n          const preExamPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 4);\n          const examPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 5);\n',
  ''
);

// Add phaseStats prop to ScoreboardPanel
code = code.replace(
  '                  onDeleteFocusSession={handleDeleteFocusSession}\n                />',
  '                  onDeleteFocusSession={handleDeleteFocusSession}\n                  phaseStats={{ phase1: phase1Pct, phase2: phase2Pct, phase3: phase3Pct, phase4: preExamPct, phase5: examPct }}\n                />'
);

fs.writeFileSync('src/App.tsx', code);
