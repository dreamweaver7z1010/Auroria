const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreboardPanel.tsx', 'utf-8');

code = code.replace(
  '          <div className="bg-[#12121A] border border-white/5 rounded-xl p-3 text-[10px] text-slate-400 mt-4 leading-normal">\n            <span className="font-extrabold text-slate-300 block mb-1 uppercase tracking-wide">💡 SABERMETRICS CALCULATION:</span>\n            Subjects with multiple logged tests are calculated progressively. Your scoreboard divides total marks obtained by total maximum criteria to derive real subject grades.\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}',
  '          <div className="bg-[#12121A] border border-white/5 rounded-xl p-3 text-[10px] text-slate-400 mt-4 leading-normal">\n            <span className="font-extrabold text-slate-300 block mb-1 uppercase tracking-wide">💡 SABERMETRICS CALCULATION:</span>\n            Subjects with multiple logged tests are calculated progressively. Your scoreboard divides total marks obtained by total maximum criteria to derive real subject grades.\n          </div>\n        </div>\n        <StudyStreakCalendar focusSessions={focusSessions || []} />\n        </div>\n      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/components/ScoreboardPanel.tsx', code);
