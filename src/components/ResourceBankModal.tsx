import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Upload, 
  Download, 
  Eye, 
  FileText, 
  Trash2, 
  Plus, 
  Folder, 
  ExternalLink, 
  Filter, 
  Search,
  BookOpen,
  Cloud,
  Layers,
  Check,
  HardDrive
} from "lucide-react";
import { SubjectConfig } from "../types";

export interface ResourceItem {
  id: string;
  title: string;
  subject: string;
  category: "Syllabus Spec" | "Formula Sheet" | "Topical Index" | "Notes" | "Past Paper" | "Mark Scheme";
  url?: string;
  notes?: string;
  fileData?: string;
  dateAdded?: string;
}

interface ResourceBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSubjects: SubjectConfig[];
  token: string;
}

export default function ResourceBankModal({
  isOpen,
  onClose,
  userSubjects,
  token
}: ResourceBankModalProps) {
  const [activeTab, setActiveTab] = useState<"BUILTIN" | "USER_DRIVE">("BUILTIN");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // User drive state
  const [userResources, setUserResources] = useState<ResourceItem[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form upload state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubject, setUploadSubject] = useState(userSubjects[0]?.name || "General");
  const [uploadCategory, setUploadCategory] = useState<ResourceItem["category"]>("Notes");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadFileData, setUploadFileData] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Preview item state
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserDrive();
    }
  }, [isOpen]);

  const fetchUserDrive = async () => {
    setLoadingDrive(true);
    try {
      const res = await fetch("/api/resources/user-drive", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserResources(data);
      }
    } catch (err) {
      console.error("Failed fetching user drive", err);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setUploadFileData(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadSubject) return;

    setUploading(true);
    try {
      const res = await fetch("/api/resources/user-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: uploadTitle.trim(),
          subject: uploadSubject,
          category: uploadCategory,
          url: uploadUrl.trim(),
          notes: uploadNotes.trim(),
          fileData: uploadFileData || undefined
        })
      });

      if (!res.ok) throw new Error("Upload failed.");
      const newRes = await res.json();

      setUserResources(prev => [newRes, ...prev]);
      setUploadTitle("");
      setUploadUrl("");
      setUploadNotes("");
      setUploadFileData(null);
      setShowUploadForm(false);
    } catch (err: any) {
      alert("Error saving resource: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Delete this resource from your user vault?")) return;
    try {
      const res = await fetch(`/api/resources/user-drive/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUserResources(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      alert("Failed deleting resource.");
    }
  };

  if (!isOpen) return null;

  const MASTER_DRIVE_URL = "https://drive.google.com/drive/folders/1Fjeerw9H5fZJU4zB7XTgoh5QfnY_9y7N?usp=drive_link";

  const builtInFolders = [
    {
      subject: "Biology (9700)",
      description: "Cell Structure, Biological Molecules, Genetics & Physiology Notes and Question Banks",
      itemsCount: "105 Files",
      color: "border-emerald-500/30 text-emerald-400",
      url: "https://drive.google.com/drive/folders/1toWTeGfdC047WpPvlDya91f_tOWvROzn?usp=drive_link"
    },
    {
      subject: "Chemistry (9701)",
      description: "Organic & Physical Chemistry Revision Notes, Mark Schemes & Past Papers (2022-2026)",
      itemsCount: "124 Files",
      color: "border-[#FFEA00]/30 text-[#FFEA00]",
      url: "https://drive.google.com/drive/folders/116D3NjCZO7FYR5vA13_z-YA_LbDb2ict?usp=drive_link"
    },
    {
      subject: "Physics (9702)",
      description: "Formula Sheet, Practical Paper 3 Guides, Mechanics & Quantum Physics Question Packs",
      itemsCount: "98 Files",
      color: "border-[#00FF66]/30 text-[#00FF66]",
      url: "https://drive.google.com/drive/folders/18MRhxbgOatfYbE6TAy12J0x0LxRS6Pku?usp=drive_link"
    },
    {
      subject: "Computer Science (9618)",
      description: "Paper 1 Theory Notes, Paper 2 Algorithm Solvers, Paper 3 & 4 Code Samples",
      itemsCount: "110 Files",
      color: "border-[#00F0FF]/30 text-[#00F0FF]",
      url: "https://drive.google.com/drive/folders/1PjaTIRE_zPOV1yLNA7nEOGXPk25oKFoM?usp=drive_link"
    },
    {
      subject: "Mathematics (9709)",
      description: "Pure Mathematics 1 & 3, Mechanics, Probability & Statistics Worked Solutions",
      itemsCount: "145 Files",
      color: "border-purple-500/30 text-purple-400",
      url: "https://drive.google.com/drive/folders/1p0YlgUTdgjGcrchSbGZ1GKprPjQy4mNG?usp=drive_link"
    },
    {
      subject: "English General Paper (8021)",
      description: "Essay Models, High-Score Exemplars, Vocabulary Lists & Reading Comprehension Guidelines",
      itemsCount: "65 Files",
      color: "border-pink-500/30 text-pink-400",
      url: "https://drive.google.com/drive/folders/1U11aTni0_FxRI4pj3JOT_1EUj4vejlP1?usp=drive_link"
    }
  ];

  const filteredUserResources = userResources.filter(r => {
    const matchesSubject = selectedSubject === "ALL" || r.subject === selectedSubject;
    const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl bg-[#12121A] border border-white/10 rounded-2xl p-6 font-mono text-slate-200 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
                <HardDrive size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  CIE CLOUD DRIVE RESOURCE VAULT
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                  BUILT-IN RESOURCE BANK & PERSONAL USER DRIVE
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

          {/* Sub Tab Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex gap-2 bg-[#0A0A0F] border border-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("BUILTIN")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "BUILTIN"
                    ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Folder size={14} /> Built-in Resource Bank
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("USER_DRIVE")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "USER_DRIVE"
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Cloud size={14} /> User Resource Bank ({userResources.length})
              </button>
            </div>

            {activeTab === "USER_DRIVE" && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="bg-[#0A0A0F] border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                  <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                </div>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-[#0A0A0F] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Subjects</option>
                  {userSubjects.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tab 1: Built-in Resource Bank */}
          <div className="overflow-y-auto space-y-4 pr-1 flex-1">
            {activeTab === "BUILTIN" ? (
              <div className="space-y-4">
                
                {/* Master Google Drive Hero Link Card */}
                <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-[#0A0A0F] border border-blue-500/30 p-5 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[9px] font-black uppercase tracking-wider">
                        MASTER CLOUD DRIVE
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                      CAMBRIDGE CIE OFFICIAL RESOURCE REPOSITORY
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl font-mono">
                      Access all subject folders, past paper banks, mark schemes, and topic notes directly inside our central Google Drive storage.
                    </p>
                  </div>

                  <a
                    href={MASTER_DRIVE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <ExternalLink size={14} /> Open Master Google Drive Bank
                  </a>
                </div>

                {/* Built-in Folder Cards Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Folder size={14} className="text-[#00F0FF]" />
                    SUBJECT RESOURCE FOLDERS
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {builtInFolders.map((folder, idx) => (
                      <div
                        key={idx}
                        className={`bg-[#0A0A0F] border ${folder.color} p-4 rounded-xl space-y-2 hover:bg-[#12121A] transition-all relative overflow-hidden flex flex-col justify-between`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-extrabold text-slate-100 uppercase text-xs flex items-center gap-1.5">
                              <Folder size={14} /> {folder.subject}
                            </h5>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                              {folder.itemsCount}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-mono">
                            {folder.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] text-slate-500 uppercase">SYNCHRONIZED WITH MASTER DRIVE</span>
                          <a
                            href={folder.url || MASTER_DRIVE_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-[#00F0FF] hover:underline flex items-center gap-1 font-bold"
                          >
                            Explore Folder <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2 font-mono">
                  <span className="font-bold uppercase">Notice:</span>
                  <span>More subject resources are being updated and will be available here soon.</span>
                </div>

              </div>
            ) : (
              /* Tab 2: User Resource Bank */
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                    <Cloud size={14} className="text-purple-400" />
                    YOUR PERSONAL CLOUD RESOURCE BANK
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    <Plus size={14} /> {showUploadForm ? "Close Form" : "Upload / Add Link"}
                  </button>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleUploadSubmit}
                    className="bg-[#0A0A0F] border border-purple-500/30 p-4 rounded-xl space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-bold block">Document Title</label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="e.g. Organic Chem Summary Notes"
                          required
                          className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-bold block">Subject</label>
                        <select
                          value={uploadSubject}
                          onChange={(e) => setUploadSubject(e.target.value)}
                          className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none"
                        >
                          {userSubjects.map(s => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                          ))}
                          <option value="General">General/Other</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-bold block">Category</label>
                        <select
                          value={uploadCategory}
                          onChange={(e: any) => setUploadCategory(e.target.value)}
                          className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none"
                        >
                          <option value="Notes">Notes</option>
                          <option value="Past Paper">Past Paper</option>
                          <option value="Mark Scheme">Mark Scheme</option>
                          <option value="Formula Sheet">Formula Sheet</option>
                          <option value="Syllabus Spec">Syllabus Spec</option>
                          <option value="Topical Index">Topical Index</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-bold block">Google Drive / Resource URL (Optional)</label>
                        <input
                          type="url"
                          value={uploadUrl}
                          onChange={(e) => setUploadUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-bold block">Upload File (PDF/Img/Txt - Max 5MB)</label>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                          onChange={handleFileUploadChange}
                          className="w-full bg-[#12121A] border border-white/10 rounded-lg p-1.5 text-slate-400 text-[10px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] text-slate-400 uppercase font-bold block">Notes / Description</label>
                      <textarea
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                        placeholder="Brief summary or topic notes..."
                        rows={2}
                        className="w-full bg-[#12121A] border border-white/10 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="px-3 py-1.5 border border-white/10 text-slate-400 rounded-lg hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold uppercase"
                      >
                        {uploading ? "SAVING..." : "SAVE TO VAULT"}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Resource Item Cards */}
                {loadingDrive ? (
                  <div className="text-center py-10 text-slate-500 font-mono">Loading user resource bank...</div>
                ) : filteredUserResources.length === 0 ? (
                  <div className="text-center py-12 bg-[#0A0A0F] border border-white/5 rounded-2xl space-y-2">
                    <Cloud className="mx-auto text-slate-600" size={32} />
                    <p className="text-slate-400 text-xs font-mono">Your user resource bank is empty.</p>
                    <p className="text-[10px] text-slate-500">Upload notes, past paper files, or store Google Drive links here for instant access.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredUserResources.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all text-xs"
                      >
                        <div className="space-y-1 flex-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-100">{item.title}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase font-bold">
                              {item.category}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                              {item.subject}
                            </span>
                          </div>
                          {item.notes && <p className="text-[10.5px] text-slate-400 font-mono">{item.notes}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"
                            >
                              <ExternalLink size={12} /> Link
                            </a>
                          )}

                          {item.fileData && (
                            <button
                              onClick={() => setPreviewItem(item)}
                              className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> View
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteResource(item.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Inline File Preview Modal */}
          {previewItem && (
            <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
              <div className="bg-[#12121A] border border-white/15 rounded-2xl p-4 w-full max-w-2xl space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-bold text-slate-100">{previewItem.title}</span>
                  <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-2 bg-black rounded border border-white/5">
                  {previewItem.fileData?.startsWith("data:image/") ? (
                    <img src={previewItem.fileData} alt={previewItem.title} className="max-w-full rounded mx-auto" />
                  ) : (
                    <iframe src={previewItem.fileData} title={previewItem.title} className="w-full h-96 rounded" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9.5px] text-slate-500 uppercase">
              MASTER GOOGLE DRIVE LINK & USER CLOUD STORAGE ARE SYNCHRONIZED
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-black uppercase text-xs transition-all cursor-pointer shadow-lg shadow-[#00F0FF]/20"
            >
              CLOSE CLOUD DRIVE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
