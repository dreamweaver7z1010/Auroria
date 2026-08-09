const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreboardPanel.tsx', 'utf-8');
code = code.replace(
  /<div className="space-y-6">\n        focusSessions={focusSessions}\n        userSubjects={userSubjects}\n      \/>/g,
  '<div className="space-y-6">\n      <AchievementSystem \n        tests={tests}\n        focusSessions={focusSessions}\n        userSubjects={userSubjects}\n      />'
);
fs.writeFileSync('src/components/ScoreboardPanel.tsx', code);
