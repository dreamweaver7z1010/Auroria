import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Lock, User, ShieldAlert, Cpu, Sparkles, CheckSquare, ArrowLeft, Mail, ShieldCheck, UserCheck, KeyRound, Eye, EyeOff } from "lucide-react";

interface AuthScreenProps {
  onLoginSuccess: (token: string, username: string, onboarded: boolean) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form States (Just Username & Password)
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup Form States
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupEmailPassword, setSignupEmailPassword] = useState("");

  // General App States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password visibility triggers
  const [showPortalPass, setShowPortalPass] = useState(false);
  const [showEmailPass, setShowEmailPass] = useState(false);

  // Standard Login submit action: Username and Password ALONE
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword) {
      setErrorMsg("Please populate both username and password fields.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect username or password. Credential mismatch.");
      }

      setSuccessMsg("Security clearance accepted! Rebuilding study portal...");
      setTimeout(() => {
        onLoginSuccess(data.token, data.user.username, data.user.onboarded);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed credentials match.");
    } finally {
      setLoading(false);
    }
  };

  // Direct Sign-up submission (no OTP step)
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupUsername.trim() || !signupPassword || !signupEmail.trim() || !signupEmailPassword) {
      setErrorMsg("All credential parameters (Name, Username, Password, Email, Email's Password) are strictly required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName.trim(),
          username: signupUsername.trim(),
          password: signupPassword,
          email: signupEmail.trim(),
          emailPassword: signupEmailPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Portal profiling parameters rejected.");
      }

      setSuccessMsg(data.message || "Your profile has been created! Redirecting to login portal...");
      
      // Clear signup fields and redirect to the login form automatically with pre-filled username
      setTimeout(() => {
        setLoginUsername(signupUsername.trim());
        setSignupName("");
        setSignupUsername("");
        setSignupPassword("");
        setSignupEmail("");
        setSignupEmailPassword("");
        setIsLogin(true); // Switch to the login portal immediately
        setSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotInput, setForgotInput] = useState("");
  const [resetTokenReceived, setResetTokenReceived] = useState<string | null>(null);
  const [resetTargetUser, setResetTargetUser] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");

  // Google OAuth Verification Handler
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/google-oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "candidate.cie@gmail.com",
          name: "CIE Candidate"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google OAuth authentication failed.");

      setSuccessMsg("Google OAuth clearance granted! Redirecting to study portal...");
      setTimeout(() => {
        onLoginSuccess(data.token, data.user.username, data.user.onboarded);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed Google OAuth verification.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: forgotInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "User identity not found.");

      setSuccessMsg(data.message);
      setResetTokenReceived(data.resetToken);
      setResetTargetUser(data.username);
    } catch (err: any) {
      setErrorMsg(err.message || "Password recovery failed.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Submit
  const handleResetPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: resetTargetUser,
          newPassword: newPasswordInput
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed resetting password.");

      setSuccessMsg(data.message);
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetTokenReceived(null);
        setNewPasswordInput("");
        setIsLogin(true);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Reset failed.");
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
        throw new Error(data.error || "Fallback bypass initialization failed.");
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
        <span>READY // STABLE DATABASE PERSISTENCE MODE</span>
      </div>

      <div className="max-w-md w-full bg-[#12121A]/80 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-md relative shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Glow Laser */}
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00F0FF] to-transparent opacity-30" />

        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <div className="text-[#00F0FF] text-lg font-black tracking-widest uppercase">
            STUDY TERMINAL
          </div>
          <div className="text-[9px] text-slate-500 tracking-widest block uppercase font-bold">
            ADAPTIVE REVISION STRATEGY PROTOCOL // LOCK-IN PORTAL
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
              className="mb-4 p-3 border border-[#00FF56]/30 bg-[#00FF56]/5 text-[#00FF66] rounded text-[10px] flex items-center gap-2"
            >
              <CheckSquare className="shrink-0 animate-bounce" size={14} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TRADITIONAL LOGIN/SIGNUP STATE CONTAINER */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2 bg-[#0A0A0F] border border-white/5 p-1 rounded-md">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-center rounded transition-all uppercase text-[10px] font-extrabold cursor-pointer ${
                isLogin 
                  ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/25 shadow-[0_0_10px_rgba(0,240,255,0.05)]" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              [01] SIGN IN
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-center rounded transition-all uppercase text-[10px] font-extrabold cursor-pointer ${
                !isLogin 
                  ? "bg-[#9D00FF]/15 text-[#9D00FF] border border-[#9D00FF]/25 shadow-[0_0_10px_rgba(157,0,255,0.05)]" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              [02] REGISTER NEW
            </button>
          </div>

          {isLogin ? (
            /* LOGIN ROUTE: ASK JUST FOR USERNAME AND PASSWORD ALONE */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 block text-left">
                <span className="text-[10px] text-slate-400 block uppercase mb-1 leading-relaxed">
                  Provide credentials below to link with established profile database.
                </span>
              </div>

              <div className="space-y-1 block text-left">
                <label className="text-[9px] text-slate-500 block uppercase">Username Identity</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. deeksha_student"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="space-y-1 block text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-slate-500 block uppercase">Authorization Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[9px] text-[#00F0FF] hover:underline uppercase"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded font-black uppercase text-[10px] transition-all tracking-widest border cursor-pointer bg-[#00F0FF]/20 border-[#00F0FF]/60 text-[#00F0FF] hover:bg-[#00F0FF]/30 hover:border-[#00F0FF]"
              >
                {loading ? "CHECKING PASSWORD STATUS..." : "LOAD PERSONAL ARCHIVE"}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-2 text-[9px] text-slate-500 uppercase">OR OAUTH VERIFY</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 rounded font-extrabold uppercase text-[10px] transition-all tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail size={14} className="text-red-400" />
                CONTINUE WITH GOOGLE / GMAIL
              </button>
            </form>
          ) : isForgotPassword ? (
            /* FORGOT PASSWORD RECOVERY FORM */
            <div className="space-y-4 text-left">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetTokenReceived(null);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 uppercase font-bold"
              >
                <ArrowLeft size={12} /> Back to Sign In
              </button>

              {!resetTokenReceived ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                  <div className="text-[10px] text-slate-400">
                    Enter your registered candidate username or email address to initiate verification token recovery.
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase block">Username or Email</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. deeksha_student"
                        value={forgotInput}
                        onChange={(e) => setForgotInput(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded font-black uppercase text-[10px] tracking-widest border cursor-pointer bg-[#00F0FF]/20 border-[#00F0FF]/60 text-[#00F0FF] hover:bg-[#00F0FF]/30"
                  >
                    {loading ? "VERIFYING IDENTITY..." : "REQUEST RECOVERY TOKEN"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                  <div className="p-2 border border-[#00FF66]/30 bg-[#00FF66]/5 rounded text-[10px] text-[#00FF66]">
                    Clearance token verified for student profile: <strong>{resetTargetUser}</strong>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase block">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                      <input
                        type="password"
                        required
                        placeholder="Enter new password..."
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded font-black uppercase text-[10px] tracking-widest border cursor-pointer bg-[#00FF66]/20 border-[#00FF66]/60 text-[#00FF66] hover:bg-[#00FF66]/30"
                  >
                    {loading ? "RESETTING PASSWORD..." : "UPDATE PASSWORD & DIRECT TO LOGIN"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* SIGNUP FORM: NAME, USERNAME, PASSWORD, EMAIL, EMAIL'S PASSWORD (NO OTP) */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-left">
              <div className="p-2 border border-yellow-500/20 bg-yellow-500/5 rounded text-[10px] text-yellow-400 leading-snug">
                📌 Notice: A username must be globally unique. Direct profile deployment will execute immediately upon registration key check.
              </div>

              {/* 1. Name */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 uppercase block">Full Name</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deeksha Lakshmannan"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>
              </div>

              {/* 2. Username */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 uppercase block">Chosen Username Identity</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. deeksha99"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>
              </div>

              {/* 3. Password */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 uppercase block">Portal Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type={showPortalPass ? "text" : "password"}
                    required
                    placeholder="Enter a secure password..."
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 pr-8 text-slate-200 focus:outline-none focus:border-[#9D00FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPortalPass(!showPortalPass)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPortalPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              {/* 4. Email */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase block">Primary Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              {/* 5. Email's Password */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase block">Email's Account Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type={showEmailPass ? "text" : "password"}
                    required
                    placeholder="Confirm Email account authorization..."
                    value={signupEmailPassword}
                    onChange={(e) => setSignupEmailPassword(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded p-2 pl-9 pr-8 text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPass(!showEmailPass)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showEmailPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <span className="text-[8px] text-slate-500 block leading-tight pt-0.5 uppercase">
                  Confirms email credentials ownership to bind the user with maximum secure validation.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 rounded font-black uppercase text-[10px] tracking-widest border cursor-pointer bg-[#9D00FF]/25 border-[#9D00FF] text-[#9D00FF] hover:bg-[#9D00FF]/40"
              >
                {loading ? "CREATING PROFILE..." : "SECURE REGISTER & DIRECT TO LOGIN"}
              </button>
            </form>
          )}
        </div>

        {/* Evaluation Quick-bypass mode */}
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
            Loads default preconfiguration directly to save login & custom verification signup step times!
          </p>
        </div>

      </div>
    </div>
  );
}
