const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  '                <ExamPhasePanel \n                  userSubjects={config.subjects}',
  '                <ExamPhasePanel \n                  userSubjects={config.subjects}\n                  username={userAccount?.username || "User"}'
);

fs.writeFileSync('src/App.tsx', code);
