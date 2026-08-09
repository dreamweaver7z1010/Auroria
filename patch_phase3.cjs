const fs = require('fs');
let code = fs.readFileSync('src/components/Phase3Panel.tsx', 'utf-8');

// Add import
if (!code.includes('import PastPaperChecklist')) {
  code = code.replace(
    'import {\n  ClipboardCheck,\n',
    'import PastPaperChecklist from "./PastPaperChecklist";\nimport {\n  ClipboardCheck,\n'
  );
}

// Strip out PastPaperObj and DEFAULT_PAPERS_PRE_LOAD
const startInterface = code.indexOf('interface PastPaperObj');
const endPreLoad = code.indexOf('export default function Phase3Panel');
if (startInterface !== -1 && endPreLoad !== -1) {
  code = code.substring(0, startInterface) + code.substring(endPreLoad);
}

// Inside Phase3Panel, remove the state and logic for past papers
const startState = code.indexOf('// Load dynamically added & completed past papers');
const endState = code.indexOf('const currentSubjectPapers = papersMap[activeSubject] || [];');
const endStateLine = code.indexOf('return (', endState);

if (startState !== -1 && endStateLine !== -1) {
  // We need to keep activeSubject but actually activeSubject is inside PastPaperChecklist now.
  // Wait, activeSubject is also used by the strict rotation schedule? No, it's not.
  code = code.substring(0, startState) + code.substring(endStateLine);
}

// Find the UI block for Past Paper Checklist Track
const startUI = code.indexOf('{/* Dynamic Past Paper Track suite similar to Syllabus Tracker */}');
const endUI = code.indexOf('</div>\n    </div>\n  );\n}');

if (startUI !== -1 && endUI !== -1) {
  code = code.substring(0, startUI) + '<PastPaperChecklist userSubjects={userSubjects} username={username} />\n      ' + code.substring(endUI);
}

fs.writeFileSync('src/components/Phase3Panel.tsx', code);
