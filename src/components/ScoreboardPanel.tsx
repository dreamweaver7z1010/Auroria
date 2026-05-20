import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  ClipboardList, 
  HelpCircle,
  Award
} from "lucide-react";
import { TestAnalytics, SubjectConfig } from "../types";

interface ScoreboardPanelProps {
  userSubjects: SubjectConfig[];
  tests: TestAnalytics[];
  onAddTest: (newTest: Omit<TestAnalytics, "id" | "percentage" | "date">) => Promise<void>;
  onDeleteTest?: (id: string) => Promise<void>; // Optional delete helper
}

export default function ScoreboardPanel({ 
  userSubjects, 
  tests, 
  onAddTest,
  onDeleteTest 
}: ScoreboardPanelProps) {
  const [title, setTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(userSubjects[0]?.name || "General");
  const [testType, setTestType] = useState<"Mock" | "Monthly" | "Unit Test">("Mock");
  const [scoreObtained, setScoreObtained] = useState<number | "">("");
  const [maxScore, setMaxScore] = useState<number | "">("");
  const [gritLog, setGritLog] = useState("");
  const [chartType, setChartType] = useState<"BAR" | "LINE" | "RADIAL">("BAR");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Provide a title / index for this assessment.");
      return;
    }
    if (scoreObtained === "" || maxScore === "") {
      alert("Please provide the raw marks obtained and total possible marks.");
      return;
    }
    const ob = Number(scoreObtained);
    const mx = Number(maxScore);
    if (ob < 0 || mx <= 0) {
      alert("Marks must be non-negative, and total marks must exceed zero.");
      return;
    }
    if (ob > mx) {
      alert("Obtained score cannot exceed total maximum possible points.");
      return;
    }

    try {
      await onAddTest({
        name: title.trim(),
        classification: testType,
        rawScore: ob,
        totalMaxPoints: mx,
        gritLog: gritLog.trim() || `Automated log score for ${testType} test.`,
        subject: selectedSubject,
      });

      // Clear inputs
      setTitle("");
      setScoreObtained("");
      setMaxScore("");
      setGritLog("");
    } catch {
      alert("Failed submitting assessment records.");
    }
  };

  // Interconnect with progress report chart:
  // Calculate total marks obtained and maximum possible marks for each unique subject tag
  const subjectAggregates = userSubjects.map(subj => {
    const matchedTests = tests.filter(t => t.subject === subj.name);
    const totalObtained = matchedTests.reduce((sum, t) => sum + t.rawScore, 0);
    const totalMax = matchedTests.reduce((sum, t) => sum + t.totalMaxPoints, 0);
    const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(1)) : 0;
    
    return {
      subject: subj.name,
      obtained: totalObtained,
      max: totalMax,
      percentage,
      testCount: matchedTests.length
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columns 1 & 2: Score entry and list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form to submit Academic Scorecard */}
          <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative">
            <div className="absolute top-0 right-0 py-1 px-2.5 bg-purple-500/15 border-l border-b border-purple-500/20 text-[#9D00FF] font-black text-[9px] uppercase tracking-widest rounded-bl">
              DATA SECURE INJECT
            </div>
            
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide mb-4">
              <Award className="text-purple-400" size={16} />
              ACADEMIC SCOREBOARD SECURE ENTRY
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Test Title / Identification</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unit 2 Organic Drill, Midterm"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Subject Tag</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-purple-400 focus:outline-none"
                >
                  {userSubjects.map(s => (
                    <option key={s.name} value={s.name}>{s.name.toUpperCase()}</option>
                  ))}
                  <option value="General">General/Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Test Categorization</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-purple-400 focus:outline-none"
                >
                  <option value="Mock">Mock Exam / Mocktest</option>
                  <option value="Monthly">Monthly Test</option>
                  <option value="Unit Test">Unit Test</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Marks Obtained</label>
                <input
                  type="number"
                  value={scoreObtained}
                  onChange={(e) => setScoreObtained(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 34"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Grand Total Marks Possible</label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 40"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Self-Diagnostic Note / Grit Log</label>
                <input
                  type="text"
                  value={gritLog}
                  onChange={(e) => setGritLog(e.target.value)}
                  placeholder="e.g. Careless math error on question 3"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded px-2.5 py-1.5 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-black text-[10.5px] uppercase tracking-wide rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-purple-500/10"
                >
                  <Plus size={14} /> Log Score Metrics
                </button>
              </div>
            </form>
          </div>

          {/* Test scores history scoreboard */}
          <div className="border border-white/5 bg-[#12121A]/70 rounded-xl p-5 text-slate-350">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ClipboardList size={14} className="text-[#00F0FF]" />
              CHRONOLOGICAL TEST LOGS & RESULTS ({tests.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono leading-normal">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5">Title</th>
                    <th className="py-2.5">Subject</th>
                    <th className="py-2.5">Type</th>
                    <th className="py-2.5 text-center">Score</th>
                    <th className="py-2.5 text-right pr-3">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/2">
                  {tests.map(test => (
                    <tr key={test.id} className="hover:bg-white/1 transition-all">
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{test.date}</td>
                      <td className="py-2 text-slate-200 font-extrabold max-w-[150px] truncate">{test.name}</td>
                      <td className="py-2">
                        <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/10 rounded uppercase font-black text-[9px]">
                          {test.subject || "General"}
                        </span>
                      </td>
                      <td className="py-2 text-slate-400">{test.classification}</td>
                      <td className="py-2 text-center text-slate-200 font-bold">
                        {test.rawScore} / <span className="text-slate-500">{test.totalMaxPoints}</span>
                      </td>
                      <td className="py-2 text-right text-[#00FF66] font-bold pr-3">
                        {test.percentage}%
                      </td>
                    </tr>
                  ))}
                  {tests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 italic">
                        No previous test entries registered. Add assessment data above to construct the report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Column 3: Custom SVG interconnected progress chart */}
        <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase">
                <Sparkles className="text-purple-400" size={14} />
                PROGRESS SCORECARD CHART
              </h3>

              {/* Chart type selection tags */}
              <div className="flex gap-1">
                <button
                  onClick={() => setChartType("BAR")}
                  className={`p-1.5 rounded transition-all ${chartType === "BAR" ? "bg-purple-600 text-white" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
                  title="Render Bar Chart"
                >
                  <BarChart2 size={13} />
                </button>
                <button
                  onClick={() => setChartType("LINE")}
                  className={`p-1.5 rounded transition-all ${chartType === "LINE" ? "bg-purple-600 text-white" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
                  title="Render Line Chart"
                >
                  <TrendingUp size={13} />
                </button>
                <button
                  onClick={() => setChartType("RADIAL")}
                  className={`p-1.5 rounded transition-all ${chartType === "RADIAL" ? "bg-purple-600 text-white" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
                  title="Render Gauge Arc"
                >
                  <PieChart size={13} />
                </button>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-405 leading-normal mb-4">
              This report automatically sums up all score points for each subject to calculate your global average.
            </p>

            {/* Custom SVG Drawing Suite */}
            <div className="bg-[#0A0A0F] border border-white/5 p-3 rounded-xl min-h-[200px] flex items-center justify-center relative overflow-hidden">
              
              {chartType === "BAR" && (
                <div className="w-full space-y-3.5 py-2">
                  {subjectAggregates.map((item, idx) => {
                    const barGlowColors = [
                      "bg-[#00F0FF] shadow-[#00F0FF]/25",
                      "bg-[#FF0055] shadow-[#FF0055]/25",
                      "bg-[#00FF66] shadow-[#00FF66]/25",
                      "bg-[#FFEA00] shadow-[#FFEA00]/25",
                      "bg-purple-500 shadow-purple-500/25"
                    ];
                    const barColor = barGlowColors[idx % barGlowColors.length];

                    return (
                      <div key={item.subject} className="space-y-1 text-[10.5px]">
                        <div className="flex justify-between font-bold text-[10px] text-slate-400">
                          <span className="uppercase text-slate-300">{item.subject}</span>
                          <span>{item.percentage}% ({item.obtained}/{item.max})</span>
                        </div>
                        <div className="h-2 w-full bg-slate-905 bg-white/5 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${barColor} shadow-lg`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {chartType === "LINE" && (
                <svg viewBox="0 0 100 60" className="w-full h-[180px] overflow-visible">
                  {/* Grid Lines */}
                  <line x1="5" y1="5" x2="95" y2="5" stroke="#FFFFFF" strokeOpacity="0.04" strokeWidth="0.5" />
                  <line x1="5" y1="25" x2="95" y2="25" stroke="#FFFFFF" strokeOpacity="0.04" strokeWidth="0.5" />
                  <line x1="5" y1="45" x2="95" y2="45" stroke="#FFFFFF" strokeOpacity="0.04" strokeWidth="0.5" />
                  <line x1="5" y1="55" x2="95" y2="55" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="0.5" />

                  {/* Draw the visual path connecting points */}
                  {(() => {
                    const pointsCount = subjectAggregates.length;
                    if (pointsCount === 0) return null;
                    const coords = subjectAggregates.map((item, i) => {
                      const x = 10 + (i * (80 / Math.max(1, pointsCount - 1)));
                      // Map 0-100% to Y coordinate 55 (0%) down to 5 (100%)
                      const y = 55 - (item.percentage * 50 / 100);
                      return { x, y, item };
                    });

                    const dPath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(" ");

                    return (
                      <>
                        {pointsCount > 1 && (
                          <motion.path
                            d={dPath}
                            fill="none"
                            stroke="url(#purpleGlowG)"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8 }}
                          />
                        )}
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle cx={c.x} cy={c.y} r="1.8" className="fill-purple-500 stroke-black stroke-1 animate-pulse" />
                            <text x={c.x} y={c.y - 3} textAnchor="middle" fontSize="3" className="fill-slate-300 font-bold">
                              {c.item.percentage}%
                            </text>
                            <text x={c.x} y="58.5" textAnchor="middle" fontSize="2.5" className="fill-slate-500 font-black uppercase">
                              {c.item.subject.slice(0, 4)}
                            </text>
                          </g>
                        ))}
                        <defs>
                          <linearGradient id="purpleGlowG" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00F0FF" />
                            <stop offset="50%" stopColor="#9D00FF" />
                            <stop offset="100%" stopColor="#FF0055" />
                          </linearGradient>
                        </defs>
                      </>
                    );
                  })()}
                </svg>
              )}

              {chartType === "RADIAL" && (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  {(() => {
                    // Global aggregate
                    const totalObt = subjectAggregates.reduce((sum, item) => sum + item.obtained, 0);
                    const totalMx = subjectAggregates.reduce((sum, item) => sum + item.max, 0);
                    const globalPercentage = totalMx > 0 ? Math.round((totalObt / totalMx) * 100) : 0;

                    // Compute gauge dash stroke values
                    const radius = 24;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (globalPercentage / 100) * circumference;

                    return (
                      <div className="space-y-2">
                        <svg className="w-32 h-32 transform -rotate-90 overflow-visible">
                          {/* Outer Track circle */}
                          <circle cx="64" cy="64" r={radius} className="fill-none stroke-white/5" strokeWidth="4.5" />
                          {/* Inner glowing percentage progress wheel */}
                          <motion.circle
                            cx="64"
                            cy="64"
                            r={radius}
                            className="fill-none stroke-[#9D00FF]"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                          <span className="text-2xl font-black text-[#00FF66] tracking-tight">{globalPercentage}%</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">CUMULATIVE AVERAGE</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {tests.length === 0 && (
                <div className="absolute inset-0 bg-[#0A0A0F]/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-3">
                  <HelpCircle size={20} className="text-slate-600 mb-1 animate-spin" />
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                    AWAITING TEST SCORECARD DATA TO COMPILE ACTIVE METRICS
                  </span>
                </div>
              )}

            </div>
          </div>

          <div className="bg-[#12121A] border border-white/5 rounded-xl p-3 text-[10px] text-slate-400 mt-4 leading-normal">
            <span className="font-extrabold text-slate-300 block mb-1 uppercase tracking-wide">💡 SABERMETRICS CALCULATION:</span>
            Subjects with multiple logged tests are calculated progressively. Your scoreboard divides total marks obtained by total maximum criteria to derive real subject grades.
          </div>
        </div>

      </div>
    </div>
  );
}
