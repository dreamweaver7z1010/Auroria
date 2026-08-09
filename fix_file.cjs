const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreboardPanel.tsx', 'utf-8');

// I need to add `<StudyStreakCalendar focusSessions={focusSessions || []} />\n</div>` 
// exactly after `        </div>\n      </div>\n    </div>\n  );\n}` isn't matching!
// Let's replace the last 3 `</div>`s with `<StudyStreakCalendar />\n</div>\n</div>\n</div>`
let lines = code.split('\n');

// Find the last 3 closing divs
let divsFound = 0;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('</div>')) {
    divsFound++;
    if (divsFound === 3) { // It's actually the `</div>` before the last two `</div>`s
      lines.splice(i + 1, 0, '        <StudyStreakCalendar focusSessions={focusSessions || []} />', '        </div>');
      break;
    }
  }
}
fs.writeFileSync('src/components/ScoreboardPanel.tsx', lines.join('\n'));
