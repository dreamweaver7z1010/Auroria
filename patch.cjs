const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreboardPanel.tsx', 'utf-8');

// Add import
if (!code.includes('import StudyStreakCalendar')) {
  code = code.replace(
    'import AchievementSystem from "./AchievementSystem";',
    'import AchievementSystem from "./AchievementSystem";\nimport StudyStreakCalendar from "./StudyStreakCalendar";'
  );
}

// Wrap column 3
code = code.replace(
  '        {/* Column 3: Custom SVG interconnected progress chart */}\n        <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 flex flex-col justify-between">',
  '        {/* Column 3: Custom SVG interconnected progress chart */}\n        <div className="flex flex-col gap-6">\n        <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 flex flex-col justify-between">'
);

code = code.replace(
  '          </div>\n        </div>\n      </div>\n    </div>',
  '          </div>\n        </div>\n        <StudyStreakCalendar focusSessions={focusSessions || []} />\n        </div>\n      </div>\n    </div>'
);

fs.writeFileSync('src/components/ScoreboardPanel.tsx', code);
