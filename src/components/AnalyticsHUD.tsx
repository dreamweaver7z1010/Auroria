import { useState, useMemo, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, Award, BookOpen, AlertCircle, 
  CheckCircle, ShieldCheck, ChevronDown, ChevronUp, 
  Plus, Terminal, X, Archive, AlertTriangle, Eye 
} from "lucide-react";
import { TestAnalytics, MistakeVault, SubjectId } from "../types";
import { getSubjectAccent } from "./CyberGlowStyles";

interface AnalyticsHUDProps {
  tests: TestAnalytics[];
  mistakes: MistakeVault[];
  onAddTest: (test: Omit<TestAnalytics, "id" | "percentage" | "date">) => Promise<void>;
  onAddMistake: (mistake: Omit<MistakeVault, "id" | "resolved" | "dateAdded">) => Promise<void>;
  onResolveMistake: (id: string) => Promise<void>;
}

export default function AnalyticsHUD({ 
  tests, 
  mistakes, 
  onAddTest, 
  onAddMistake, 
  onResolveMistake 
}: AnalyticsHUDProps) {

  // Selected test for Grit Reflection Log Sidebar
  const [selectedTestGrit, setSelectedTestGrit] = useState<TestAnalytics | null>(null);
  const [expandedMistakeIds, setExpandedMistakeIds] = useState<Record<string, boolean>>({});

  // Form states
  const [showTestForm, setShowTestForm] = useState(false);
  const [testName, setTestName] = useState("");
  const [testClass, setTestClass] = useState<"Mock" | "Monthly" | "Past Paper">("Past Paper");
  const [examYear, setExamYear] = useState("2026");
  const [examSeries, setExamSeries] = useState("May/June");
  const [rawScore, setRawScore] = useState<number>(75);
  const [totalMax, setTotalMax] = useState<number>(100);
  const [gritLogText, setGritLogText] = useState("");

  const [showMistakeForm, setShowMistakeForm] = useState(false);
  const [mSubject, setMSubject] = useState<SubjectId>("Math");
  const [mDesc, setMDesc] = useState("");
  const [mWrong, setMWrong] = useState("");
  const [mCorrect, setMCorrect] = useState("");

  // Loading states
  const [submittingTest, setSubmittingTest] = useState(false);
  const [submittingMistake, setSubmittingMistake] = useState(false);

  // Subject performance calculation for Loading bars
  const subjectAverages = useMemo(() => {
    // Standard subject list
    const subjectsMap: Record<SubjectId, { sum: number; count: number }> = {
      "Chemistry": { sum: 0, count: 0 },
      "Physics": { sum: 0, count: 0 },
      "Math": { sum: 0, count: 0 },
      "Computer Science": { sum: 0, count: 0 },
      "English": { sum: 0, count: 0 }
    };

    // Calculate sum of percentages based on names
    tests.forEach((t) => {
      const name = t.name.toLowerCase();
      if (name.includes("chem")) {
        subjectsMap["Chemistry"].sum += t.percentage;
        subjectsMap["Chemistry"].count++;
      } else if (name.includes("phys")) {
        subjectsMap["Physics"].sum += t.percentage;
        subjectsMap["Physics"].count++;
      } else if (name.includes("math") || name.includes("calc")) {
        subjectsMap["Math"].sum += t.percentage;
        subjectsMap["Math"].count++;
      } else if (name.includes("computer") || name.includes("cs")) {
        subjectsMap["Computer Science"].sum += t.percentage;
        subjectsMap["Computer Science"].count++;
      } else if (name.includes("eng") || name.includes("liter")) {
        subjectsMap["English"].sum += t.percentage;
        subjectsMap["English"].count++;
      }
    });

    // Generate average or default to benchmark
    return Object.keys(subjectsMap).map((key) => {
      const sId = key as SubjectId;
      const data = subjectsMap[sId];
      // Default seeds if none found to avoid empty bars
      const benchmarkDefault = sId === "Math" ? 95 : sId === "Chemistry" ? 67 : sId === "Physics" ? 78 : sId === "Computer Science" ? 91 : 76;
      const averagePerc = data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : benchmarkDefault;
      return {
        subject: sId,
        percentage: averagePerc
      };
    });
  }, [tests]);

  const toggleMistakeExpand = (id: string) => {
    setExpandedMistakeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || rawScore === undefined || totalMax <= 0) return;
    setSubmittingTest(true);
    try {
      await onAddTest({
        name: testName,
        classification: testClass,
        rawScore,
        totalMaxPoints: totalMax,
        gritLog: gritLogText || `Engine validated entry raw score of ${rawScore}/${totalMax}`,
        examYear: testClass === "Past Paper" ? examYear : undefined,
        examSeries: testClass === "Past Paper" ? examSeries : undefined
      });
      // Reset
      setTestName("");
      setGritLogText("");
      setShowTestForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingTest(false);
    }
  };

  const handleMistakeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mDesc.trim() || !mWrong.trim() || !mCorrect.trim()) return;
    setSubmittingMistake(true);
    try {
      await onAddMistake({
        subject: mSubject,
        description: mDesc,
        wrongApproach: mWrong,
        correctedSequence: mCorrect
      });
      // Reset
      setMDesc("");
      setMWrong("");
      setMCorrect("");
      setShowMistakeForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingMistake(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      
      {/* LEFT COLUMN: Test Score Grid Table & Adding Scores Module (7/12 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Score Grid Panel */}
        <div className="border border-white/5 bg-[#12121A]/60 backdrop-blur-md rounded-lg p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#00F0FF]/30" />
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h3 className="text-md font-mono font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="text-[#00F0FF]" size={16} />
              ACADEMIC SCOREBOARD & METRICS
            </h3>
            
            <button
              onClick={() => setShowTestForm(!showTestForm)}
              className="px-2.5 py-1 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-mono text-[10px] hover:bg-[#00F0FF]/25 transition-all uppercase flex items-center gap-1.5"
            >
              <Plus size={12} />
              {showTestForm ? "Cancel Add" : "Log Test"}
            </button>
          </div>

          {/* Collapsible Log Scores Form */}
          <AnimatePresence>
            {showTestForm && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleTestSubmit}
                className="mb-6 p-4 bg-[#0A0A0F] border border-white/10 rounded-md overflow-hidden space-y-3 font-mono text-xs"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-2">
                  <Terminal size={14} className="text-[#00F0FF]" />
                  <span className="font-bold text-[#00F0FF] text-[10px] uppercase">Telemetry Data Loader</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-slate-500 block text-[9px] uppercase mb-1">Test Name or Code</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. CS Paper 2 - Algorithm Proof"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[9px] uppercase mb-1">ClassificationType</label>
                    <select
                      value={testClass}
                      onChange={(e) => setTestClass(e.target.value as any)}
                      className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none focus:border-[#00F0FF]"
                    >
                      <option value="Past Paper">Past Paper</option>
                      <option value="Mock">Mock Exam</option>
                      <option value="Monthly">Monthly Test</option>
                    </select>
                  </div>
                </div>

                {testClass === "Past Paper" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3 p-2 bg-[#12121A]/60 border border-[#00F0FF]/15 rounded"
                  >
                    <div>
                      <label className="text-[#00F0FF]/85 block text-[9px] uppercase font-bold mb-1">Exam Year</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. 2026"
                        value={examYear}
                        onChange={(e) => setExamYear(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-[#00F0FF]/30 text-slate-200 rounded p-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[#00F0FF]/85 block text-[9px] uppercase font-bold mb-1">Exam Series</label>
                      <select
                        value={examSeries}
                        onChange={(e) => setExamSeries(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-[#00F0FF]/30 text-slate-200 rounded p-1.5 focus:outline-none"
                      >
                        <option value="Feb/March">Feb/March</option>
                        <option value="May/June">May/June</option>
                        <option value="Oct/Nov">Oct/Nov</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block text-[9px] uppercase mb-1">Raw Marks Obtained</label>
                    <input 
                      type="number"
                      required
                      value={rawScore}
                      min={0}
                      onChange={(e) => setRawScore(Number(e.target.value))}
                      className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[9px] uppercase mb-1">Max Score Possible</label>
                    <input 
                      type="number"
                      required
                      value={totalMax}
                      min={1}
                      onChange={(e) => setTotalMax(Number(e.target.value))}
                      className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 block text-[9px] uppercase mb-1">Grit Reflection Commentary</label>
                  <textarea 
                    value={gritLogText}
                    onChange={(e) => setGritLogText(e.target.value)}
                    placeholder="Provide a qualitative breakdown of concepts missed, errors made, and review timing details..."
                    rows={2}
                    className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none focus:border-[#00F0FF] text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingTest}
                  className="w-full bg-[#00F0FF]/25 border border-[#00F0FF] text-[#00F0FF] p-2 hover:bg-[#00F0FF]/40 rounded font-bold uppercase tracking-widest text-[10px] transition-all"
                >
                  {submittingTest ? "COMPILING SCORES..." : "LOAD SCORE METRICS"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Scores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 pb-2 text-slate-500 text-[10px] uppercase">
                  <th className="py-2.5">Test Log Details</th>
                  <th className="py-2.5 hidden sm:table-cell">Classification</th>
                  <th className="py-2.5 text-center">Score</th>
                  <th className="py-2.5 text-right w-16">Metrics</th>
                  <th className="py-2.5 text-center w-12">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tests.map((test) => {
                  const style = getSubjectAccent(test.name);
                  return (
                    <tr 
                      key={test.id} 
                      className="hover:bg-white/[0.02] cursor-pointer group transition-colors"
                      onClick={() => setSelectedTestGrit(test)}
                    >
                      <td className="py-3 pr-2">
                        <div className="font-semibold text-slate-200 group-hover:text-slate-50 text-xs truncate max-w-[180px] sm:max-w-[280px]">
                          {test.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-1.5 items-center">
                          <span>Logged: {test.date}</span>
                          {test.examYear && (
                            <span className="text-[#00F0FF] bg-[#00F0FF]/5 px-1 rounded border border-[#00F0FF]/10 text-[9px] font-bold">
                              {test.examSeries} {test.examYear}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell text-slate-400">
                        <span className="bg-slate-900 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">
                          {test.classification}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-300">
                        <span className="font-bold">{test.rawScore}</span>
                        <span className="text-slate-500"> / {test.totalMaxPoints}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-bold text-xs ${test.percentage >= 90 ? "text-[#00FF66]" : test.percentage < 70 ? "text-[#FF0055]" : "text-[#FFEA00]"}`}>
                          {test.percentage}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button 
                          id={`btn-grit-log-${test.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTestGrit(test);
                          }}
                          className="text-slate-400 hover:text-[#00F0FF] p-1 bg-white/5 hover:bg-[#00F0FF]/15 border border-white/5 rounded transition-all inline-flex items-center justify-center"
                          title="View Grit Log Commentary"
                        >
                          <Eye size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Dynamic Subject Loading Bars */}
        <div className="border border-white/5 bg-[#12121A]/60 backdrop-blur-md rounded-lg p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF66]/30 to-transparent" />
          
          <h3 className="text-md font-mono font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Award className="text-[#00FF66]" size={16} />
            DIAGNOSTIC CRITERIA SYSTEM INDEX
          </h3>

          <div className="space-y-4">
            {subjectAverages.map(({ subject, percentage }) => {
              const theme = getSubjectAccent(subject);
              const isLow = percentage < 70;
              const isHigh = percentage >= 90;

              return (
                <div key={subject} className="font-mono">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${theme.textClass} bg-current`} />
                      <span className="font-bold text-slate-200">{subject}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLow && (
                        <span className="text-[9px] uppercase font-bold text-[#FF0055] bg-[#FF0055]/10 border border-[#FF0055]/30 px-1.5 py-0.5 rounded animate-pulse">
                          [WARNING: CONCEPT GAP]
                        </span>
                      )}
                      {isHigh && (
                        <span className="text-[9px] uppercase font-bold text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(0,255,102,0.15)]">
                          [SYSTEM MASTERED]
                        </span>
                      )}
                      {!isLow && !isHigh && (
                        <span className="text-[9px] uppercase font-bold text-[#FFEA00] bg-[#FFEA00]/10 border border-[#FFEA00]/30 px-1.5 py-0.5 rounded">
                          [STABLE CRITERIA]
                        </span>
                      )}
                      <span className={`font-bold ${isHigh ? "text-[#00FF66]" : isLow ? "text-[#FF0055]" : "text-[#FFEA00]"}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progressive bar container */}
                  <div className="w-full bg-[#0A0A0F]/80 border border-white/5 h-2.5 rounded-sm relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full absolute left-0 top-0 transition-all rounded-sm ${
                        isLow 
                          ? "bg-gradient-to-r from-red-700 to-[#FF0055] shadow-[0_0_5px_rgba(255,0,85,0.4)]" 
                          : isHigh 
                          ? "bg-gradient-to-r from-green-500 to-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.4)]" 
                          : "bg-gradient-to-r from-yellow-500 to-[#FFEA00]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Mistake Vault with Glitch Comparative view (5/12 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        <div className="border border-white/5 bg-[#12121A]/60 backdrop-blur-md rounded-lg p-5 relative overflow-hidden flex-1">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#FF0055]/30" />
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h3 className="text-md font-mono font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="text-[#FF0055]" size={16} />
              MISTAKE NOTEBOOK VAULT
            </h3>

            <button
              onClick={() => setShowMistakeForm(!showMistakeForm)}
              className="px-2.5 py-1 rounded bg-[#FF0055]/10 text-[#FF0055] border border-[#FF0055]/30 font-mono text-[10px] hover:bg-[#FF0055]/25 transition-all uppercase flex items-center gap-1.5"
            >
              <Plus size={12} />
              {showMistakeForm ? "Cancel Add" : "File Case"}
            </button>
          </div>

          {/* Form to log a new core mistake */}
          <AnimatePresence>
            {showMistakeForm && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleMistakeSubmit}
                className="mb-6 p-4 bg-[#0A0A0F] border border-[#FF0055]/25 rounded-md overflow-hidden space-y-3 font-mono text-xs"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-1 text-[#FF0055]">
                  <AlertTriangle size={14} className="animate-pulse" />
                  <span className="font-bold text-[10px] uppercase">File Structural Core Slip</span>
                </div>

                <div>
                  <label className="text-slate-500 block text-[9px] uppercase mb-1">Select Subject</label>
                  <select 
                    value={mSubject}
                    onChange={(e) => setMSubject(e.target.value as SubjectId)}
                    className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none focus:border-[#FF0055]"
                  >
                    <option value="Math">Maths / Calculus</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block text-[9px] uppercase mb-1">Mistake/Gap Description</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Lenz sign exclusion on induction current proofs."
                    value={mDesc}
                    onChange={(e) => setMDesc(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-amber-500 block text-[9px] uppercase mb-1">Incorrect Processing Path [Wrong Syntax]</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="Describe how you originally solved it (e.g. slope m = Ea / R)..."
                    value={mWrong}
                    onChange={(e) => setMWrong(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none text-[10px]"
                  />
                </div>

                <div>
                  <label className="text-[#00FF66] block text-[9px] uppercase mb-1">Corrected Analytical Workflow [Precise Logic]</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="Describe the real verified physical/mathematical proof sequence..."
                    value={mCorrect}
                    onChange={(e) => setMCorrect(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 text-slate-200 rounded p-2 focus:outline-none text-[10px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingMistake}
                  className="w-full bg-[#FF0055]/20 border border-[#FF0055] text-[#FF0055] p-2 hover:bg-[#FF0055]/30 rounded font-bold uppercase tracking-wider text-[10px]"
                >
                  {submittingMistake ? "FILING LOG..." : "ARCHIVE STRUCTURAL GAP"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Mistakes List */}
          <div className="space-y-4">
            {mistakes.map((m) => {
              const theme = getSubjectAccent(m.subject);
              const isExpanded = !!expandedMistakeIds[m.id];
              return (
                <div 
                  key={m.id}
                  className={`border transition-all rounded-md p-3 select-none flex flex-col justify-between ${
                    m.resolved 
                      ? "border-[#00FF66]/20 bg-[#00FF66]/3" 
                      : "border-white/5 bg-[#0A0A0F]/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded ${theme.glowClass} ${theme.textClass} uppercase font-mono`}>
                        {m.subject}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {m.id}</span>
                    </div>

                    <button
                      onClick={() => onResolveMistake(m.id)}
                      className={`font-mono text-[9px] border px-2 py-0.5 rounded transition-all uppercase font-black ${
                        m.resolved 
                          ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66]"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-[#FF0055]/55 hover:text-[#FF0055]"
                      }`}
                    >
                      {m.resolved ? "RESOLVED" : "MARK REVIEWED"}
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => toggleMistakeExpand(m.id)}>
                    <div className="flex-1 font-mono">
                      <p className="text-xs font-bold text-slate-200">{m.description}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Filed date: {m.dateAdded}</p>
                    </div>
                    <button className="text-slate-500 mt-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expanded detailed wireframe comparison view (Glitch FX wrapper) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 pt-3 border-t border-white/5 font-mono text-[11px] grid grid-cols-1 gap-3"
                      >
                        {/* WRONG APPROACH */}
                        <div className="bg-[#FF0055]/5 border border-[#FF0055]/30 p-3 rounded">
                          <span className="text-[#FF0055] text-[9px] uppercase font-black tracking-widest block mb-1">
                            {"[INCORRECT PROCESSING PATH]"}
                          </span>
                          <pre className="whitespace-pre-wrap text-[10px] leading-relaxed text-slate-350 bg-[#020205] p-2 rounded border border-white/5 text-[#E2E8F0] font-mono select-text">
                            {m.wrongApproach}
                          </pre>
                        </div>

                        {/* CORRECTED ACTION PATH */}
                        <div className="bg-[#00FF66]/5 border border-[#00FF66]/30 p-3 rounded">
                          <span className="text-[#00FF66] text-[9px] uppercase font-black tracking-widest block mb-1">
                            {"[CORRECTED ANALYTICAL WORKFLOW]"}
                          </span>
                          <pre className="whitespace-pre-wrap text-[10px] leading-relaxed text-slate-100 bg-[#020205] p-2 rounded border border-white/5 text-[#E2E8F0] font-mono select-text">
                            {m.correctedSequence}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* DETACHED PERSISTENT GRIT LOG SIDEBAR DRAWER (Absolute Overlay) */}
      <AnimatePresence>
        {selectedTestGrit && (
          <div className="fixed inset-0 z-50 flex justify-end select-none">
            {/* Backdrop lock */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTestGrit(null)}
              className="absolute inset-0 bg-[#000]/80"
            />

            {/* Drawer body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md h-full bg-[#0A0A0F] border-l border-white/10 p-6 flex flex-col justify-between font-mono z-10 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Terminal className="text-[#00F0FF] animate-pulse" size={16} />
                    <span className="text-xs font-bold uppercase text-[#00F0FF]">GRIT REFLECTION LOGGER</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTestGrit(null)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 block">Assessment Target:</span>
                    <h4 className="text-md font-bold text-slate-100 mt-1">{selectedTestGrit.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white/5 p-3 rounded border border-white/5">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Evaluation Type</span>
                      <div className="text-xs font-bold text-slate-350">{selectedTestGrit.classification}</div>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Score Achieved</span>
                      <div className="text-xs font-bold text-[#FFEA00]">
                        {selectedTestGrit.rawScore} / {selectedTestGrit.totalMaxPoints} ({selectedTestGrit.percentage}%)
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] color-[#FF0055] text-amber-500 uppercase font-black tracking-widest block mb-2">
                      {"[ANALYTICAL REFLECTION LOG]"}
                    </span>
                    <div className="bg-[#12121A] text-slate-300 border border-white/10 p-4 rounded text-xs leading-relaxed select-text font-mono whitespace-pre-line min-h-[160px]">
                      {selectedTestGrit.gritLog}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-[9px] text-slate-600 block mb-2 text-center uppercase">
                  Telemetry verification cycle: OK // PORTFOLIO STREAK ACTIVE
                </div>
                <button
                  onClick={() => setSelectedTestGrit(null)}
                  className="w-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] py-2 hover:bg-[#00F0FF]/25 rounded text-xs font-bold uppercase transition-all"
                >
                  DISMISS LOG DRAWER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
