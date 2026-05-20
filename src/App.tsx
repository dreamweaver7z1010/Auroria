import { useEffect, useState, useRef } from "react";
import AuthScreen from "./components/AuthScreen";
import OnboardingWizard from "./components/OnboardingWizard";

// Fully modular phase panels matching student schedules
import ScoreboardPanel from "./components/ScoreboardPanel";
import Phase1Panel from "./components/Phase1Panel";
import Phase2Panel from "./components/Phase2Panel";
import Phase3Panel from "./components/Phase3Panel";
import PreExamPanel from "./components/PreExamPanel";
import ExamPhasePanel from "./components/ExamPhasePanel";

import { UserPhase, DaySchedule, TestAnalytics, MistakeVault, OnboardingConfig, SubjectId } from "./types";
import { ShieldAlert, Terminal, Activity, RefreshCw, Radio, Award, Layers, Flame, BookMarked, MessageSquareCode } from "lucide-react";

export default function App() {
  // Authentication & Profile states
  const [token, setToken] = useState<string | null>(localStorage.getItem("EngineCore_Token"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("EngineCore_User"));
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [config, setConfig] = useState<OnboardingConfig | null>(null);

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
  const [activeTab, setActiveTab] = useState<"SCOREBOARD" | "PHASE_1" | "PHASE_2" | "PHASE_3" | "PRE_EXAM" | "EXAM">("SCOREBOARD");

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);

  // Authentication callbacks
  const handleLoginSuccess = (userToken: string, userLogin: string, isOnboarded: boolean) => {
    localStorage.setItem("EngineCore_Token", userToken);
    localStorage.setItem("EngineCore_User", userLogin);
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
    setToken(null);
    setUsername(null);
    setOnboarded(false);
    setConfig(null);
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
      setOnboarded(true);
      setConfig(data.config);

      // Re-initialize core dashboard state
      await fetchDashboardState();
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

      setSyncStatus("STANDBY");
      setErrorMessage(null);
    } catch (err: any) {
      console.warn("API state load error. Triggering client-simulation:", err);
      setSyncStatus("ERROR");
      setErrorMessage("Dashboard engine disconnected, loading emergency local states.");
    }
  };

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
            setOnboarded(true);
            setSyncStatus("STANDBY");
          } else if (payload.type === "REFRESH_ANALYTICS") {
            setTests(payload.data);
            setSyncStatus("STANDBY");
          } else if (payload.type === "REFRESH_MISTAKES") {
            setMistakes(payload.data);
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
        console.error("[WS] Socket error details:", e);
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
      setTests(prev => [saved, ...prev]);
      setSyncStatus("STANDBY");
    } catch (err: any) {
      console.warn("Submission error:", err);
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
      setMistakes(prev => [saved, ...prev]);
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

  // Toggle syllabus topic completion callback
  const handleToggleSyllabusTopic = async (subject: SubjectId, topic: string, completed: boolean) => {
    setToggleLoading(true);
    setSyncStatus("SYNCING");
    try {
      const res = await fetch("/api/topics/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ subject, topic, completed })
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

  // Not Logged In screen
  if (!token) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Logged In, but Not Onboarded
  if (!onboarded) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} username={username || "User"} />;
  }

  return (
    <div className="relative min-h-screen bg-cyber-grid py-8 px-4 sm:px-6 lg:px-8 bg-[#0A0A0F] text-slate-200 selection:bg-[#00F0FF]/30 select-none pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Global Connection Interlock Status Bar with auth handlers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono border-b border-white/5 pb-3 text-slate-500 mb-4 gap-2 uppercase">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'ERROR' ? 'bg-[#FF0055] animate-pulse' : 'bg-[#00FF66] animate-ping'}`} />
            <span>PORTAL METADATA INTERLOCK: </span>
            <span className={syncStatus === 'ERROR' ? 'text-[#FF0055]' : 'text-[#00FF66]'}>
              {syncStatus === 'ERROR' ? 'emergency failsafe bypass active' : 'system linked status online'}
            </span>
            <span className="text-slate-650 font-normal">|</span>
            <span className="text-[#00F0FF] font-bold">USER: {username?.toUpperCase()}</span>
            <span className="text-slate-700 bg-white/5 px-1.5 py-0.5 rounded text-[9px] border border-white/5 font-extrabold uppercase">
              {config?.board} {config?.subVariant}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9.5px]">
              <Radio size={12} className="text-[#00F0FF] animate-pulse shrink-0" />
              <span>LIVE WS SYNC</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 rounded bg-[#FF0055]/10 text-[#FF0055] border border-[#FF0055]/30 hover:bg-[#FF0055]/25 text-[9px] uppercase tracking-wider font-extrabold transition-all"
            >
              [SECURE_LOGOUT]
            </button>
          </div>
        </div>

        {/* Local warning alert diagnostic banner */}
        {errorMessage && (
          <div className="border border-[#FFEA00]/30 bg-[#FFEA00]/5 p-3 rounded text-xs font-mono text-[#FFEA00] flex items-center gap-3">
            <ShieldAlert size={16} className="animate-bounce" />
            <span>
              <strong>SYSTEM DIAGNOSTIC:</strong> Engine sync disrupted. Falling back directly onto core cached operations till sync channel link registers.
            </span>
          </div>
        )}

        {/* Simple visual title header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 mb-2 p-1 font-mono">
          <div>
            <h1 className="text-xl sm:text-2xl font-mono font-black tracking-widest text-[#E2E8F0] uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              Saber Study Portal
            </h1>
            <p className="text-[10px] uppercase font-mono text-slate-400 tracking-widest mt-1">
              Active student tracking dashboard // cohort 2026 scheduling & metrics
            </p>
          </div>
          <div className="text-[10px] text-slate-400 border border-white/5 bg-[#0A0A0F] py-2 px-3.5 rounded-lg flex items-center gap-2">
            <Radio size={12} className="text-purple-400 animate-pulse shrink-0" />
            <span>EXAM TARGET STATUS: COHORT RUNTIME ONLINE</span>
          </div>
        </div>

        {/* Phase Navigation Control Table with active state tabs */}
        <div className="border border-white/5 bg-[#12121A]/60 p-2.5 rounded-2xl flex flex-wrap gap-2 text-xs font-mono select-none">
          <button
            onClick={() => setActiveTab("SCOREBOARD")}
            className={`flex-1 min-w-[200px] text-center py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "SCOREBOARD" 
                ? "bg-purple-600/10 border-purple-500 text-purple-400 font-extrabold shadow-lg shadow-purple-500/5" 
                : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
            }`}
          >
            <Award size={14} className={activeTab === "SCOREBOARD" ? "text-purple-400 animate-pulse" : "text-slate-500"} />
            <span className="uppercase tracking-wider">ACADEMIC SCOREBOARD & METRICS</span>
          </button>

          <button
            onClick={() => setActiveTab("PHASE_1")}
            className={`flex-1 min-w-[130px] text-center py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "PHASE_1" 
                ? "bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold shadow-lg shadow-amber-500/5" 
                : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
            }`}
          >
            <BookMarked size={14} className={activeTab === "PHASE_1" ? "text-amber-400 animate-pulse" : "text-slate-500"} />
            <span className="uppercase tracking-wider">PHASE 1</span>
          </button>

          <button
            onClick={() => setActiveTab("PHASE_2")}
            className={`flex-1 min-w-[130px] text-center py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "PHASE_2" 
                ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-extrabold shadow-lg shadow-indigo-500/5" 
                : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
            }`}
          >
            <Layers size={14} className={activeTab === "PHASE_2" ? "text-indigo-400 animate-pulse" : "text-slate-500"} />
            <span className="uppercase tracking-wider">PHASE 2</span>
          </button>

          <button
            onClick={() => setActiveTab("PHASE_3")}
            className={`flex-1 min-w-[130px] text-center py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "PHASE_3" 
                ? "bg-red-500/10 border-red-500 text-red-500 font-extrabold shadow-lg shadow-red-500/5" 
                : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
            }`}
          >
            <Flame size={14} className={activeTab === "PHASE_3" ? "text-red-500 animate-pulse" : "text-slate-500"} />
            <span className="uppercase tracking-wider">PHASE 3</span>
          </button>

          <button
            onClick={() => setActiveTab("PRE_EXAM")}
            className={`flex-1 min-w-[150px] text-center py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "PRE_EXAM" 
                ? "bg-teal-500/10 border-teal-500 text-teal-400 font-extrabold shadow-lg shadow-teal-500/5" 
                : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
            }`}
          >
            <ShieldAlert size={14} className={activeTab === "PRE_EXAM" ? "text-teal-400 animate-pulse" : "text-slate-500"} />
            <span className="uppercase tracking-wider">PRE-EXAM PHASE</span>
          </button>

          <button
            onClick={() => setActiveTab("EXAM")}
            className={`flex-1 min-w-[140px] text-center py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "EXAM" 
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow-lg shadow-emerald-500/5" 
                : "bg-white/1 border-white/5 text-slate-400 hover:bg-white/3 hover:text-slate-200"
            }`}
          >
            <Activity size={14} className={activeTab === "EXAM" ? "text-emerald-400 animate-pulse" : "text-slate-500"} />
            <span className="uppercase tracking-wider">EXAM-PHASE</span>
          </button>
        </div>

        {/* Selected Dashboard Screen Frame */}
        <div className="pt-2">
          {activeTab === "SCOREBOARD" && config && (
            <ScoreboardPanel 
              userSubjects={config.subjects}
              tests={tests}
              onAddTest={handleAddTest}
            />
          )}

          {activeTab === "PHASE_1" && config && (
            <Phase1Panel 
              userSubjects={config.subjects}
              onToggleTopic={handleToggleSyllabusTopic}
              loadingToggle={toggleLoading}
              customSyllabus={config.customSyllabus}
              onSaveCustomSyllabus={handleSaveCustomSyllabus}
            />
          )}

          {activeTab === "PHASE_2" && config && (
            <Phase2Panel 
              userSubjects={config.subjects}
              onToggleTopic={handleToggleSyllabusTopic}
              loadingToggle={toggleLoading}
              customSyllabus={config.customSyllabus}
              onSaveCustomSyllabus={handleSaveCustomSyllabus}
            />
          )}

          {activeTab === "PHASE_3" && config && (
            <Phase3Panel 
              userSubjects={config.subjects}
              username={username || "User"}
            />
          )}

          {activeTab === "PRE_EXAM" && config && (
            <PreExamPanel 
              userSubjects={config.subjects}
              mistakes={mistakes}
              onAddMistake={handleAddMistake}
              onResolveMistake={handleResolveMistake}
            />
          )}

          {activeTab === "EXAM" && config && (
            <ExamPhasePanel 
              userSubjects={config.subjects}
              onToggleTopic={handleToggleSyllabusTopic}
              loadingToggle={toggleLoading}
              customSyllabus={config.customSyllabus}
              onSaveCustomSyllabus={handleSaveCustomSyllabus}
            />
          )}
        </div>



        {/* Dashboard Footer Frame */}
        <footer className="pt-12 text-center text-slate-600 font-mono text-[10px] uppercase tracking-wider">
          <div>CORE ACADEMIC ENGINE // RECONCILIATION COMPLETE</div>
          <div className="text-slate-700 mt-1">NO LOGICAL GAP CAN RESIST DIRECT ITERATION CIRCUITS.</div>
        </footer>

      </div>
    </div>
  );
}
