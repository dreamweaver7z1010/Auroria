const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreboardPanel.tsx', 'utf-8');

// Add Recharts import
if (!code.includes('import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";')) {
  code = code.replace(
    'import { TestAnalytics, SubjectConfig, FocusSession } from "../types";',
    'import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";\nimport { TestAnalytics, SubjectConfig, FocusSession } from "../types";'
  );
}

// Add Target icon to import
if (!code.includes('Target')) {
  // It's probably already there based on the head output earlier, Target is imported from lucide-react. Let's make sure.
}

// Add phaseStats to interface
if (!code.includes('phaseStats?: {')) {
  code = code.replace(
    '  onDeleteFocusSession?: (id: string) => Promise<void>;\n}',
    '  onDeleteFocusSession?: (id: string) => Promise<void>;\n  phaseStats?: { phase1: number, phase2: number, phase3: number, phase4: number, phase5: number };\n}'
  );
}

// Add phaseStats to destructured props
code = code.replace(
  '  onDeleteFocusSession\n}: ScoreboardPanelProps) {',
  '  onDeleteFocusSession,\n  phaseStats\n}: ScoreboardPanelProps) {'
);

// We need a helper to generate the data for the radar chart
const radarCode = `
        {/* Radar Chart for Phase Completion */}
        {phaseStats && (
          <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300">
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase border-b border-white/5 pb-3 mb-4">
              <Target className="text-indigo-400" size={14} />
              PREPARATION PROGRESS
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="75%" 
                  data={[
                    { subject: 'Phase 1', A: phaseStats.phase1, fullMark: 100 },
                    { subject: 'Phase 2', A: phaseStats.phase2, fullMark: 100 },
                    { subject: 'Phase 3', A: phaseStats.phase3, fullMark: 100 },
                    { subject: 'Pre-Exam', A: phaseStats.phase4, fullMark: 100 },
                    { subject: 'Exam', A: phaseStats.phase5, fullMark: 100 },
                  ]}
                >
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false} 
                  />
                  <Radar
                    name="Completion"
                    dataKey="A"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
`;

code = code.replace(
  '        <StudyStreakCalendar focusSessions={focusSessions || []} />\n        </div>\n      </div>\n    </div>\n  );\n}',
  '        <StudyStreakCalendar focusSessions={focusSessions || []} />\n' + radarCode + '\n        </div>\n      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/components/ScoreboardPanel.tsx', code);
