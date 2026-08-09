import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  User, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Key, 
  GraduationCap, 
  Edit3,
  Lock,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { SubjectConfig, OnboardingConfig } from "../types";
import { AS_SUBJECT_PRESETS, A_SUBJECT_PRESETS } from "./OnboardingWizard";

interface ProfileSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  config: OnboardingConfig;
  token: string;
  onUpdateSubjects: (newSubjects: SubjectConfig[], newUsername?: string, newLevel?: string) => void;
}

export default function ProfileSubjectModal({
  isOpen,
  onClose,
  username: currentUsername,
  config,
  token,
  onUpdateSubjects
}: ProfileSubjectModalProps) {
  const [activeTab, setActiveTab] = useState<"ACADEMICS" | "PASSWORD">("ACADEMICS");

  // Profile Edit States
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [academicLevel, setAcademicLevel] = useState<"AS LEVEL" | "A LEVEL" | "AS & A LEVEL">(
    (config?.subVariant as any) || "AS LEVEL"
  );
  const [subjects, setSubjects] = useState<SubjectConfig[]>(config.subjects || []);

  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // General States
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add Subject Sub-Modal
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  if (!isOpen) return null;

  const handleRemoveSubject = (name: string) => {
    if (subjects.length <= 1) {
      setErrorMsg("You must maintain at least 1 enrolled subject profile.");
      return;
    }
    setSubjects(prev => prev.filter(s => s.name !== name));
    setErrorMsg(null);
  };

  const handleAddPreset = (preset: SubjectConfig) => {
    if (subjects.some(s => s.name === preset.name)) {
      setErrorMsg(`Subject "${preset.name}" is already enrolled.`);
      return;
    }
    setSubjects(prev => [...prev, preset]);
    setShowAddSubject(false);
    setErrorMsg(null);
  };

  const handleLoadLevelDefaults = (level: "AS LEVEL" | "A LEVEL") => {
    const presets = level === "AS LEVEL" ? AS_SUBJECT_PRESETS : A_SUBJECT_PRESETS;
    setSubjects(presets);
    setAcademicLevel(level);
    setErrorMsg(null);
    setSuccessMsg(`Loaded default CIE ${level} preset subjects!`);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleAddCustomSubject = () => {
    if (!newSubjectName.trim()) return;
    const name = newSubjectName.trim();
    if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setErrorMsg("Subject already exists.");
      return;
    }
    const custom: SubjectConfig = {
      name,
      components: [
        { name: "Paper 1 (Theory)", maxMarks: 75 },
        { name: "Paper 2 (Problem Solving)", maxMarks: 75 }
      ],
      totalMark: 150,
      totalPaperTarget: 30,
      yearRangeStart: 2022,
      yearRangeEnd: 2026,
      series: ["May/June", "Oct/Nov"],
      chronologicalRule: [2025, 2026, 2024],
      componentSequence: ["Paper 1 (Theory)", "Paper 2 (Problem Solving)"],
      completedTopics: []
    };
    setSubjects(prev => [...prev, custom]);
    setNewSubjectName("");
    setShowAddSubject(false);
    setErrorMsg(null);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/profile/update-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: usernameInput.trim(),
          subVariant: academicLevel,
          subjects
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed updating profile details.");

      setSuccessMsg("Profile details, academic level, and subjects updated successfully!");
      
      // Update local storage token if username changed
      if (data.username && data.username !== currentUsername) {
        localStorage.setItem("study_username", data.username);
      }

      onUpdateSubjects(subjects, data.username || usernameInput, academicLevel);

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSaving(true);
    setPwdError(null);
    setPwdSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError("All password fields are required.");
      setPwdSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError("New password and confirmation do not match.");
      setPwdSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters long.");
      setPwdSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed changing password.");

      setPwdSuccess(data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdError(err.message || "Password change failed.");
    } finally {
      setPwdSaving(false);
    }
  };

  const allAvailablePresets = (academicLevel === "A LEVEL" ? A_SUBJECT_PRESETS : AS_SUBJECT_PRESETS);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#12121A] border border-white/10 rounded-2xl p-6 font-mono text-slate-200 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                  STUDENT PROFILE & ACADEMIC LEVEL
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                  CIE AS / A LEVEL ENROLLMENT & SECURITY
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <button
              onClick={() => setActiveTab("ACADEMICS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "ACADEMICS"
                  ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap size={14} /> Academic Level & Subjects
            </button>
            <button
              onClick={() => setActiveTab("PASSWORD")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "PASSWORD"
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Key size={14} /> Change Password
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
              <Check size={14} />
              {successMsg}
            </div>
          )}

          {/* Main Tab Views */}
          <div className="overflow-y-auto space-y-5 pr-1 flex-1">
            {activeTab === "ACADEMICS" ? (
              <>
                {/* Username & Level Card */}
                <div className="bg-[#0A0A0F] border border-white/5 p-4 rounded-xl space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Username Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                        <Edit3 size={11} className="text-purple-400" /> Candidate Username
                      </label>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Your username"
                        className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400 font-mono text-xs"
                      />
                    </div>

                    {/* Academic Level Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                        <GraduationCap size={11} className="text-[#00F0FF]" /> Academic Level
                      </label>
                      <select
                        value={academicLevel}
                        onChange={(e: any) => setAcademicLevel(e.target.value)}
                        className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-[#00F0FF] font-mono text-xs"
                      >
                        <option value="AS LEVEL">AS LEVEL (Year 12)</option>
                        <option value="A LEVEL">A LEVEL (Year 13 / Complete)</option>
                        <option value="AS & A LEVEL">AS & A LEVEL (Combined)</option>
                      </select>
                    </div>
                  </div>

                  {/* Level Transition Alert Banner */}
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-purple-300">
                    <div>
                      <span className="font-bold uppercase block">Moving from AS to A Level?</span>
                      <span className="text-[10px] text-slate-400">Quickly align your enrolled subjects to default level syllabus presets.</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadLevelDefaults("AS LEVEL")}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-bold uppercase transition-all"
                      >
                        Load AS Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadLevelDefaults("A LEVEL")}
                        className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 rounded text-[10px] font-bold uppercase transition-all"
                      >
                        Load A-Level Presets
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enrolled Subjects Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                      <BookOpen size={14} className="text-purple-400" />
                      ENROLLED SUBJECTS & PAPERS ({subjects.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddSubject(true)}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:bg-purple-500/25 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={13} /> ADD SUBJECT
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {subjects.map((subj, index) => (
                      <div
                        key={subj.name + index}
                        className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-100 flex items-center gap-2">
                            <span>{subj.name}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                              {subj.components.length} Components / {subj.totalMark} Total Marks
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-3">
                            <span>Series: {subj.series.join(", ")}</span>
                            <span>•</span>
                            <span>Target Papers: {subj.totalPaperTarget}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subj.name)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Remove subject"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Subject Sub-Tray */}
                {showAddSubject && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#0A0A0F] border border-purple-500/30 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-purple-400 uppercase">
                        Select Preset or Create Custom CIE Subject
                      </span>
                      <button
                        onClick={() => setShowAddSubject(false)}
                        className="text-slate-500 hover:text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div>
                      <label className="text-[9.5px] text-slate-400 uppercase block mb-2">Available Presets:</label>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-white/5 rounded-lg bg-black/20">
                        {allAvailablePresets.map((preset) => {
                          const isEnrolled = subjects.some(s => s.name === preset.name);
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              disabled={isEnrolled}
                              onClick={() => handleAddPreset(preset)}
                              className={`px-2.5 py-1 rounded text-[10px] border transition-all cursor-pointer ${
                                isEnrolled
                                  ? "bg-white/5 text-slate-600 border-white/5 cursor-not-allowed opacity-50"
                                  : "bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/25"
                              }`}
                            >
                              + {preset.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <label className="text-[9.5px] text-slate-400 uppercase block">Or Custom CIE Subject:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Subject Name (e.g., Biology 9700)"
                          value={newSubjectName}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSubject}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              /* Password Tab */
              <form onSubmit={handleChangePassword} className="space-y-4 bg-[#0A0A0F] border border-white/5 p-5 rounded-xl text-xs font-mono">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Lock className="text-amber-400" size={16} />
                  <span className="font-bold text-slate-100 uppercase">Change Account Password</span>
                </div>

                {pwdError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs">
                    {pwdError}
                  </div>
                )}
                {pwdSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
                    <Check size={14} />
                    {pwdSuccess}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block">Current (Old) Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-lg mt-2"
                >
                  {pwdSaving ? "VERIFYING & UPDATING..." : "UPDATE PASSWORD SECURITY"}
                </button>
              </form>
            )}
          </div>

          {/* Action Footer for Academics Tab */}
          {activeTab === "ACADEMICS" && (
            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
              <span className="text-[10px] text-slate-500 uppercase">
                Changes dynamically update dashboard, schedules & matrix algorithms.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/25"
                >
                  {saving ? "SAVING CHANGES..." : "SAVE PROFILE DETAILS"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
