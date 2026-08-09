import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import AuthScreen from "./components/AuthScreen";
import OnboardingWizard from "./components/OnboardingWizard";

// Fully modular phase panels matching student schedules
import ScoreboardPanel from "./components/ScoreboardPanel";
import RoadmapVisualizer from "./components/RoadmapVisualizer";
import Phase1Panel from "./components/Phase1Panel";
import Phase2Panel from "./components/Phase2Panel";
import Phase3Panel from "./components/Phase3Panel";
import PreExamPanel from "./components/PreExamPanel";
import ExamPhasePanel from "./components/ExamPhasePanel";
import GlobalExamCountdown from "./components/GlobalExamCountdown";
import StudyBeatsPlayer from "./components/StudyBeatsPlayer";

// Portal Feature Modals
import ProfileSubjectModal from "./components/ProfileSubjectModal";
import ResourceBankModal from "./components/ResourceBankModal";
import SettingsModal from "./components/SettingsModal";
import UserGuideModal from "./components/UserGuideModal";
import StudySessionTimerModal from "./components/StudySessionTimerModal";
import GeminiTutorModal from "./components/GeminiTutorModal";
import GoogleTasksModal from "./components/GoogleTasksModal";
import WalkthroughPromptModal from "./components/WalkthroughPromptModal";
import ThemeSelector from "./components/ThemeSelector";
import ThemeOverlay from "./components/ThemeOverlay";
import { ThemeId, getInitialTheme, applyTheme } from "./lib/theme";
import ProgressRing from "./components/ProgressRing";
import { calculatePhaseProgress } from "./utils/syllabusUtils";

import { UserPhase, DaySchedule, TestAnalytics, MistakeVault, OnboardingConfig, SubjectId, SubjectConfig, FocusSession } from "./types";
import { ShieldAlert, Terminal, Activity, RefreshCw, Radio, Award, Layers, Flame, BookMarked, MessageSquareCode, User, Folder, Settings, HelpCircle, LogOut, Sparkles, Timer, Bot, ListTodo } from "lucide-react";

const getThemeVariants = (theme: ThemeId): any => {
  switch (theme) {
    case "brooklyn-graffiti":
      return {
        initial: { opacity: 0, scale: 0.95, y: 15 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
      };
    case "cursed-energy":
    case "pink-venom":
      return {
        initial: { opacity: 0, filter: "blur(8px)", scale: 1.02 },
        animate: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }
      };
    case "taisho-nichirin":
    case "assembly-initiative":
    case "power-your-dreams":
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.15 } }
      };
    case "borahae-galaxy":
      return {
        initial: { opacity: 0, rotate: -2, scale: 0.98 },
        animate: { opacity: 1, rotate: 0, scale: 1, transition: { type: "spring", bounce: 0.3 } },
        exit: { opacity: 0, rotate: 2, scale: 0.98, transition: { duration: 0.15 } }
      };
    default:
      return {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
        exit: { opacity: 0, y: -15, transition: { duration: 0.15 } }
      };
  }
};

export default function App() {
  // Authentication & Profile states
  const [token, setToken] = useState<string | null>(localStorage.getItem("EngineCore_Token"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("EngineCore_User"));
  const [onboarded, setOnboarded] = useState<boolean>(localStorage.getItem("EngineCore_Onboarded") === "true");
  const [config, setConfig] = useState<OnboardingConfig | null>(null);

  // Modal Open States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResourceBankOpen, setIsResourceBankOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [isGoogleTasksOpen, setIsGoogleTasksOpen] = useState(false);

  // Focus Sessions State
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  // Timer runner state (persists while user navigates or closes modal)
  const [timerState, setTimerState] = useState({
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    timeRemaining: 1500, // 25 mins
    totalSeconds: 1500,
    subject: "",
    preset: "25m",
    notes: "",
    hasLogged: false
  });

  // Visual Theme & Font Scaling
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(getInitialTheme());
  const [fontScale, setFontScale] = useState<"compact" | "normal" | "large">("normal");
  const [isWalkthroughPromptOpen, setIsWalkthroughPromptOpen] = useState(false);

  // Core academic data states
  const [engineState, setEngineState] = useState<UserPhase>({
    id: "system_state",
    currentOverrideState: null,
    systemCalculatedPhase: 1,
    localTime: "2026-05-20T05:49:41Z",
    activePhaseId: 1
  });

  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [tests, setTests] = useState<TestAnalytics[]>([]);
  const [mistakes, setMistakes] = useState<MistakeVault[]>([]);

  // App system statuses
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"STANDBY" | "SYNCING" | "ERROR">("STANDBY");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ROADMAP" | "SCOREBOARD" | "PHASE_1" | "PHASE_2" | "PHASE_3" | "PRE_EXAM" | "EXAM">("SCOREBOARD");

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Check if user needs walkthrough prompt on initial login/dashboard load
  useEffect(() => {
    if (token && onboarded && !loading) {
      const walkthroughAsked = localStorage.getItem("EngineCore_WalkthroughAsked");
      if (walkthroughAsked !== "true") {
        setIsWalkthroughPromptOpen(true);
      }
    }
  }, [token, onboarded, loading]);

  const handleWalkthroughAccept = () => {
    localStorage.setItem("EngineCore_WalkthroughAsked", "true");
    setIsWalkthroughPromptOpen(false);
    setIsUserGuideOpen(true);
  };

  const handleWalkthroughDecline = () => {
    localStorage.setItem("EngineCore_WalkthroughAsked", "true");
    setIsWalkthroughPromptOpen(false);
  };

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);

  // Authentication callbacks
  const handleLoginSuccess = (userToken: string, userLogin: string, isOnboarded: boolean) => {
    localStorage.setItem("EngineCore_Token", userToken);
    localStorage.setItem("EngineCore_User", userLogin);
    localStorage.setItem("EngineCore_Onboarded", isOnboarded ? "true" : "false");
    setToken(userToken);
    setUsername(userLogin);
    setOnboarded(isOnboarded);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.warn("Logout endpoint unreachable");
    }
    localStorage.removeItem("EngineCore_Token");
    localStorage.removeItem("EngineCore_User");
    localStorage.removeItem("EngineCore_Onboarded");
    setToken(null);
    setUsername(null);
    setOnboarded(false);
    setConfig(null);
    setIsProfileOpen(false);
    setIsResourceBankOpen(false);
    setIsSettingsOpen(false);
    setIsUserGuideOpen(false);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  // Onboarding Wizard complete
  const handleOnboardingComplete = async (newConfig: OnboardingConfig) => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ config: newConfig })
      });

      if (!res.ok) throw new Error("Onboarding API rejection");
      const data = await res.json();
      localStorage.setItem("EngineCore_Onboarded", "true");
      setOnboarded(true);
      setConfig(data.config);

      // Re-initialize core dashboard state
      await fetchDashboardState();

      // Immediately ask user: "Do you need a walkthrough of the website?"
      setIsWalkthroughPromptOpen(true);
    } catch (err: any) {
      alert("Onboarding initialization failure " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Core dashboard state
  const fetchDashboardState = async () => {
    if (!token) return;
    setSyncStatus("SYNCING");
    try {
      const stateRes = await fetch("/api/dashboard/state", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!stateRes.ok) throw new Error("Dashboard state fetch failure");
      const stateData = await stateRes.json();
      
      setEngineState({
        id: "system_state",
        currentOverrideState: stateData.currentOverrideState,
        systemCalculatedPhase: stateData.systemCalculatedPhase,
        localTime: stateData.localTime,
        activePhaseId: stateData.activePhaseId
      });
      setSchedule(stateData.schedule);
      setConfig(stateData.config);

      // Fetch study test analytics
      const analyticsRes = await fetch("/api/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!analyticsRes.ok) throw new Error("Analytics scoreboard fetch failure");
      const analyticsData = await analyticsRes.json();
      setTests(analyticsData);

      // Fetch mistake logs
      const mistakesRes = await fetch("/api/mistakes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!mistakesRes.ok) throw new Error("Mistake notebook fetch failure");
      const mistakesData = await mistakesRes.json();
      setMistakes(mistakesData);

      // Fetch focus sessions
      const focusRes = await fetch("/api/focus-sessions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (focusRes.ok) {
        const focusData = await focusRes.json();
        setFocusSessions(focusData);
      }

      setSyncStatus("STANDBY");
      setErrorMessage(null);
    } catch (err: any) {
      console.warn("API state load error. Triggering client-simulation:", err);
      setSyncStatus("ERROR");
      setErrorMessage("Dashboard engine disconnected, loading emergency local states.");
    }
  };

  // Focus Sessions API Handlers
  const handleLogFocusSession = async (sessionData: Omit<FocusSession, "id" | "completedAt">) => {
    try {
      const res = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sessionData)
      });
      if (!res.ok) throw new Error("Failed recording focus session");
      const newSession = await res.json();
      setFocusSessions(prev => [newSession, ...prev]);
    } catch (err) {
      console.warn("Local focus log fallback:", err);
      const fallbackSession: FocusSession = {
        id: "session_" + Date.now() + "_" + Math.random().toString(36).substring(2),
        subject: sessionData.subject,
        durationMinutes: sessionData.durationMinutes,
        notes: sessionData.notes,
        preset: sessionData.preset,
        completedAt: new Date().toISOString()
      };
      setFocusSessions(prev => [fallbackSession, ...prev]);
    }
  };

  const handleDeleteFocusSession = async (id: string) => {
    try {
      await fetch(`/api/focus-sessions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setFocusSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.warn("Delete session fallback:", err);
      setFocusSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  // Timer completion side-effects
  useEffect(() => {
    if (timerState.isCompleted && timerState.timeRemaining === 0 && timerState.subject && !timerState.hasLogged) {
      if (logFiredRef.current) return;
      logFiredRef.current = true;
      const minutesFocused = Math.max(1, Math.round(timerState.totalSeconds / 60));
      handleLogFocusSession({
        subject: timerState.subject,
        durationMinutes: minutesFocused,
        notes: timerState.notes || `Completed ${timerState.preset} study session on ${timerState.subject}`,
        preset: timerState.preset
      });
      setTimerState(prev => ({ ...prev, hasLogged: true }));
    } else if (!timerState.isCompleted) {
      logFiredRef.current = false;
    }
  }, [timerState.isCompleted, timerState.timeRemaining, timerState.subject, timerState.hasLogged, timerState.totalSeconds, timerState.notes, timerState.preset]);

  const logFiredRef = useRef<boolean>(false);

  // Timer Countdown Engine
  useEffect(() => {
    let interval: any = null;

    if (timerState.isRunning && timerState.timeRemaining > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            return {
              ...prev,
              timeRemaining: 0,
              isRunning: false,
              isCompleted: true
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.timeRemaining]);

  // Establish WebSockets Interlock connection for real-time synchronization
  useEffect(() => {
    if (!token || !username || !onboarded) return;

    const setupWebSocket = () => {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}`;
      console.log(`[WS] Initializing real-time websocket sync under ${wsUrl}`);
      
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log("[WS] Security interlock handshake complete. Subscribing account zone.");
        socket.send(JSON.stringify({ type: "subscribe", usernameZone: username }));
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log(`[WS] Event received: ${payload.type}`, payload);

          if (payload.type === "SYNC_OVERRIDE") {
            setEngineState(prev => ({
              ...prev,
              currentOverrideState: payload.currentOverrideState,
              systemCalculatedPhase: payload.systemCalculatedPhase,
              activePhaseId: payload.activePhaseId
            }));
            setSchedule(payload.schedule);
            setSyncStatus("STANDBY");
          } else if (payload.type === "SYNC_ONBOARDING") {
            setConfig(payload.user.config);
            localStorage.setItem("EngineCore_Onboarded", "true");
            setOnboarded(true);
            setSyncStatus("STANDBY");
          } else if (payload.type === "REFRESH_ANALYTICS") {
            setTests(payload.data);
            setSyncStatus("STANDBY");
          } else if (payload.type === "REFRESH_MISTAKES") {
            setMistakes(payload.data);
            setSyncStatus("STANDBY");
          } else if (payload.type === "REFRESH_FOCUS_SESSIONS") {
            setFocusSessions(payload.data);
            setSyncStatus("STANDBY");
          } else if (payload.type === "REFRESH_SCHEDULE_TOPICS") {
            setConfig(payload.user.config);
            setSchedule(payload.schedule);
            setEngineState(prev => ({
              ...prev,
              activePhaseId: payload.activePhaseId,
              systemCalculatedPhase: payload.systemCalculatedPhase
            }));
            setSyncStatus("STANDBY");
          }
        } catch (err) {
          console.error("[WS] Message processing parse failure:", err);
        }
      };

      socket.onclose = () => {
        console.warn("[WS] Security socket disrupted. Reconnecting in 3000ms...");
        setTimeout(() => {
          if (token) setupWebSocket();
        }, 3000);
      };

      socket.onerror = (e) => {
        console.warn("[WS] Socket connection note:", e);
      };
    };

    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token, username, onboarded]);

  // Authenticate current profile session
  useEffect(() => {
    const authProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
          // invalid/expired token
          handleLogout();
          return;
        }
        const data = await res.json();
        localStorage.setItem("EngineCore_Onboarded", data.onboarded ? "true" : "false");
        setOnboarded(data.onboarded);
        if (data.onboarded) {
          setConfig(data.config);
          await fetchDashboardState();
        }
      } catch (e) {
        console.warn("Secure token authentication offline, bypass activated.");
        setSyncStatus("ERROR");
      } finally {
        setLoading(false);
      }
    };

    authProfile();
  }, [token]);

  // Override academic phase state handler
  const handleOverridePhase = async (phase: number | null) => {
    setSyncStatus("SYNCING");
    try {
      const res = await fetch("/api/dashboard/override", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ overridePhase: phase })
      });
      if (!res.ok) throw new Error("Override API failed");
      const data = await res.json();
      
      setEngineState(prev => ({
        ...prev,
        currentOverrideState: data.currentOverrideState,
        systemCalculatedPhase: data.systemCalculatedPhase,
        activePhaseId: data.activePhaseId
      }));
      setSchedule(data.schedule);
      setSyncStatus("STANDBY");
    } catch (err: any) {
      console.warn("Override command fail:", err);
      setSyncStatus("ERROR");
    }
  };

  // Submit test scorecard
  const handleAddTest = async (newTest: Omit<TestAnalytics, "id" | "percentage" | "date">) => {
    setSyncStatus("SYNCING");
    try {
      const res = await fetch("/api/analytics/test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTest)
      });
      if (!res.ok) throw new Error("Add test failure on API");
      const saved = await res.json();
      setTests(prev => {
        if (prev.some(t => t.id === saved.id)) return prev;
        return [saved, ...prev];
      });
      setSyncStatus("STANDBY");
    } catch (err: any) {
      console.warn("Submission error:", err);
      setSyncStatus("ERROR");
    }
  };

  // Delete test scorecard
  const handleDeleteTest = async (id: string) => {
    setSyncStatus("SYNCING");
    try {
      const res = await fetch(`/api/analytics/test/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Delete test failure on API");
      setTests(prev => prev.filter(t => t.id !== id));
      setSyncStatus("STANDBY");
    } catch (err: any) {
      console.warn("Deletion error:", err);
      setSyncStatus("ERROR");
    }
  };

  // Submit mistake card
  const handleAddMistake = async (newMistake: Omit<MistakeVault, "id" | "resolved" | "dateAdded">) => {
    setSyncStatus("SYNCING");
    try {
      const res = await fetch("/api/mistakes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newMistake)
      });
      if (!res.ok) throw new Error("Add mistake failure on API");
      const saved = await res.json();
      setMistakes(prev => {
        if (prev.some(m => m.id === saved.id)) return prev;
        return [saved, ...prev];
      });
      setSyncStatus("STANDBY");
    } catch (err) {
      console.warn("Mistake logging fault:", err);
      setSyncStatus("ERROR");
    }
  };

  // Patch/Resolve mistake
  const handleResolveMistake = async (id: string) => {
    setSyncStatus("SYNCING");
    try {
      const res = await fetch(`/api/mistakes/${id}/resolve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("PATCH resolve failure");
      const patched = await res.json();
      setMistakes(prev => prev.map(m => m.id === id ? patched : m));
      setSyncStatus("STANDBY");
    } catch (err) {
      console.warn("Mistake PATCH failure:", err);
      setSyncStatus("ERROR");
    }
  };

  // Toggle syllabus topic completion callback (supports phaseId for independent phase progress)
  const handleToggleSyllabusTopic = async (subject: SubjectId, topic: string, completed: boolean, phaseId?: number) => {
    setToggleLoading(true);
    setSyncStatus("SYNCING");
    try {
      const res = await fetch("/api/topics/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ subject, topic, completed, phaseId })
      });

      if (!res.ok) throw new Error("Syllabus toggle API refusal");
      const data = await res.json();
      
      setConfig(data.user.config);
      setSchedule(data.schedule);
      setSyncStatus("STANDBY");
    } catch (err: any) {
      console.warn("Syllabus toggle failed:", err);
      setSyncStatus("ERROR");
    } finally {
      setToggleLoading(false);
    }
  };

  // Save custom syllabus handler
  const handleSaveCustomSyllabus = async (subject: string, syllabusData: any) => {
    if (!config || !token) return;
    setSyncStatus("SYNCING");
    try {
      let updatedCustomSyllabus = { ...(config.customSyllabus || {}) };
      if (syllabusData === null) {
        delete updatedCustomSyllabus[subject];
      } else {
        updatedCustomSyllabus[subject] = syllabusData;
      }
      const updatedConfig = {
        ...config,
        customSyllabus: updatedCustomSyllabus
      };

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ config: updatedConfig })
      });

      if (!res.ok) throw new Error("Onboarding API rejection");
      const data = await res.json();
      setConfig(data.config);
      await fetchDashboardState();
      setSyncStatus("STANDBY");
    } catch (err: any) {
      console.warn("Save custom syllabus failed:", err);
      setSyncStatus("ERROR");
    }
  };

  // Loading indicator for authorization checks
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070F] text-slate-200 flex flex-col items-center justify-center font-mono space-y-4">
        <RefreshCw className="animate-spin text-[#00F0FF]" size={36} />
        <span className="text-[10px] uppercase tracking-widest text-[#00F0FF] animate-bounce">
          VERIFYING PROFILE HANDSHAKES // CORE ENGINE
        </span>
      </div>
    );
  }

  if (!token) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (!onboarded) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} username={username || "Candidate"} />;
  }

  const handleUpdateSubjects = (newSubjects: SubjectConfig[], newUsername?: string, newLevel?: string) => {
    if (config) {
      setConfig({ 
        ...config, 
        subjects: newSubjects,
        ...(newLevel ? { subVariant: newLevel as any } : {})
      });
    }
    if (newUsername && newUsername !== username) {
      setUsername(newUsername);
      localStorage.setItem("EngineCore_User", newUsername);
    }
  };

  const handleReOnboard = () => {
    localStorage.removeItem("EngineCore_Onboarded");
    setOnboarded(false);
  };

  const enrolledSubjects = config?.subjects || [];

  const fontScaleClass = fontScale === "compact" ? "text-[90%]" : fontScale === "large" ? "text-[110%]" : "text-[100%]";

  const userSubjectsList = config?.subjects || [];
  const customSyllabusDict = config?.customSyllabus;
  const phase1Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 1);
  const phase2Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 2);
  const phase3Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 3);
  const preExamPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 4);
  const examPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 5);

  return (
    <div className={`relative min-h-screen bg-cyber-grid py-6 px-4 sm:px-6 lg:px-8 ${fontScaleClass} select-none pb-16 font-mono transition-colors duration-200 overflow-x-hidden`}>
      {/* Theme Background Cutouts & Atmospheric Overlays */}
      <ThemeOverlay theme={currentTheme} />

      <div className="relative z-10 max-w-7xl mx-auto space-y-5">
        
        {/* Top Status & Quick Action Navigation Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between text-[11px] border-b border-white/10 pb-3 text-slate-500 gap-3 uppercase">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'ERROR' ? 'bg-[#FF0055] animate-pulse' : 'bg-[#00FF66] animate-ping'}`} />
            <span className="font-bold text-slate-400">PORTAL INTERLOCK: </span>
            <span className={syncStatus === 'ERROR' ? 'text-[#FF0055]' : 'text-[#00FF66]'}>
              {syncStatus === 'ERROR' ? 'failsafe bypass active' : 'system online'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[#00F0FF] font-extrabold">CANDIDATE: {username?.toUpperCase()}</span>
            <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-extrabold text-[9px]">
              {config?.board} {config?.subVariant}
            </span>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {config?.boardExamDate && <GlobalExamCountdown targetDate={config.boardExamDate} />}
            <StudyBeatsPlayer />

            {/* Gemini AI Tutor & Vision Analyzer Launcher */}
            <button
              type="button"
              onClick={() => setIsGeminiOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 via-[#00F0FF]/20 to-purple-500/20 hover:from-purple-500/30 hover:to-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 text-[9.5px] uppercase font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#00F0FF]/10 hover:shadow-[#00F0FF]/20"
              title="Launch Gemini AI Tutor & Photo Analyzer"
            >
              <Bot size={13} className="text-[#00F0FF] animate-pulse" /> GEMINI AI TUTOR
            </button>

            {/* Google Tasks Launcher */}
            <button
              type="button"
              onClick={() => setIsGoogleTasksOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[9.5px] uppercase font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
              title="Google Tasks & Cloud SQL Sync Engine"
            >
              <ListTodo size={13} className="text-emerald-400" /> GOOGLE TASKS
            </button>

            {/* Focus Session Timer Launcher or Active Indicator */}
            {timerState.isRunning || timerState.isPaused ? (
              <button
                type="button"
                onClick={() => setIsTimerOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 text-[9.5px] uppercase font-black flex items-center gap-1.5 cursor-pointer transition-all animate-pulse shadow-lg shadow-[#00F0FF]/20"
                title="Active Study Timer - Click to view"
              >
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                ⚡ FOCUS: {Math.floor(timerState.timeRemaining / 60)}:{(timerState.timeRemaining % 60).toString().padStart(2, "0")} ({timerState.subject || "SESSION"})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsTimerOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/30 text-[9.5px] uppercase font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Launch Interactive Study Session Timer"
              >
                <Timer size={13} className="text-[#00F0FF]" /> FOCUS TIMER
              </button>
            )}

            <button
              onClick={() => setIsProfileOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9.5px] uppercase font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Profile & Enrolled Subjects"
            >
              <User size={13} /> PROFILE & SUBJECTS ({enrolledSubjects.length})
            </button>

            <button
              onClick={() => setIsResourceBankOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 text-[9.5px] uppercase font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Cloud Resource Bank"
            >
              <Folder size={13} /> CLOUD DRIVE
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[9.5px] uppercase font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Settings & Preferences"
            >
              <Settings size={13} /> SETTINGS
            </button>

            {/* Compact Theme Selector in Header */}
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
              compact={true}
            />

            <button
              onClick={() => setIsUserGuideOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[9.5px] uppercase font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title="Launch Website Walkthrough Tour"
            >
              <HelpCircle size={13} className="text-emerald-400" /> WALKTHROUGH TOUR
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-[#FF0055]/10 hover:bg-[#FF0055]/20 text-[#FF0055] border border-[#FF0055]/30 text-[9.5px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <LogOut size={13} /> LOGOUT
            </button>
          </div>
        </div>

        {/* Diagnostic Banner */}
        {errorMessage && (
          <div className="border border-[#FFEA00]/30 bg-[#FFEA00]/5 p-3 rounded-xl text-xs font-mono text-[#FFEA00] flex items-center gap-3">
            <ShieldAlert size={16} className="animate-bounce" />
            <span>
              <strong>SYSTEM DIAGNOSTIC:</strong> Engine sync disrupted. Falling back onto cached operations until sync registers.
            </span>
          </div>
        )}

        {/* Branding Title Header: SABER STUDY PORTAL // FOR STUDENTS, BY STUDENTS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 font-mono border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#00F0FF] animate-pulse shadow-lg shadow-[#00F0FF]/50" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-slate-100 uppercase">
                SABER STUDY PORTAL
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-black uppercase tracking-widest">
                CIE AS & A LEVEL
              </span>
            </div>
            <p className="text-[11px] uppercase text-[#00F0FF] tracking-widest mt-1 font-bold">
              FOR STUDENTS, BY STUDENTS // HIGH-UTILITY ACADEMIC DASHBOARD
            </p>
          </div>

          <div className="text-[10px] text-slate-400 border border-white/10 bg-[#12121A] py-2 px-3.5 rounded-xl flex items-center gap-2.5">
            <Radio size={13} className="text-[#00FF66] animate-pulse shrink-0" />
            <span>COHORT 2026 // SYSTEM CLEARANCE GRANTED</span>
          </div>
        </div>

        {/* Phase Navigation Control Table with active state tabs & Progress Rings */}
        {(() => {
          const userSubjectsList = config?.subjects || [];
          const customSyllabusDict = config?.customSyllabus;

          const phase1Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 1);
          const phase2Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 2);
          const phase3Pct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 3);
          const preExamPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 4);
          const examPct = calculatePhaseProgress(userSubjectsList, customSyllabusDict, 5);
          const overallPct = Math.round((phase1Pct + phase2Pct + phase3Pct + preExamPct + examPct) / 5);

          return (
            <div className="border border-white/10 bg-[#12121A]/80 p-2 rounded-2xl flex flex-wrap gap-2 text-xs font-mono select-none">
              <button
                onClick={() => setActiveTab("ROADMAP")}
                className={`flex-1 min-w-[150px] text-center py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "ROADMAP" 
                    ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 font-extrabold shadow-lg shadow-indigo-500/10" 
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                <Sparkles size={14} className={activeTab === "ROADMAP" ? "text-indigo-400 animate-pulse" : "text-slate-500"} />
                <span className="uppercase tracking-wider">ROADMAP</span>
              </button>
              <button
                onClick={() => setActiveTab("SCOREBOARD")}
                className={`flex-1 min-w-[150px] text-center py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "SCOREBOARD" 
                    ? "bg-purple-600/15 border-purple-500 text-purple-300 font-extrabold shadow-lg shadow-purple-500/10" 
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                <Award size={14} className={activeTab === "SCOREBOARD" ? "text-purple-400 animate-pulse" : "text-slate-500"} />
                <span className="uppercase tracking-wider">SCOREBOARD</span>
              </button>

              <button
                onClick={() => setActiveTab("PHASE_1")}
                className={`flex-1 min-w-[145px] text-center py-2 px-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  activeTab === "PHASE_1" 
                    ? "bg-amber-500/15 border-amber-500 text-amber-300 font-extrabold shadow-lg shadow-amber-500/10" 
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <BookMarked size={14} className={activeTab === "PHASE_1" ? "text-amber-400 animate-pulse" : "text-slate-500"} />
                  <span className="uppercase tracking-wider">PHASE 1</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300"
                  title={`Phase 1 Completion: ${phase1Pct}%`}
                >
                  <ProgressRing percentage={phase1Pct} size={18} strokeWidth={2.5} color="#F59E0B" />
                  <span className="text-[10px] font-black font-mono">{phase1Pct}%</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("PHASE_2")}
                className={`flex-1 min-w-[145px] text-center py-2 px-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  activeTab === "PHASE_2" 
                    ? "bg-indigo-500/15 border-indigo-500 text-indigo-300 font-extrabold shadow-lg shadow-indigo-500/10" 
                    : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Layers size={14} className={activeTab === "PHASE_2" ? "text-indigo-400 animate-pulse" : "text-slate-500"} />
                  <span className="uppercase tracking-wider">PHASE 2</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                  title={`Phase 2 Completion: ${phase2Pct}%`}
                >
                  <ProgressRing percentage={phase2Pct} size={18} strokeWidth={2.5} color="#6366F1" />
                  <span className="text-[10px] font-black font-mono">{phase2Pct}%</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("PHASE_3")}
                className={`flex-1 min-w-[145px] text-center py-2 px-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  activeTab === "PHASE_3" 
                    ? "bg-red-500/15 border-red-500 text-red-300 font-extrabold shadow-lg shadow-red-500/10" 
                    : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Flame size={14} className={activeTab === "PHASE_3" ? "text-red-400 animate-pulse" : "text-slate-500"} />
                  <span className="uppercase tracking-wider">PHASE 3</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300"
                  title={`Phase 3 Completion: ${phase3Pct}%`}
                >
                  <ProgressRing percentage={phase3Pct} size={18} strokeWidth={2.5} color="#EF4444" />
                  <span className="text-[10px] font-black font-mono">{phase3Pct}%</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("PRE_EXAM")}
                className={`flex-1 min-w-[165px] text-center py-2 px-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  activeTab === "PRE_EXAM" 
                    ? "bg-teal-500/15 border-teal-500 text-teal-300 font-extrabold shadow-lg shadow-teal-500/10" 
                    : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={14} className={activeTab === "PRE_EXAM" ? "text-teal-400 animate-pulse" : "text-slate-500"} />
                  <span className="uppercase tracking-wider">PRE-EXAM</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300"
                  title={`Pre-Exam Phase Completion: ${preExamPct}%`}
                >
                  <ProgressRing percentage={preExamPct} size={18} strokeWidth={2.5} color="#14B8A6" />
                  <span className="text-[10px] font-black font-mono">{preExamPct}%</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("EXAM")}
                className={`flex-1 min-w-[160px] text-center py-2 px-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  activeTab === "EXAM" 
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-extrabold shadow-lg shadow-emerald-500/10" 
                    : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Activity size={14} className={activeTab === "EXAM" ? "text-emerald-400 animate-pulse" : "text-slate-500"} />
                  <span className="uppercase tracking-wider">EXAM PHASE</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                  title={`Exam Phase Completion: ${examPct}%`}
                >
                  <ProgressRing percentage={examPct} size={18} strokeWidth={2.5} color="#10B981" />
                  <span className="text-[10px] font-black font-mono">{examPct}%</span>
                </div>
              </button>
            </div>
          );
        })()}

        {/* Selected Dashboard Screen Frame */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            {activeTab === "ROADMAP" && config && (
              <motion.div key="ROADMAP" {...getThemeVariants(currentTheme)}>
                <RoadmapVisualizer config={config} />
              </motion.div>
            )}

            {activeTab === "SCOREBOARD" && config && (
              <motion.div key="SCOREBOARD" {...getThemeVariants(currentTheme)}>
                <ScoreboardPanel 
                  userSubjects={config.subjects}
                  tests={tests}
                  onAddTest={handleAddTest}
                  onDeleteTest={handleDeleteTest}
                  focusSessions={focusSessions}
                  onOpenTimer={() => setIsTimerOpen(true)}
                  onDeleteFocusSession={handleDeleteFocusSession}
                  phaseStats={{ phase1: phase1Pct, phase2: phase2Pct, phase3: phase3Pct, phase4: preExamPct, phase5: examPct }}
                />
              </motion.div>
            )}

            {activeTab === "PHASE_1" && config && (
              <motion.div key="PHASE_1" {...getThemeVariants(currentTheme)}>
                <Phase1Panel 
                  userSubjects={config.subjects}
                  onToggleTopic={handleToggleSyllabusTopic}
                  loadingToggle={toggleLoading}
                  customSyllabus={config.customSyllabus}
                  onSaveCustomSyllabus={handleSaveCustomSyllabus}
                />
              </motion.div>
            )}

            {activeTab === "PHASE_2" && config && (
              <motion.div key="PHASE_2" {...getThemeVariants(currentTheme)}>
                <Phase2Panel 
                  userSubjects={config.subjects}
                  onToggleTopic={handleToggleSyllabusTopic}
                  loadingToggle={toggleLoading}
                  customSyllabus={config.customSyllabus}
                  onSaveCustomSyllabus={handleSaveCustomSyllabus}
                />
              </motion.div>
            )}

            {activeTab === "PHASE_3" && config && (
              <motion.div key="PHASE_3" {...getThemeVariants(currentTheme)}>
                <Phase3Panel 
                  userSubjects={config.subjects}
                  username={username || "User"}
                />
              </motion.div>
            )}

            {activeTab === "PRE_EXAM" && config && (
              <motion.div key="PRE_EXAM" {...getThemeVariants(currentTheme)}>
                <PreExamPanel 
                  userSubjects={config.subjects}
                  mistakes={mistakes}
                  onAddMistake={handleAddMistake}
                  onResolveMistake={handleResolveMistake}
                />
              </motion.div>
            )}

            {activeTab === "EXAM" && config && (
              <motion.div key="EXAM" {...getThemeVariants(currentTheme)}>
                <ExamPhasePanel 
                  userSubjects={config.subjects}
                  username={username || "User"}
                  onToggleTopic={handleToggleSyllabusTopic}
                  loadingToggle={toggleLoading}
                  customSyllabus={config.customSyllabus}
                  onSaveCustomSyllabus={handleSaveCustomSyllabus}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature Modals */}
        {config && (
          <ProfileSubjectModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            username={username || "User"}
            config={config}
            token={token || ""}
            onUpdateSubjects={handleUpdateSubjects}
          />
        )}

        {config && (
          <ResourceBankModal
            isOpen={isResourceBankOpen}
            onClose={() => setIsResourceBankOpen(false)}
            userSubjects={config.subjects}
            token={token || ""}
          />
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          fontScale={fontScale}
          onChangeFontScale={setFontScale}
          currentTheme={currentTheme}
          onChangeTheme={setCurrentTheme}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onReOnboard={handleReOnboard}
          onLogout={handleLogout}
        />

        <WalkthroughPromptModal
          isOpen={isWalkthroughPromptOpen}
          onAccept={handleWalkthroughAccept}
          onDecline={handleWalkthroughDecline}
        />

        <UserGuideModal
          isOpen={isUserGuideOpen}
          onClose={() => setIsUserGuideOpen(false)}
        />

        <StudySessionTimerModal
          isOpen={isTimerOpen}
          onClose={() => setIsTimerOpen(false)}
          userSubjects={config?.subjects || []}
          onLogSession={handleLogFocusSession}
          timerState={timerState}
          setTimerState={setTimerState}
        />

        <GeminiTutorModal
          isOpen={isGeminiOpen}
          onClose={() => setIsGeminiOpen(false)}
          userSubjects={config?.subjects || []}
          token={token}
        />

        <GoogleTasksModal
          isOpen={isGoogleTasksOpen}
          onClose={() => setIsGoogleTasksOpen(false)}
        />

        {/* Dashboard Footer Frame */}
        <footer className="pt-12 text-center text-slate-600 font-mono text-[10px] uppercase tracking-wider">
          <div>CORE ACADEMIC ENGINE // RECONCILIATION COMPLETE</div>
          <div className="text-slate-700 mt-1">NO LOGICAL GAP CAN RESIST DIRECT ITERATION CIRCUITS.</div>
        </footer>

      </div>
    </div>
  );
}
