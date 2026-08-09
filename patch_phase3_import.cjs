const fs = require('fs');
let code = fs.readFileSync('src/components/Phase3Panel.tsx', 'utf-8');

if (!code.includes('import PastPaperChecklist')) {
  code = code.replace(
    'import { \n  ClipboardCheck,',
    'import PastPaperChecklist from "./PastPaperChecklist";\nimport { \n  ClipboardCheck,'
  );
  // Just in case formatting is different
  code = code.replace(
    'import {',
    'import PastPaperChecklist from "./PastPaperChecklist";\nimport {'
  );
}

fs.writeFileSync('src/components/Phase3Panel.tsx', code);
