const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace('username={userAccount?.username || "User"}', 'username={username || "User"}');
fs.writeFileSync('src/App.tsx', appCode);

let phase3Code = fs.readFileSync('src/components/Phase3Panel.tsx', 'utf-8');
phase3Code = phase3Code.replace('import PastPaperChecklist from "./PastPaperChecklist";\n', '');
fs.writeFileSync('src/components/Phase3Panel.tsx', phase3Code);
