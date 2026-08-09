import React, { useState, useRef, useEffect } from "react";
import { 
  X, Bot, Sparkles, Send, Upload, Image as ImageIcon, Trash2, 
  Copy, Check, RefreshCw, Cpu, BookOpen, HelpCircle, Lightbulb, 
  Layers, MessageSquare, Zap
} from "lucide-react";
import { SubjectConfig } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  imagePreview?: string;
  modelUsed?: string;
}

interface GeminiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSubjects?: SubjectConfig[];
  token?: string | null;
}

const SYSTEM_ROLES = [
  {
    id: "cie_examiner",
    title: "CIE Senior Examiner",
    desc: "Provides official Cambridge mark-scheme key words, deduction rules, and exact phrasing.",
    sysInst: "You are a Chief Cambridge Assessment International Education (CIE) Senior Examiner for A/AS Levels. You evaluate student answers using official mark schemes, identify missing keywords (e.g. 'per unit time', 'delocalised electrons', 'conservation of momentum'), and explain exact grading criteria."
  },
  {
    id: "stem_solver",
    title: "Physics & Math Problem Solver",
    desc: "Step-by-step derivations, LaTeX formula breakdowns, and numerical unit checks.",
    sysInst: "You are a master STEM tutor for CIE A-Level Physics (9702), Chemistry (9701), and Mathematics (9709). Break down equations line-by-line, specify units at every step, highlight vector signs, and show step-by-step mathematical reasoning."
  },
  {
    id: "essay_coach",
    title: "English & CS Essay Coach",
    desc: "Structures 20-mark answers, essay frameworks, and algorithm pseudocode analysis.",
    sysInst: "You are an elite academic writing and computer science coach for CIE A-Level English General Paper (8021) and Computer Science (9618). Provide structured essay outlines, PEEL paragraph models, pseudocode checks, and analytical frameworks."
  },
  {
    id: "revision_mentor",
    title: "Revision & Active Recall Coach",
    desc: "Generates quiz questions, flashcards, and active recall study schedules.",
    sysInst: "You are a study efficiency coach specializing in spaced repetition and active recall. Generate quick 5-question micro-quizzes, active recall flashcard pairs, and memory hooks for tough syllabus topics."
  }
];

const MODEL_OPTIONS = [
  { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash (Recommended)", desc: "Optimal balance of accuracy, vision & speed" },
  { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash (General)", desc: "Fast general study assistant" },
  { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite (Fast)", desc: "Ultra-low latency for quick answers" },
  { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (Complex Reasoning)", desc: "Advanced multi-step reasoning & vision" }
];

export default function GeminiTutorModal({ isOpen, onClose, userSubjects = [], token }: GeminiTutorModalProps) {
  // Active Tab: "CHAT" | "IMAGE" | "QUICK_ASSIST"
  const [activeTab, setActiveTab] = useState<"CHAT" | "IMAGE" | "QUICK_ASSIST">("CHAT");

  // Selected Role & Model
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0].id);
  const [selectedModel, setSelectedModel] = useState("gemini-3.6-flash");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init_1",
      role: "assistant",
      text: "Hello Candidate! I am your **Saber Gemini AI Study Assistant**. I am tuned for CIE AS & A Level syllabus standards. Ask me to solve past paper questions, explain tough concepts, or review your study plan!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/png");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageAnalysisResult, setImageAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Handle Text Chat Submission
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputPrompt.trim();
    if (!textToSend || isGenerating) return;

    const userMsg: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputPrompt("");
    setIsGenerating(true);

    try {
      const activeRoleObj = SYSTEM_ROLES.find(r => r.id === selectedRole);
      
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          systemInstruction: activeRoleObj?.sysInst,
          model: selectedModel
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status} server error`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: "msg_" + (Date.now() + 1),
        role: "assistant",
        text: data.text || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.model || selectedModel
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Gemini Chat Error:", err);
      const errorMsg: Message = {
        id: "msg_err_" + Date.now(),
        role: "assistant",
        text: `⚠️ **AI Engine Error**: ${err.message || "Failed to reach Gemini API"}. Please check your connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Image Selection Handler
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMime(file.type || "image/png");
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Image Analysis Handler
  const handleAnalyzeImage = async () => {
    if (!selectedImage || isAnalyzingImage) return;

    setIsAnalyzingImage(true);
    setImageAnalysisResult(null);

    try {
      const res = await fetch("/api/gemini/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMime,
          prompt: imagePrompt || "Analyze this academic diagram / past paper snippet in detail with full mark scheme breakdown.",
          model: selectedModel === "gemini-3.1-pro-preview" ? "gemini-3.1-pro-preview" : "gemini-3.6-flash"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Image analysis failed");
      }

      const data = await res.json();
      setImageAnalysisResult(data.text);
    } catch (err: any) {
      console.error("Gemini Image Analysis Error:", err);
      setImageAnalysisResult(`⚠️ Error analyzing image: ${err.message || "Failed processing image with Gemini AI"}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeSubjectsList = userSubjects.map(s => s.name).join(", ") || "Physics, Chemistry, Mathematics";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-mono text-xs animate-in fade-in duration-200">
      <div className="bg-[#0A0A0F] border border-[#00F0FF]/30 w-full max-w-4xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-[#00F0FF]/10 relative">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-[#12121A] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00F0FF]/15 rounded-xl border border-[#00F0FF]/30 text-[#00F0FF]">
              <Bot size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black uppercase text-slate-100 tracking-wider">
                  SABER GEMINI AI TUTOR & VISION ANALYZER
                </h2>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-extrabold uppercase">
                  INTELLIGENCE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Cambridge AS & A Level syllabus coach // Active Subjects: <span className="text-[#00F0FF]">{activeSubjectsList}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
              title="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Controls & Role / Model Selectors */}
        <div className="p-3 bg-[#0E0E17] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] shrink-0">
          
          {/* Main Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#0A0A0F] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab("CHAT")}
              className={`px-3 py-1.5 rounded font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "CHAT"
                  ? "bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare size={13} />
              AI Chatbot
            </button>
            <button
              onClick={() => setActiveTab("IMAGE")}
              className={`px-3 py-1.5 rounded font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "IMAGE"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ImageIcon size={13} />
              Photo Analysis
            </button>
            <button
              onClick={() => setActiveTab("QUICK_ASSIST")}
              className={`px-3 py-1.5 rounded font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "QUICK_ASSIST"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap size={13} />
              Quick Prompts
            </button>
          </div>

          {/* Model & System Role Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[#12121A] px-2 py-1 rounded border border-white/10">
              <Cpu size={12} className="text-[#00F0FF]" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-slate-200 text-[10px] focus:outline-none cursor-pointer font-bold"
              >
                {MODEL_OPTIONS.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#12121A] text-slate-200">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === "CHAT" && (
              <div className="flex items-center gap-1 bg-[#12121A] px-2 py-1 rounded border border-white/10">
                <Bot size={12} className="text-purple-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-transparent text-purple-300 text-[10px] focus:outline-none cursor-pointer font-bold"
                >
                  {SYSTEM_ROLES.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#12121A] text-slate-200">
                      Role: {r.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: MULTI-TURN AI CHAT */}
        {activeTab === "CHAT" && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#07070F] overflow-hidden">
            {/* Scrollable Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-slate-500">
                    {m.role === "assistant" ? (
                      <span className="text-[#00F0FF] font-bold flex items-center gap-1">
                        <Bot size={11} /> SABER GEMINI AI
                      </span>
                    ) : (
                      <span className="text-slate-300 font-bold">CANDIDATE</span>
                    )}
                    <span>• {m.timestamp}</span>
                    {m.modelUsed && (
                      <span className="px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-mono text-[9px]">
                        {m.modelUsed}
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-mono relative group ${
                      m.role === "user"
                        ? "bg-[#00F0FF]/15 text-slate-100 border border-[#00F0FF]/30 rounded-tr-none"
                        : "bg-[#12121A] text-slate-200 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    <button
                      onClick={() => copyToClipboard(m.text, m.id)}
                      className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-black/60 rounded text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check size={12} className="text-[#00FF66]" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] p-3 bg-[#12121A] border border-[#00F0FF]/30 rounded-2xl max-w-xs animate-pulse">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Gemini is generating response...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#12121A] border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Gemini anything (e.g. 'Explain Le Chatelier\'s principle in Chemistry 9701')..."
                disabled={isGenerating}
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00F0FF] font-mono"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isGenerating}
                className="px-4 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/80 disabled:opacity-40 text-black font-black uppercase rounded-xl flex items-center gap-2 text-xs transition-all cursor-pointer shrink-0"
              >
                <Send size={14} />
                Send
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: PHOTO / IMAGE ANALYSIS */}
        {activeTab === "IMAGE" && (
          <div className="flex-1 p-4 bg-[#07070F] overflow-y-auto space-y-4">
            <div className="border border-white/10 bg-[#12121A] p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="text-purple-400" size={15} />
                    CIE PAST PAPER & DIAGRAM VISION ANALYZER
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Upload a snippet of a past paper question, handwritten working, or diagram for instant Gemini vision feedback.
                  </p>
                </div>

                {selectedImage && (
                  <button
                    onClick={() => { setSelectedImage(null); setImageAnalysisResult(null); }}
                    className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> Clear Image
                  </button>
                )}
              </div>

              {/* File Dropzone or Preview */}
              {!selectedImage ? (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-purple-400/50 bg-[#0A0A0F] p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-2 group"
                >
                  <Upload size={28} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">Click to upload image or photo snippet</span>
                  <span className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP past paper questions or handwritten notes</span>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image Preview */}
                  <div className="border border-white/10 bg-[#0A0A0F] rounded-xl p-2 relative flex items-center justify-center min-h-[200px] max-h-[350px] overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Uploaded Past Paper Snippet"
                      className="max-h-[330px] w-auto object-contain rounded"
                    />
                  </div>

                  {/* Analysis Controls */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 block">
                        Analysis Prompt / Instructions
                      </label>
                      <textarea
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="e.g. 'Solve this past paper question step-by-step and show mark scheme criteria' or 'Check if my handwritten proof is correct'"
                        rows={4}
                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-mono resize-none"
                      />
                    </div>

                    <button
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzingImage}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-purple-500/20"
                    >
                      {isAnalyzingImage ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Analyzing Image with Gemini Vision...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          Analyze Image with Gemini
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Result Output Box */}
            {imageAnalysisResult && (
              <div className="border border-purple-500/30 bg-[#12121A] p-4 rounded-xl space-y-2 relative group">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-black text-purple-300 uppercase flex items-center gap-1.5">
                    <Sparkles size={14} className="text-purple-400" />
                    GEMINI VISION ANALYSIS RESULT
                  </span>
                  <button
                    onClick={() => copyToClipboard(imageAnalysisResult, "img_res")}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === "img_res" ? <Check size={12} className="text-[#00FF66]" /> : <Copy size={12} />}
                    Copy Result
                  </button>
                </div>

                <div className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {imageAnalysisResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: QUICK ACADEMIC ASSISTS */}
        {activeTab === "QUICK_ASSIST" && (
          <div className="flex-1 p-4 bg-[#07070F] overflow-y-auto space-y-4">
            <div className="border border-white/10 bg-[#12121A] p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Zap className="text-emerald-400" size={15} />
                ONE-CLICK ACADEMIC PROMPTS
              </h3>
              <p className="text-[10px] text-slate-400">
                Click any pre-crafted prompt to launch a targeted Gemini analysis immediately:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    title: "Physics 9702: Derivation Check",
                    prompt: "Explain how to derive the double-slit interference equation λ = ax/D for CIE Physics 9702 with ray diagrams and assumptions."
                  },
                  {
                    title: "Chemistry 9701: Organic Mechanisms",
                    prompt: "Summarize the key reaction mechanisms for halogenoalkanes (Nucleophilic Substitution SN1 vs SN2) including curly arrows and rate equations."
                  },
                  {
                    title: "Math 9709: Integration by Parts",
                    prompt: "Show step-by-step how to solve ∫ x * e^(2x) dx using Integration by Parts for A-Level Mathematics 9709."
                  },
                  {
                    title: "Computer Science 9618: Binary Trees",
                    prompt: "Provide pseudocode for in-order, pre-order, and post-order binary tree traversal for CIE CS 9618 Paper 2."
                  },
                  {
                    title: "Active Recall Micro-Quiz",
                    prompt: "Generate a 5-question multiple choice micro-quiz on A-Level Physics Waves and Superposition with detailed mark scheme explanations."
                  },
                  {
                    title: "Past Paper Exam Time Strategy",
                    prompt: "Provide a time-management allocation strategy for answering a 1-hour 15-minute CIE AS Chemistry Paper 2 structured paper."
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab("CHAT");
                      handleSendMessage(undefined, item.prompt);
                    }}
                    className="p-3 bg-[#0A0A0F] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 rounded-xl text-left transition-all cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                        {item.title}
                      </span>
                      <Zap size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 font-mono">
                      "{item.prompt}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
