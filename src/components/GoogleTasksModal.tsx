import React, { useState, useEffect } from "react";
import { 
  X, CheckCircle, Circle, Plus, Trash2, RefreshCw, 
  ListTodo, ExternalLink, AlertTriangle, ShieldCheck, 
  Clock, Database, ArrowRight, Calendar, Tag
} from "lucide-react";
import { initAuth, googleSignIn, logout, getAccessToken, getIdToken } from "../lib/firebase";
import { User } from "firebase/auth";

interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  status: "needsAction" | "completed";
  due?: string;
  updated?: string;
}

interface TaskList {
  id: string;
  title: string;
}

interface GoogleTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleTasksModal({ isOpen, onClose }: GoogleTasksModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [tasklists, setTasklists] = useState<TaskList[]>([]);
  const [selectedTasklistId, setSelectedTasklistId] = useState<string>("@default");
  const [tasks, setTasks] = useState<GoogleTaskItem[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Delete confirmation modal state (MANDATORY per Workspace skill rule)
  const [taskToDelete, setTaskToDelete] = useState<GoogleTaskItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cloud SQL Sync State
  const [cloudSqlSynced, setCloudSqlSynced] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token, idTkn) => {
        setUser(currentUser);
        if (token) setAccessToken(token);
        if (idTkn) setIdToken(idTkn);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIdToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Tasklists and Tasks when authenticated
  useEffect(() => {
    if (user && accessToken) {
      fetchTasklists(accessToken);
    }
  }, [user, accessToken]);

  useEffect(() => {
    if (accessToken && selectedTasklistId) {
      fetchTasks(selectedTasklistId, accessToken);
    }
  }, [selectedTasklistId, accessToken]);

  // Handle Google OAuth Sign In
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setIdToken(res.idToken);
        if (res.idToken) {
          syncUserWithCloudSql(res.idToken);
        }
      }
    } catch (err) {
      console.error("Google sign in failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setIdToken(null);
    setTasks([]);
  };

  // Sync User to Cloud SQL
  const syncUserWithCloudSql = async (tokenString: string) => {
    try {
      await fetch("/api/db/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenString}`
        }
      });
      setCloudSqlSynced(true);
    } catch (err) {
      console.error("Cloud SQL sync user error:", err);
    }
  };

  // Fetch Google Tasklists
  const fetchTasklists = async (token: string) => {
    try {
      const res = await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        setTasklists(items);
        if (items.length > 0) {
          setSelectedTasklistId(items[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tasklists:", err);
    }
  };

  // Fetch Tasks for current tasklist
  const fetchTasks = async (listId: string, token: string) => {
    setIsLoadingTasks(true);
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(listId)}/tasks?showCompleted=true&showHidden=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const fetchedItems: GoogleTaskItem[] = (data.items || []).map((t: any) => ({
          id: t.id,
          title: t.title || "Untitled Task",
          notes: t.notes || "",
          status: t.status === "completed" ? "completed" : "needsAction",
          due: t.due ? t.due.split("T")[0] : undefined,
          updated: t.updated
        }));

        setTasks(fetchedItems);

        // Sync to Cloud SQL in background
        if (idToken) {
          syncTasksToCloudSql(fetchedItems, idToken);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Sync tasks array into Cloud SQL `task_items` table
  const syncTasksToCloudSql = async (items: GoogleTaskItem[], tkn: string) => {
    try {
      for (const item of items) {
        await fetch("/api/db/tasks/upsert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tkn}`
          },
          body: JSON.stringify({
            googleTaskId: item.id,
            tasklistId: selectedTasklistId,
            title: item.title,
            notes: item.notes,
            status: item.status,
            dueDate: item.due
          })
        });
      }
      setCloudSqlSynced(true);
    } catch (err) {
      console.error("Error syncing tasks to Cloud SQL:", err);
    }
  };

  // Create Google Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !accessToken) return;

    setIsCreatingTask(true);
    try {
      const payload: any = {
        title: newTitle.trim(),
        notes: newNotes.trim() || undefined,
      };

      if (newDueDate) {
        payload.due = new Date(newDueDate).toISOString();
      }

      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedTasklistId)}/tasks`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        const newTaskObj: GoogleTaskItem = {
          id: created.id,
          title: created.title,
          notes: created.notes || "",
          status: "needsAction",
          due: created.due ? created.due.split("T")[0] : undefined
        };

        setTasks(prev => [newTaskObj, ...prev]);
        setNewTitle("");
        setNewNotes("");
        setNewDueDate("");

        if (idToken) {
          syncTasksToCloudSql([newTaskObj], idToken);
        }
      }
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Toggle Task Completion State
  const handleToggleTaskStatus = async (task: GoogleTaskItem) => {
    if (!accessToken) return;
    const nextStatus = task.status === "completed" ? "needsAction" : "completed";

    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));

    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedTasklistId)}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus,
          completed: nextStatus === "completed" ? new Date().toISOString() : null
        })
      });

      if (res.ok && idToken) {
        syncTasksToCloudSql([{ ...task, status: nextStatus }], idToken);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      // Revert if failed
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    }
  };

  // Execute Task Deletion (after explicit user confirmation)
  const confirmDeleteTask = async () => {
    if (!taskToDelete || !accessToken) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedTasklistId)}/tasks/${taskToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res.ok || res.status === 204) {
        setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));

        // Delete from Cloud SQL
        if (idToken) {
          await fetch("/api/db/tasks/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`
            },
            body: JSON.stringify({ googleTaskId: taskToDelete.id })
          });
        }
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
    }
  };

  // Quick export academic targets
  const handleQuickAddAcademicTarget = (title: string, notes: string) => {
    setNewTitle(title);
    setNewNotes(notes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-mono text-xs animate-in fade-in duration-200">
      <div className="bg-[#0A0A0F] border border-[#00F0FF]/30 w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-[#00F0FF]/10 relative">
        
        {/* Header Bar */}
        <div className="p-4 bg-[#12121A] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00F0FF]/15 rounded-xl border border-[#00F0FF]/30 text-[#00F0FF]">
              <ListTodo size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black uppercase text-slate-100 tracking-wider">
                  GOOGLE TASKS & CLOUD SQL SYNC ENGINE
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 text-[9px] font-extrabold uppercase">
                  INTEGRATED
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Manage study targets, past paper goals, and sync live tasks to Google Tasks & Cloud SQL PostgreSQL.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#07070F]">
          
          {/* Auth State Banner */}
          {!user || !accessToken ? (
            <div className="p-6 bg-[#12121A] border border-white/10 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[#00F0FF]">
                <ListTodo size={24} />
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-slate-100">Sign in with Google to Connect Google Tasks</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  Grant permission to create and manage your Cambridge study tasks, sync with Google Tasks on your mobile/web, and save records in Cloud SQL.
                </p>
              </div>

              {/* Official Google Material Sign-In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="bg-white hover:bg-slate-100 text-slate-800 font-sans font-medium text-xs px-5 py-2.5 rounded-xl border border-slate-300 shadow-md flex items-center gap-3 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>{isLoggingIn ? "Signing in..." : "Sign in with Google"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Authenticated Header Status Strip */}
              <div className="p-3 bg-[#12121A] border border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-200 font-bold">
                    Signed in as: <span className="text-[#00F0FF]">{user.email}</span>
                  </span>
                  {cloudSqlSynced && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <Database size={11} /> Cloud SQL PostgreSQL Synced
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded font-bold uppercase cursor-pointer transition-all"
                >
                  Sign Out
                </button>
              </div>

              {/* Tasklist Picker & Refresh */}
              <div className="flex items-center justify-between gap-3 bg-[#0A0A0F] p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Tasklist:</label>
                  <select
                    value={selectedTasklistId}
                    onChange={(e) => setSelectedTasklistId(e.target.value)}
                    className="bg-[#12121A] border border-white/10 text-slate-200 text-[10px] rounded px-2 py-1 focus:outline-none cursor-pointer font-bold"
                  >
                    {tasklists.length === 0 ? (
                      <option value="@default">Default List</option>
                    ) : (
                      tasklists.map(tl => (
                        <option key={tl.id} value={tl.id} className="bg-[#12121A]">
                          {tl.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <button
                  onClick={() => fetchTasks(selectedTasklistId, accessToken)}
                  disabled={isLoadingTasks}
                  className="px-3 py-1 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 rounded font-bold uppercase flex items-center gap-1.5 cursor-pointer text-[10px] transition-all"
                >
                  <RefreshCw size={12} className={isLoadingTasks ? "animate-spin" : ""} />
                  Sync Tasks
                </button>
              </div>

              {/* Add New Task Form */}
              <form onSubmit={handleCreateTask} className="p-4 bg-[#12121A] border border-white/10 rounded-xl space-y-3">
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Plus size={14} className="text-[#00F0FF]" /> ADD NEW GOOGLE TASK
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task title (e.g. 'Solve Physics 9702 P2 Oct/Nov 2024')..."
                    className="sm:col-span-2 bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                    required
                  />

                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Optional notes or syllabus references..."
                    className="flex-1 bg-[#0A0A0F] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                  />

                  <button
                    type="submit"
                    disabled={isCreatingTask || !newTitle.trim()}
                    className="px-4 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/80 disabled:opacity-40 text-black font-black uppercase text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Plus size={14} /> Add Task
                  </button>
                </div>
              </form>

              {/* Quick Academic Preset Export */}
              <div className="p-3 bg-[#0E0E17] border border-white/5 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Study Presets (Click to autofill form):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Physics 9702 Past Paper", title: "Complete Physics 9702 Paper 2 Past Paper", notes: "Focus on kinematics & wave superposition mark scheme key words." },
                    { label: "Chemistry 9701 Organic", title: "Revise Chemistry 9701 Organic Mechanisms", notes: "Review nucleophilic substitution SN1 vs SN2 curly arrows." },
                    { label: "Maths 9709 Integration", title: "Practice Math 9709 Integration by Parts", notes: "Solve 5 exam questions from 2023 May/June series." },
                    { label: "Resolve Mistake Vault", title: "Resolve 3 items in Saber Mistake Vault", notes: "Review wrong approaches and memorize corrected derivations." }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAddAcademicTarget(preset.title, preset.notes)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-[#00F0FF]/15 hover:border-[#00F0FF]/30 text-slate-300 hover:text-[#00F0FF] border border-white/10 rounded-lg text-[10px] font-mono transition-all cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Task List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Your Tasks ({tasks.length})</span>
                  <span>Status & Actions</span>
                </div>

                {isLoadingTasks ? (
                  <div className="p-8 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-[#00F0FF]" /> Loading Google Tasks...
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 font-mono text-xs">
                    No tasks found in this tasklist. Create a new task above!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 bg-[#12121A] border rounded-xl flex items-start justify-between gap-3 transition-all ${
                          task.status === "completed"
                            ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                            : "border-white/10 hover:border-[#00F0FF]/30"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleTaskStatus(task)}
                            className="mt-0.5 text-slate-400 hover:text-[#00F0FF] cursor-pointer transition-colors"
                            title={task.status === "completed" ? "Mark incomplete" : "Mark complete"}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle size={18} className="text-emerald-400" />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>

                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className={`text-xs font-bold text-slate-200 break-words ${
                              task.status === "completed" ? "line-through text-slate-400" : ""
                            }`}>
                              {task.title}
                            </h4>
                            {task.notes && (
                              <p className="text-[10px] text-slate-400 break-words line-clamp-2">
                                {task.notes}
                              </p>
                            )}
                            {task.due && (
                              <div className="flex items-center gap-1 text-[9px] text-amber-400 font-mono pt-1">
                                <Calendar size={10} /> Due: {task.due}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Trigger Delete Confirmation Dialog */}
                        <button
                          type="button"
                          onClick={() => setTaskToDelete(task)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-500/20 shrink-0"
                          title="Delete Google task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* MANDATORY EXPLICIT USER CONFIRMATION MODAL FOR DESTRUCTIVE TASK DELETION */}
      {taskToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#12121A] border border-red-500/40 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl shadow-red-500/20 font-mono text-xs relative">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/40">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-sm font-black uppercase text-slate-100">
                Confirm Task Deletion
              </h3>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Are you sure you want to permanently delete this task from Google Tasks and Cloud SQL?
            </p>

            <div className="p-3 bg-[#0A0A0F] border border-white/10 rounded-xl space-y-1">
              <div className="font-bold text-slate-200">{taskToDelete.title}</div>
              {taskToDelete.notes && (
                <div className="text-[10px] text-slate-400">{taskToDelete.notes}</div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black uppercase rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} /> Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
