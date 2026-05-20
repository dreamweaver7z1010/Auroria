import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Lock, User, ShieldAlert, Cpu, Sparkles, CheckSquare, ArrowLeft, Mail, ShieldCheck } from "lucide-react";

interface AuthScreenProps {
  onLoginSuccess: (token: string, username: string, onboarded: boolean) => void;
}

const GoogleIconSVG = () => (
  <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Google Flow States
  const [googleMode, setGoogleMode] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("deekshalakshmannan@gmail.com");
  const [googleStep, setGoogleStep] = useState<"EMAIL" | "VERIFYING" | "REGISTER" | "LOGIN">("EMAIL");
  const [googleUsername, setGoogleUsername] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [googlePasswordConfirm, setGooglePasswordConfirm] = useState("");
  const [existingUsernameFound, setExistingUsernameFound] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg("Please populate both security fields.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const url = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Security clearance refused.");
      }

      if (isLogin) {
        setSuccessMsg("Security clearance accepted! Linking core modules...");
        setTimeout(() => {
          onLoginSuccess(data.token, data.user.username, data.user.onboarded);
        }, 1000);
      } else {
        setSuccessMsg("Account system registered successfully! Syncing credentials...");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Credential matching fault.");
    } finally {
      setLoading(false);
    }
  };

  // Google Account - Check & Verify Flow
  const handleVerifyGoogleEmail = async (emailToVerify: string) => {
    if (!emailToVerify || !emailToVerify.includes("@")) {
      setErrorMsg("Please provide a valid Google email address.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleStep("VERIFYING");

    try {
      // Artfully simulate cryptographic Google signatures verification delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const res = await fetch("/api/auth/google/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToVerify.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google Identity authentication refused.");
      }

      setGoogleEmail(emailToVerify.trim());

      if (data.exists) {
        setExistingUsernameFound(data.username);
        setGoogleStep("LOGIN");
        setSuccessMsg("Google Identity Linked: username '" + data.username + "'");
      } else {
        setGoogleStep("REGISTER");
        setSuccessMsg("Google ID verified. Please complete your custom credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Google account verification session failed.");
      setGoogleStep("EMAIL");
    } finally {
      setLoading(false);
    }
  };

  // Google Account Registration Submit
  const handleGoogleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!googleUsername.trim()) {
      setErrorMsg("A portal username identity is required.");
      return;
    }
    if (!googlePassword) {
      setErrorMsg("Chosen authorization password is required.");
      return;
    }
    if (googlePassword !== googlePasswordConfirm) {
      setErrorMsg("Security confirmation password does not match.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/google/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
          username: googleUsername.trim(),
          password: googlePassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Custom profiling rejected.");
      }

      setSuccessMsg("Google Link activated & verified! Building terminal workspace...");
      setTimeout(() => {
        onLoginSuccess(data.token, data.user.username, data.user.onboarded);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration parameters check rejected.");
    } finally {
      setLoading(false);
    }
  };

  // Google Account Login Submit
  const handleGoogleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!googlePassword) {
      setErrorMsg("Authentication password is required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/google/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
          password: googlePassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Security clearance refused.");
      }

      setSuccessMsg("Access key accepted! Synthesizing study timeline...");
      setTimeout(() => {
        onLoginSuccess(data.token, data.user.username, data.user.onboarded);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Credential matching fault. Wrong password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "guest",
          password: "password123"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Guest account initialization failed.");
      }

      setSuccessMsg("Welcome Guest! Extracting simulated pre-onboarded database...");
      setTimeout(() => {
        onLoginSuccess(data.token, data.user.username, data.user.onboarded);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed guest simulation bypass.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070F] text-slate-200 py-12 px-4 flex items-center justify-center relative bg-cyber-grid">
      
      {/* Absolute Header Tech Indicators */}
      <div className="absolute top-4 left-6 hidden lg:flex items-center gap-3 font-mono text-[9px] text-slate-500">
        <Cpu className="text-[#00F0FF] animate-pulse" size={12} />
        <span>INTELLIGENCE INTERLOCK CLOUD INTERFACE ACTIVATED</span>
      </div>

      <div className="absolute top-4 right-6 hidden lg:flex items-center gap-2 font-mono text-[9px] text-[#00FF66]">
        <Sparkles size={11} />
        <span>SECURE HANDLERS // GOOGLE IDENTITY INTEGRATION</span>
      </div>

      <div className="max-w-md w-full bg-[#12121A]/70 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-md relative shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Glow Laser */}
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00F0FF] to-transparent opacity-20" />

        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <div className="text-[#00F0FF] text-lg font-black tracking-widest uppercase">
            CORE ACADEMIC ENGINE
          </div>
          <div className="text-[9px] text-slate-500 tracking-widest block uppercase font-bold text-slate-400">
            ADAPTIVE STUDY PROTOCOL FRAMEWORK // PORTAL 2.6
          </div>
        </div>

        {/* Global Feedback Notifications */}
        <AnimatePresence mode="popLayout">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4 p-3 border border-[#FF0055]/30 bg-[#FF0055]/5 text-[#FF0055] rounded text-[10px] flex items-center gap-2"
            >
              <ShieldAlert className="shrink-0" size={14} />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4 p-3 border border-[#00FF66]/30 bg-[#00FF66]/5 text-[#00FF66] rounded text-[10px] flex items-center gap-2"
            >
              <CheckSquare className="shrink-0 animate-bounce" size={14} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!googleMode ? (
          /* TRADITIONAL LOGIN/SIGNUP STATE */
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 bg-[#0A0A0F] border border-white/5 p-1 rounded-md">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-center rounded transition-all uppercase text-[10px] font-extrabold cursor-pointer ${
                  isLogin 
                    ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/20" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                [01] SECURE LOGIN
              </button>
              
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-center rounded transition-all uppercase text-[10px] font-extrabold cursor-pointer ${
                  !isLogin 
                    ? "bg-[#9D00FF]/15 text-[#9D00FF] border border-[#9D00FF]/20" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                [02] SYSTEM SIGNUP
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 block uppercase">Username Identity</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. academic_warrior"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 block uppercase">Authorization Code (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded font-black uppercase text-[10px] transition-all tracking-widest border cursor-pointer ${
                  isLogin 
                    ? "bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/30" 
                    : "bg-[#9D00FF]/25 border-[#9D00FF] text-[#9D00FF] hover:bg-[#9D00FF]/45"
                }`}
              >
                {loading ? "INITIALIZING CRITERIA..." : isLogin ? "LOAD PERSONAL TERMINAL" : "DEPLOY PROFILE CREATION"}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5" />
              <span className="flex-shrink mx-4 text-[9px] text-slate-500 uppercase font-bold">OR INTEGRATE ACCREDITATION</span>
              <div className="flex-grow border-t border-white/5" />
            </div>

            <button
              onClick={() => {
                setGoogleMode(true);
                setGoogleStep("EMAIL");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="w-full py-2.5 bg-white text-black hover:bg-slate-200 rounded font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center border border-white/10"
            >
              <GoogleIconSVG />
              Continue with Google Verification
            </button>
          </div>
        ) : (
          /* GOOGLE LOGIN / SIGNUP VERIFICATION STAGE */
          <div className="space-y-5 animate-fade-in font-mono">
            {/* Header / Subheader */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <button
                onClick={() => {
                  setGoogleMode(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-slate-400 hover:text-slate-100 uppercase text-[9px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={11} /> Standard Form
              </button>
              <div className="flex items-center gap-1.5 text-[#00FF55] text-[9.5px]">
                <ShieldCheck size={13} className="animate-pulse" />
                <span className="font-extrabold uppercase">GOOGLE SIGN-IN ENGINE</span>
              </div>
            </div>

            {googleStep === "EMAIL" && (
              <div className="space-y-4">
                <span className="text-[10px] text-slate-400 block uppercase leading-relaxed text-center">
                  Select or input your Google account address to run cryptographically verified authentication.
                </span>

                {/* Account Selection Rails */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleVerifyGoogleEmail("deekshalakshmannan@gmail.com")}
                    disabled={loading}
                    className="w-full text-left p-3.5 bg-slate-950/80 border border-white/15 hover:border-[#00F0FF]/60 rounded-lg transition-all text-[11px] font-mono flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 px-2.5 bg-[#4285F4]/10 text-[#4285F4] rounded text-xs font-black">G</div>
                      <div>
                        <span className="font-extrabold text-slate-200 block">Deeksha Lakshmannan</span>
                        <span className="text-[10px] text-slate-550 block lowercase group-hover:text-slate-400">deekshalakshmannan@gmail.com</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] text-[#00F0FF] uppercase opacity-70 group-hover:opacity-100 font-extrabold">[Verify ✓]</span>
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="flex-shrink mx-3 text-[8.5px] text-slate-550 uppercase">or type other Google Address</span>
                    <div className="flex-grow border-t border-white/5" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase">Google Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-slate-500" size={14} />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-white/15 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#4285F4]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerifyGoogleEmail(googleEmail)}
                  className="w-full py-2.5 bg-[#4285F4]/20 hover:bg-[#4285F4]/35 border border-[#4285F4] text-slate-200 hover:text-white rounded font-black uppercase text-[10px] tracking-widest cursor-pointer transition-all"
                >
                  Verify Google Account Authentication
                </button>
              </div>
            )}

            {googleStep === "VERIFYING" && (
              <div className="py-8 text-center space-y-4 font-mono">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-[#4285F4]/20 border-t-[#4285F4] animate-spin" />
                  <GoogleIconSVG />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-black tracking-widest text-[#00F0FF] uppercase block animate-pulse">
                    VERIFYING GOOGLE ACCREDITATION...
                  </span>
                  <span className="text-[9px] text-slate-600 block uppercase">
                    Exchanging OAuth-2.0 Handshake key token // {googleEmail}
                  </span>
                </div>
              </div>
            )}

            {googleStep === "REGISTER" && (
              <form onSubmit={handleGoogleRegisterSubmit} className="space-y-4">
                <div className="p-3 bg-[#00FF55]/5 border border-[#00FF55]/20 rounded-lg text-slate-300 space-y-1 block text-left">
                  <span className="text-[9px] text-[#00FF66] uppercase font-bold tracking-wider block">✓ verified google account</span>
                  <span className="text-xs text-slate-200 block lowercase">{googleEmail}</span>
                  <span className="text-[9px] text-slate-500 block leading-tight">
                    Account not previously associated. Please deploy your unique portal username and access codes below.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block uppercase">Choose Portal Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. quantum_expert"
                      value={googleUsername}
                      onChange={(e) => setGoogleUsername(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 block leading-none pt-0.5 uppercase">
                    * A username cannot be duplicated between other users
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block uppercase">Choose Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={googlePassword}
                      onChange={(e) => setGooglePassword(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block uppercase">Re-verify Password Code</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={googlePasswordConfirm}
                      onChange={(e) => setGooglePasswordConfirm(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setGoogleStep("EMAIL")}
                    className="py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 rounded text-[9px] uppercase font-bold cursor-pointer"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2 bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/30 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Deploy Study Profile
                  </button>
                </div>
              </form>
            )}

            {googleStep === "LOGIN" && (
              <form onSubmit={handleGoogleLoginSubmit} className="space-y-4">
                <div className="p-3 bg-[#00F0FF]/5 border border-[#00F0FF]/25 rounded-lg text-slate-300 text-left space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-[#00F0FF] uppercase font-bold tracking-wider">
                    <span>✓ google account linked</span>
                    <span>STUDENT LINKED</span>
                  </div>
                  <span className="text-[11px] text-slate-200 block lowercase font-mono">{googleEmail}</span>
                  <div className="text-[9.5px] text-slate-400 uppercase pt-1">
                    Username Identity: <strong className="text-white">{existingUsernameFound}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 block uppercase">Verify Authorization Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-[#00F0FF]" size={14} />
                    <input
                      type="password"
                      required
                      placeholder="Enter associated profile password..."
                      value={googlePassword}
                      onChange={(e) => setGooglePassword(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-[#00F0FF]/25 text-[#00F0FF] rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleStep("EMAIL");
                      setGooglePassword("");
                    }}
                    className="py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 rounded text-[9px] uppercase font-bold cursor-pointer"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2 bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/35 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Unlock Terminal
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* Divider and Guest quick-bypass option */}
        <div className="mt-8 pt-5 border-t border-white/5 space-y-3 font-mono text-[9px]">
          <div className="text-center text-[#555] uppercase font-bold">
            — EVALUATION QUICK BYPASS MODE —
          </div>
          
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-[#00FF66]/10 text-slate-300 hover:text-[#00FF66] border border-white/10 hover:border-[#00FF66]/40 rounded font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="animate-pulse shrink-0" size={12} />
            ONE-CLICK GUEST PLAYGROUND
          </button>
          
          <p className="text-slate-600 text-center uppercase tracking-wide">
            Seeds standard high-fidelity CBS/CIE configurations immediately to save credentials creation time!
          </p>
        </div>

      </div>
    </div>
  );
}
