import express from "express";
import path from "path";
import http from "http";
import fs from "fs";
import crypto from "crypto";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { TestAnalytics, MistakeVault, DaySchedule, SubjectId, OnboardingConfig } from "./src/types";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { getUserTaskItems, upsertTaskItem, deleteTaskItemByGoogleId, getUserStudyData, saveUserStudyData } from "./src/db/tasks.ts";

// Security Helper: Hashing
function createSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database path
  const DB_FILE = path.join(process.cwd(), "db.json");

  // Load database from file
  function loadDB() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("[DB] File reading error. Initializing empty:", err);
    }
    return { users: {} };
  }

  // Save database to file
  function saveDB(data: any) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("[DB] Writing error:", err);
    }
  }

  // Initial Seeding of a guest user for instant premium demonstration
  let db = loadDB();
  const guestUsername = "guest";
  if (!db.users || !db.users[guestUsername]) {
    const salt = createSalt();
    const hash = hashPassword("password123", salt);
    
    // Seed initial guest user with standard academic seeds
    db.users = db.users || {};
    db.users[guestUsername] = {
      username: guestUsername,
      salt,
      passwordHash: hash,
      onboarded: true,
      currentOverrideState: null,
      config: {
        board: "CIE",
        subVariant: "AS/A LEVELS",
        schoolStartDate: "2026-06-01",
        revisionStartDate: "2026-10-01",
        boardExamDate: "2026-11-20",
        subjects: [
          {
            name: "Chemistry",
            components: [
              { name: "Paper 1 (MCQ)", maxMarks: 40 },
              { name: "Paper 2 (AS Structured)", maxMarks: 60 },
              { name: "Paper 3 (Practical)", maxMarks: 40 }
            ],
            totalMark: 140,
            totalPaperTarget: 30,
            yearRangeStart: 2022,
            yearRangeEnd: 2026,
            series: ["Feb/March", "May/June", "Oct/Nov"],
            chronologicalRule: [2025, 2026, 2024],
            componentSequence: ["Paper 1 (MCQ)", "Paper 2 (AS Structured)", "Paper 3 (Practical)"],
            completedTopics: ["Atoms, molecules, and stoichiometry"]
          },
          {
            name: "Physics",
            components: [
              { name: "Paper 1 (MCQ)", maxMarks: 40 },
              { name: "Paper 2 (AS Structured)", maxMarks: 60 },
              { name: "Paper 3 (Practical)", maxMarks: 40 }
            ],
            totalMark: 140,
            totalPaperTarget: 30,
            yearRangeStart: 2022,
            yearRangeEnd: 2026,
            series: ["Feb/March", "May/June", "Oct/Nov"],
            chronologicalRule: [2025, 2026, 2024],
            componentSequence: ["Paper 1 (MCQ)", "Paper 2 (AS Structured)", "Paper 3 (Practical)"],
            completedTopics: []
          },
          {
            name: "Computer Science",
            components: [
              { name: "Paper 1 (Theory Fundamentals)", maxMarks: 75 },
              { name: "Paper 2 (Programming & Logic)", maxMarks: 75 }
            ],
            totalMark: 150,
            totalPaperTarget: 30,
            yearRangeStart: 2022,
            yearRangeEnd: 2026,
            series: ["May/June", "Oct/Nov"],
            chronologicalRule: [2025, 2026, 2024],
            componentSequence: ["Paper 1 (Theory Fundamentals)", "Paper 2 (Programming & Logic)"],
            completedTopics: ["Information representation"]
          },
          {
            name: "Math",
            components: [
              { name: "Paper 1 (Pure Mathematics 1)", maxMarks: 75 },
              { name: "Paper 5 (Probability & Statistics 1)", maxMarks: 50 },
              { name: "Paper 4 (Mechanics 1)", maxMarks: 50 }
            ],
            totalMark: 175,
            totalPaperTarget: 35,
            yearRangeStart: 2022,
            yearRangeEnd: 2026,
            series: ["Feb/March", "May/June", "Oct/Nov"],
            chronologicalRule: [2025, 2026, 2024],
            componentSequence: ["Paper 1 (Pure Mathematics 1)", "Paper 5 (Probability & Statistics 1)", "Paper 4 (Mechanics 1)"],
            completedTopics: ["Quadratics"]
          },
          {
            name: "English",
            components: [
              { name: "Paper 1 (Essay)", maxMarks: 50 },
              { name: "Paper 2 (Comprehension)", maxMarks: 50 }
            ],
            totalMark: 100,
            totalPaperTarget: 20,
            yearRangeStart: 2022,
            yearRangeEnd: 2026,
            series: ["May/June", "Oct/Nov"],
            chronologicalRule: [2025, 2026, 2024],
            componentSequence: ["Paper 1 (Essay)", "Paper 2 (Comprehension)"],
            completedTopics: []
          }
        ]
      },
      testAnalytics: [
        {
          id: "test_1",
          name: "Computer Science Paper 1 - Past Paper 2025",
          classification: "Past Paper",
          rawScore: 68,
          totalMaxPoints: 75,
          percentage: 90.6,
          gritLog: "Flawless on OOP design and assembly logic. Lost some marks on Karnaugh map simplification state. Need to re-verify boolean expressions.",
          date: "2026-05-02"
        },
        {
          id: "test_2",
          name: "Chemistry Term Mock Unit 4",
          classification: "Mock",
          rawScore: 54,
          totalMaxPoints: 80,
          percentage: 67.5,
          gritLog: "CONCEPT GAP: Weak transient state concentration graphs. Miscalculated activation energy in Arrhenius plot. Action Plan: Drill chemical kinetics questions.",
          date: "2026-05-10"
        },
        {
          id: "test_3",
          name: "Maths Advanced Calculus - Monthly Test",
          classification: "Monthly",
          rawScore: 48,
          totalMaxPoints: 50,
          percentage: 96.0,
          gritLog: "Elite integration by parts. Perfectly optimized the bounded volume. Negligible arithmetic slip on decimal rounding on final proof.",
          date: "2026-05-14"
        }
      ],
      mistakeVault: [
        {
          id: "m_1",
          subject: "Chemistry",
          description: "Arrhenius plot activation energy (Ea) sign calculation mixup.",
          wrongApproach: "ln(k) = - (Ea / R) * (1/T) + ln(A)\nSlope m was calculated as -2400 K\nm = Ea / R  ==>  Ea = -2400 * 8.314 = -19.9 kJ/mol\n[ERROR: Activation energy calculated as NEGATIVE. Physically impossible.]",
          correctedSequence: "Slope of Arrhenius plot is EQUAL TO -Ea / R\nm = -Ea / R  ==>  -2400 = -Ea / 8.314\nEa = 2400 * 8.314 = +19.95 kJ/mol\n[CORRECTED WORKFLOW: Activation energy must ALWAYS be positive for endothermic/exothermic barriers.]",
          resolved: false,
          dateAdded: "2026-05-10"
        },
        {
          id: "m_2",
          subject: "Computer Science",
          description: "Assembly branch pointer index offset alignment shift during array iteration.",
          wrongApproach: "LDR R0, [R1, #1]  ; Read next byte index\nADD R1, R1, #1   ; Linear increment byte array\n[ERROR: CPU is running on a word-designed addressing bus (4 bytes per word). Linear increment of #1 causes misalignment faults.]",
          correctedSequence: "LDR R0, [R1, #4]  ; Read next Word boundary\nADD R1, R1, #4   ; Increment address register by 4 bytes to align with 32-bit registers\n[CORRECTED WORKFLOW: Align word indexing offsets with architecture bit-widths.]",
          resolved: true,
          dateAdded: "2026-05-12"
        }
      ]
    };
    saveDB(db);
  }

  // Session token mapping helper (persistent in DB)
  const tokenStore = {
    get(token: string): string | undefined {
      db = loadDB();
      db.tokens = db.tokens || {};
      return db.tokens[token];
    },
    set(token: string, username: string) {
      db = loadDB();
      db.tokens = db.tokens || {};
      db.tokens[token] = username;
      saveDB(db);
    },
    delete(token: string) {
      db = loadDB();
      db.tokens = db.tokens || {};
      delete db.tokens[token];
      saveDB(db);
    }
  };

  // Default syllabus topics library mapped to Subject Groups
  const defaultSyllabus: Record<SubjectId, { groupA: { name: string; topics: string[] }; groupB: { name: string; topics: string[] } }> = {
    "Chemistry": {
      groupA: {
        name: "Physical Chemistry",
        topics: [
          "Atoms, molecules, and stoichiometry",
          "Atomic structure",
          "Chemical bonding",
          "States of matter",
          "Chemical energetics",
          "Electrochemistry",
          "Equilibria",
          "Reaction kinetics"
        ]
      },
      groupB: {
        name: "Inorganic & Organic Chemistry",
        topics: [
          "Periodic table trends",
          "Group 2 elements",
          "Group 17 (halogens)",
          "Nitrogen and sulfur",
          "Intro to organic chemistry",
          "Hydrocarbons (alkanes + alkenes)",
          "Halogenoalkanes",
          "Alcohols",
          "Organic reaction mechanisms"
        ]
      }
    },
    "Math": {
      groupA: {
        name: "Pure Mathematics 1 (P1)",
        topics: [
          "Quadratics",
          "Functions",
          "Coordinate geometry",
          "Circular measure",
          "Trigonometry",
          "Series",
          "Differentiation",
          "Integration"
        ]
      },
      groupB: {
        name: "Statistics 1 & Mechanics",
        topics: [
          "Representation of data",
          "Permutations & combinations",
          "Probability",
          "Discrete random variables",
          "Normal distribution",
          "Forces and equilibrium",
          "Kinematics (motion)",
          "Momentum",
          "Newton’s laws",
          "Energy, work, power"
        ]
      }
    },
    "Physics": {
      groupA: {
        name: "General Physics & Mechanics",
        topics: [
          "Physical quantities and units",
          "Measurement techniques",
          "Kinematics",
          "Dynamics",
          "Forces and equilibrium",
          "Work, energy, power",
          "Momentum"
        ]
      },
      groupB: {
        name: "Waves, Electricity & Modern",
        topics: [
          "Waves",
          "Superposition",
          "Electric fields",
          "Current electricity",
          "Particle physics"
        ]
      }
    },
    "Computer Science": {
      groupA: {
        name: "Theory, Software & Logic",
        topics: [
          "Information representation",
          "Communication and internet technologies",
          "Hardware",
          "Processor fundamentals",
          "System software",
          "Security",
          "Ethics and legal issues"
        ]
      },
      groupB: {
        name: "Programming & Problem Solving",
        topics: [
          "Algorithm design",
          "Pseudocode",
          "Data structures",
          "Programming concepts"
        ]
      }
    },
    "English": {
      groupA: {
        name: "Core Skills & Practice Units",
        topics: [
          "Essay structure (intro, body, conclusion)",
          "Argument building",
          "Critical thinking",
          "Evaluating arguments",
          "Developing examples",
          "Reading for meaning",
          "Inference",
          "Language analysis",
          "Summarising",
          "Persuasive writing",
          "Essay writing practice",
          "Timed essays",
          "Comprehension practice",
          "Vocabulary building"
        ]
      },
      groupB: {
        name: "Topic Content Bank",
        topics: [
          "Government & political systems",
          "Human rights",
          "Justice & law",
          "Education",
          "Globalisation",
          "Medical ethics",
          "Environment",
          "Technology impact",
          "AI & privacy",
          "Media influence",
          "Censorship",
          "Literature & arts",
          "Communication"
        ]
      }
    }
  };

  // Helper function to calculate phase based on a date in 2026
  function calculateSystemPhase(config: OnboardingConfig | null): number {
    if (!config) return 1;
    const today = new Date("2026-05-20T05:49:41Z");
    
    const d1 = new Date(config.schoolStartDate + "T00:00:00Z");
    const d2 = new Date(config.revisionStartDate + "T00:00:00Z");
    const d3 = new Date(config.boardExamDate + "T00:00:00Z");

    const d2Minus30 = new Date(d2.getTime() - 30 * 24 * 60 * 60 * 1000);
    const d3Minus20 = new Date(d3.getTime() - 20 * 24 * 60 * 60 * 1000);

    if (today < d1) {
      return 1; // Phase 1: Foundation (Current -> D1)
    } else if (today >= d1 && today < d2Minus30) {
      return 2; // Phase 2: Active Recall (D1 -> D2-30)
    } else if (today >= d2Minus30 && today < d3Minus20) {
      return 3; // Phase 3: Past Paper Marathon (D2-30 -> D3-20)
    } else {
      return 4; // Phase 4/Pre-Exam window: (D3-20 -> D3)
    }
  }

  // Generates past paper schedule orders dynamically based on Saber-Metrics rules
  function generatePastPaperTask(subjectConfig: any, dayOffset: number): string {
    const listYears = subjectConfig.chronologicalRule || [2026];
    const listSeries = subjectConfig.series || ["May/June"];
    const listComponents = subjectConfig.componentSequence || ["Component 12"];

    // Total combinations of Year * Series * Components
    const combinations: string[] = [];
    for (const year of listYears) {
      for (const ser of listSeries) {
        for (const comp of listComponents) {
          combinations.push(`${comp} (${ser} ${year})`);
        }
      }
    }

    if (combinations.length === 0) return "General Practice Exercises";
    
    // Pick based on day index safely
    const index = dayOffset % combinations.length;
    return `${subjectConfig.name} ${combinations[index]}`;
  }

  // Dynamic schedule generator matching Day cycles and Syllabus groups
  function getRotationSchedule(phaseId: number, user: any): DaySchedule[] {
    const config = user.config;
    const enrolledSubjects = user.config?.subjects || [];
    const completedList = new Set(enrolledSubjects.flatMap((s: any) => s.completedTopics || []) || []);

    if (enrolledSubjects.length === 0) {
      return [
        {
          dayName: "DAY TYPE A",
          dayType: "A",
          subjects: [],
          targets: "No enrolled subjects detected. Add subjects in profile."
        }
      ];
    }

    // Helper to find first uncompleted topic for a given subject object or name
    function getTopicForSubject(subjObj: any, firstGroup: boolean): string {
      const sName = typeof subjObj === 'string' ? subjObj : subjObj.name;
      const g = (config && config.customSyllabus && config.customSyllabus[sName]) || defaultSyllabus[sName];
      if (!g) return `${sName} -> Review Core Specs`;
      
      let targetList: string[] = [];
      if (Array.isArray(g)) {
        if (firstGroup) {
          targetList = g[0]?.topics || [];
        } else {
          targetList = (g[1] || g[0])?.topics || [];
        }
      } else {
        targetList = firstGroup ? (g.groupA?.topics || []) : (g.groupB?.topics || []);
      }
      
      const uncompleted = targetList.find(t => !completedList.has(t));
      return uncompleted ? `${sName}: ${uncompleted}` : `${sName}: [ALL TOPICS ARCHIVED]`;
    }

    const sNames = enrolledSubjects.map((s: any) => s.name);

    if (phaseId === 1) {
      // 3-Day operational cycle dynamically partitioned over enrolled subjects
      const sub1 = sNames[0] || "General";
      const sub2 = sNames[1] || sub1;
      const sub3 = sNames[2] || sub2;

      return [
        {
          dayName: "DAY TYPE A",
          dayType: "A",
          subjects: [sub1, sub2],
          targets: `${getTopicForSubject(sub1, true)} // ${getTopicForSubject(sub2, true)}`
        },
        {
          dayName: "DAY TYPE B",
          dayType: "B",
          subjects: [sub2, sub3],
          targets: `${getTopicForSubject(sub2, false)} // ${getTopicForSubject(sub3, true)}`
        },
        {
          dayName: "DAY TYPE C",
          dayType: "C",
          subjects: [sub1, sub3],
          targets: `${getTopicForSubject(sub1, false)} // ${getTopicForSubject(sub3, false)}`
        }
      ];
    } else if (phaseId === 2) {
      // 5-Day horizontal rotational active recall layout
      return [
        {
          dayName: "DAY BLOCK 1",
          dayType: "D1",
          subjects: sNames.slice(0, 2),
          targets: `Recall drill: ${getTopicForSubject(sNames[0] || "General", true)}`
        },
        {
          dayName: "DAY BLOCK 2",
          dayType: "D2",
          subjects: sNames.slice(1, 3),
          targets: `Recall drill: ${getTopicForSubject(sNames[1] || sNames[0] || "General", true)}`
        },
        {
          dayName: "DAY BLOCK 3",
          dayType: "D3",
          subjects: sNames.slice(0, 3),
          targets: `Recall drill: ${getTopicForSubject(sNames[2] || sNames[0] || "General", false)}`
        },
        {
          dayName: "DAY BLOCK 4",
          dayType: "D4",
          subjects: sNames.slice(1, 4),
          targets: `Recall drill: ${getTopicForSubject(sNames[0] || "General", false)}`
        },
        {
          dayName: "DAY BLOCK 5",
          dayType: "D5",
          subjects: sNames,
          targets: `Full recall integration drill across all enrolled subjects`
        }
      ];
    } else {
      // Phase 3 Past Paper High intensity cycle
      const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
      const dayCodes = ["PA", "PB", "PC", "PD", "PE", "PM1", "PM2"];

      return days.map((dayName, idx) => {
        const primarySubjObj = enrolledSubjects[idx % enrolledSubjects.length];
        const secondarySubjObj = enrolledSubjects[(idx + 1) % enrolledSubjects.length];
        const task1 = generatePastPaperTask(primarySubjObj, idx);
        const task2 = generatePastPaperTask(secondarySubjObj, idx + 1);

        return {
          dayName,
          dayType: dayCodes[idx],
          subjects: [primarySubjObj.name, secondarySubjObj.name].filter((v, i, a) => a.indexOf(v) === i),
          targets: `[PAST PAPER RUNTIME]: ${task1} // ${task2}`,
          extraFlag: idx >= 5 ? "MAX_LOAD" : undefined
        };
      });
    }
  }

  // Middleware to authenticate user using Authorization Header
  function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const username = tokenStore.get(token);
    if (!username) {
      return res.status(403).json({ error: "Invalid or expired session token" });
    }

    // Load active DB state
    db = loadDB();
    if (!db.users || !db.users[username]) {
      return res.status(404).json({ error: "Credential record not found" });
    }

    req.user = db.users[username];
    next();
  }

  // Authentication REST Endpoints

  // User Sign-up (Direct registration without OTP check)
  app.post("/api/auth/signup", (req, res) => {
    try {
      const { name, username, password, email, emailPassword } = req.body;
      if (!name || !username || !password || !email || !emailPassword) {
        return res.status(400).json({ error: "All properties (Name, Username, Password, Email, Email's Password) are strictly required." });
      }

      if (username.trim().length === 0 || password.length === 0 || email.trim().length === 0) {
        return res.status(400).json({ error: "Supplied parameters must contain actual text contents." });
      }

      db = loadDB();
      db.users = db.users || {};
      const targetUser = username.trim().toLowerCase();
      const targetEmail = email.trim().toLowerCase();

      // Rule: Username must be globally unique
      if (db.users[targetUser]) {
        return res.status(400).json({ error: "Username is already taken by another student. Try a different unique identity!" });
      }

      // Rule: A username can never be the same for different emails
      for (const u of Object.keys(db.users)) {
        if (db.users[u].email?.toLowerCase() === targetEmail) {
          return res.status(400).json({ error: "This email is already associated with an existing student profile." });
        }
      }

      const salt = createSalt();
      const passwordHash = hashPassword(password, salt);
      const emailPasswordHash = hashPassword(emailPassword, salt);

      db.users[targetUser] = {
        username: targetUser,
        name: name.trim(),
        email: targetEmail,
        salt,
        passwordHash,
        emailPasswordHash,
        onboarded: false,
        config: null,
        testAnalytics: [],
        mistakeVault: [],
        currentOverrideState: null
      };

      saveDB(db);

      res.status(201).json({
        success: true,
        message: "Your profile has been registered successfully! Directing you to the login portal..."
      });
    } catch (error: any) {
      console.error("Direct signup operation crashed:", error);
      res.status(500).json({ error: "Server error occurred during account creation." });
    }
  });

  // User Log-in
  app.post("/api/auth/login", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Missing login parameters" });
      }

      db = loadDB();
      const targetUser = username.trim().toLowerCase();
      const user = db.users[targetUser];

      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const hash = hashPassword(password, user.salt);
      if (hash !== user.passwordHash) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate Session Token
      const sessionToken = crypto.randomBytes(32).toString("hex");
      tokenStore.set(sessionToken, targetUser);

      res.json({
        success: true,
        token: sessionToken,
        user: {
          username: user.username,
          onboarded: user.onboarded
        }
      });
    } catch (error: any) {
      console.error("Log-in error:", error);
      res.status(500).json({ error: "Critical server error during security checks" });
    }
  });

  // User Profile
  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({
      username: req.user.username,
      onboarded: req.user.onboarded,
      config: req.user.config
    });
  });

  // User Log-out
  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      tokenStore.delete(token);
    }
    res.json({ success: true, message: "Logged out successfully" });
  });

  // Password Recovery - Request Reset
  app.post("/api/auth/forgot-password", (req, res) => {
    try {
      const { usernameOrEmail } = req.body;
      if (!usernameOrEmail) {
        return res.status(400).json({ error: "Username or Email is required for password recovery" });
      }

      db = loadDB();
      const targetKey = usernameOrEmail.trim().toLowerCase();
      
      let matchedUser = Object.values(db.users || {}).find(
        (u: any) => u.username?.toLowerCase() === targetKey || u.email?.toLowerCase() === targetKey
      ) as any;

      if (!matchedUser) {
        return res.status(404).json({ error: "No student profile found with provided identity credential" });
      }

      const resetToken = crypto.randomBytes(16).toString("hex");
      matchedUser.resetToken = resetToken;
      db.users[matchedUser.username] = matchedUser;
      saveDB(db);

      res.json({
        success: true,
        message: `Security clearance token generated for ${matchedUser.username}! Verification link dispatched.`,
        resetToken,
        username: matchedUser.username
      });
    } catch (err: any) {
      res.status(500).json({ error: "Password recovery process failed" });
    }
  });

  // Password Recovery - Reset Password
  app.post("/api/auth/reset-password", (req, res) => {
    try {
      const { username, newPassword } = req.body;
      if (!username || !newPassword) {
        return res.status(400).json({ error: "Username and new password are required" });
      }

      db = loadDB();
      const targetUser = username.trim().toLowerCase();
      const user = db.users[targetUser];

      if (!user) {
        return res.status(404).json({ error: "User profile not found" });
      }

      const salt = createSalt();
      const passwordHash = hashPassword(newPassword, salt);
      user.salt = salt;
      user.passwordHash = passwordHash;
      user.resetToken = undefined;

      db.users[targetUser] = user;
      saveDB(db);

      res.json({
        success: true,
        message: "Password updated successfully! Redirecting to login portal..."
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed resetting password" });
    }
  });

  // Google OAuth Verification Flow Simulation
  app.post("/api/auth/google-oauth", (req, res) => {
    try {
      const { email, name } = req.body;
      const targetEmail = (email || "student.cie@gmail.com").trim().toLowerCase();
      const targetName = name || "CIE Student Candidate";
      const targetUsername = targetEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");

      db = loadDB();
      db.users = db.users || {};

      let existingUser = Object.values(db.users).find((u: any) => u.email?.toLowerCase() === targetEmail) as any;

      if (!existingUser) {
        const salt = createSalt();
        const passwordHash = hashPassword("OAuthPass123!", salt);
        existingUser = {
          username: targetUsername,
          name: targetName,
          email: targetEmail,
          salt,
          passwordHash,
          onboarded: false,
          config: null,
          testAnalytics: [],
          mistakeVault: [],
          userResources: [],
          currentOverrideState: null
        };
        db.users[targetUsername] = existingUser;
        saveDB(db);
      }

      const sessionToken = crypto.randomBytes(32).toString("hex");
      tokenStore.set(sessionToken, existingUser.username);

      res.json({
        success: true,
        token: sessionToken,
        user: {
          username: existingUser.username,
          onboarded: existingUser.onboarded
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: "Google OAuth verification process failed" });
    }
  });

  // Live Profile Details Manager - Update username, academic level (AS/A Level), and enrolled subjects
  app.post("/api/profile/update-details", authenticateToken, (req: any, res) => {
    try {
      const { username: newUsername, subVariant, subjects } = req.body;
      const currentUsername = req.user.username;

      db = loadDB();
      const user = db.users[currentUsername];
      if (!user) {
        return res.status(404).json({ error: "User profile not found" });
      }

      let updatedUsername = currentUsername;

      // Handle Username Change if provided and different
      if (newUsername && newUsername.trim().toLowerCase() !== currentUsername.toLowerCase()) {
        const trimmedNew = newUsername.trim().toLowerCase();
        if (trimmedNew.length < 3) {
          return res.status(400).json({ error: "Username must be at least 3 characters long" });
        }
        if (db.users[trimmedNew]) {
          return res.status(400).json({ error: "Username is already taken by another student" });
        }

        // Migrate user record key
        delete db.users[currentUsername];
        user.username = trimmedNew;
        db.users[trimmedNew] = user;
        updatedUsername = trimmedNew;

        // Update active session tokens
        if (db.tokens) {
          for (const tokenKey of Object.keys(db.tokens)) {
            if (db.tokens[tokenKey] === currentUsername) {
              db.tokens[tokenKey] = trimmedNew;
            }
          }
        }
      }

      if (!user.config) {
        user.config = {
          board: "CIE",
          subVariant: subVariant || "AS LEVEL",
          schoolStartDate: "2026-06-01",
          revisionStartDate: "2026-10-01",
          boardExamDate: "2026-11-20",
          subjects: subjects || []
        };
      } else {
        if (subVariant) user.config.subVariant = subVariant;
        if (Array.isArray(subjects)) user.config.subjects = subjects;
      }

      saveDB(db);

      const calcPhase = calculateSystemPhase(user.config);
      const activePhase = user.currentOverrideState !== null ? user.currentOverrideState : calcPhase;
      const rotation = getRotationSchedule(activePhase, user);

      // Broadcast update
      broadcastUpdate(updatedUsername, {
        type: "SYNC_ONBOARDING",
        user,
        schedule: rotation
      });

      res.json({
        success: true,
        username: updatedUsername,
        config: user.config,
        schedule: rotation
      });
    } catch (err: any) {
      console.error("Failed updating profile details:", err);
      res.status(500).json({ error: "Failed updating profile details" });
    }
  });

  // Security - Change Password API Endpoint
  app.post("/api/profile/change-password", authenticateToken, (req: any, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const activeUser = req.user.username;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "Old password, new password, and confirmation are strictly required" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New password and confirmation password do not match" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }

      db = loadDB();
      const user = db.users[activeUser];
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify Old Password
      const oldHash = hashPassword(oldPassword, user.salt);
      if (oldHash !== user.passwordHash) {
        return res.status(401).json({ error: "Current password entered is incorrect" });
      }

      // Re-hash with fresh salt
      const newSalt = createSalt();
      const newHash = hashPassword(newPassword, newSalt);

      user.salt = newSalt;
      user.passwordHash = newHash;
      db.users[activeUser] = user;
      saveDB(db);

      res.json({
        success: true,
        message: "Your password has been changed successfully!"
      });
    } catch (err: any) {
      console.error("Change password error:", err);
      res.status(500).json({ error: "Failed updating password" });
    }
  });

  // User Cloud Resource Drive GET
  app.get("/api/resources/user-drive", authenticateToken, (req: any, res) => {
    const resources = req.user.userResources || [];
    res.json(resources);
  });

  // User Cloud Resource Drive POST (Upload/Add resource)
  app.post("/api/resources/user-drive", authenticateToken, (req: any, res) => {
    try {
      const { title, subject, category, url, notes, fileData } = req.body;
      const activeUser = req.user.username;

      if (!title || !subject) {
        return res.status(400).json({ error: "Title and Subject are required" });
      }

      const newResource = {
        id: "res_" + Date.now(),
        title,
        subject,
        category: category || "Notes",
        url: url || "",
        notes: notes || "",
        fileData: fileData || undefined,
        dateAdded: new Date().toISOString().split("T")[0]
      };

      db = loadDB();
      db.users[activeUser].userResources = db.users[activeUser].userResources || [];
      db.users[activeUser].userResources.unshift(newResource);
      saveDB(db);

      res.status(201).json(newResource);
    } catch (err: any) {
      res.status(500).json({ error: "Failed saving user resource" });
    }
  });

  // User Cloud Resource Drive DELETE
  app.delete("/api/resources/user-drive/:id", authenticateToken, (req: any, res) => {
    try {
      const { id } = req.params;
      const activeUser = req.user.username;

      db = loadDB();
      const list = db.users[activeUser].userResources || [];
      db.users[activeUser].userResources = list.filter((r: any) => r.id !== id);
      saveDB(db);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: "Failed deleting resource" });
    }
  });

  // Onboarding Wizard Configuration Save
  app.post("/api/onboarding", authenticateToken, (req: any, res) => {
    try {
      const { config } = req.body;
      if (!config || !config.board || !config.subjects || !config.schoolStartDate || !config.revisionStartDate || !config.boardExamDate) {
        return res.status(400).json({ error: "Invalid Onboarding Setup payload criteria" });
      }

      const activeUser = req.user.username;
      db = loadDB();
      
      db.users[activeUser].config = config;
      db.users[activeUser].onboarded = true;
      db.users[activeUser].currentOverrideState = null; // reset override on re-onboard
      
      saveDB(db);

      // Notify Connected user cycles immediately via Websocket
      broadcastUpdate(activeUser, { type: "SYNC_ONBOARDING", user: db.users[activeUser] });

      res.json({
        success: true,
        onboarded: true,
        config: db.users[activeUser].config
      });
    } catch (error: any) {
      console.error("Onboarding saving error:", error);
      res.status(500).json({ error: "Failed to persist onboarding state configuration" });
    }
  });

  // Core Dashboard Engine Calculations
  app.get("/api/dashboard/state", authenticateToken, (req: any, res) => {
    try {
      const user = req.user;
      const c = user.config;

      const calcPhase = calculateSystemPhase(c);
      const activePhase = user.currentOverrideState !== null ? user.currentOverrideState : calcPhase;
      const rotation = getRotationSchedule(activePhase, user);

      res.json({
        onboarded: user.onboarded,
        systemCalculatedPhase: calcPhase,
        currentOverrideState: user.currentOverrideState,
        activePhaseId: activePhase,
        localTime: "2026-05-20T05:49:41Z",
        schedule: rotation,
        config: c
      });
    } catch (error: any) {
      console.error("Dashboard calculation error:", error);
      res.status(500).json({ error: "Calculation process failed" });
    }
  });

  // Manual Phase Overrides
  app.post("/api/dashboard/override", authenticateToken, (req: any, res) => {
    try {
      const { overridePhase } = req.body;
      const user = req.user;
      const activeUser = user.username;

      if (overridePhase === null || [1, 2, 3, 4].includes(overridePhase)) {
        db = loadDB();
        db.users[activeUser].currentOverrideState = overridePhase;
        saveDB(db);

        const updatedUser = db.users[activeUser];
        const calcPhase = calculateSystemPhase(updatedUser.config);
        const activePhase = overridePhase !== null ? overridePhase : calcPhase;
        const rotation = getRotationSchedule(activePhase, updatedUser);

        const broadcastPayload = {
          type: "SYNC_OVERRIDE",
          systemCalculatedPhase: calcPhase,
          currentOverrideState: overridePhase,
          activePhaseId: activePhase,
          schedule: rotation
        };

        // Broadcast to WebSocket connections
        broadcastUpdate(activeUser, broadcastPayload);

        res.json({
          success: true,
          systemCalculatedPhase: calcPhase,
          currentOverrideState: overridePhase,
          activePhaseId: activePhase,
          schedule: rotation
        });
      } else {
        res.status(400).json({ error: "Phase override out of range" });
      }
    } catch (error: any) {
      console.error("Internal override error:", error);
      res.status(500).json({ error: "Failed setting manual override" });
    }
  });

  // Test Analytics GET
  app.get("/api/analytics", authenticateToken, (req: any, res) => {
    res.json(req.user.testAnalytics || []);
  });

  // Log/Add Test Result
  app.post("/api/analytics/test", authenticateToken, (req: any, res) => {
    try {
      const { name, classification, rawScore, totalMaxPoints, gritLog, examYear, examSeries, subject } = req.body;
      const targetUser = req.user.username;

      if (!name || !classification || rawScore === undefined || !totalMaxPoints) {
        return res.status(400).json({ error: "Parameters invalid" });
      }

      const numRaw = Number(rawScore);
      const numTotal = Number(totalMaxPoints);
      const percentage = parseFloat(((numRaw / numTotal) * 100).toFixed(1));

      const newTest: TestAnalytics = {
        id: "test_" + Date.now(),
        name,
        classification,
        rawScore: numRaw,
        totalMaxPoints: numTotal,
        percentage,
        gritLog: gritLog || `Log scored raw: ${percentage}%`,
        date: new Date().toISOString().split("T")[0],
        examYear: examYear || undefined,
        examSeries: examSeries || undefined,
        subject: subject || "General"
      };

      db = loadDB();
      db.users[targetUser].testAnalytics = db.users[targetUser].testAnalytics || [];
      db.users[targetUser].testAnalytics.unshift(newTest);
      saveDB(db);

      // Broadcast update to real-time clients!
      broadcastUpdate(targetUser, { type: "REFRESH_ANALYTICS", data: db.users[targetUser].testAnalytics });

      res.status(201).json(newTest);
    } catch (error: any) {
      res.status(500).json({ error: "Failure logged core test metrics" });
    }
  });

  // Delete/Remove Test Result
  app.delete("/api/analytics/test/:id", authenticateToken, (req: any, res) => {
    try {
      const { id } = req.params;
      const targetUser = req.user.username;

      db = loadDB();
      const analytics = db.users[targetUser].testAnalytics || [];
      const newAnalytics = analytics.filter((t: any) => t.id !== id);
      db.users[targetUser].testAnalytics = newAnalytics;
      saveDB(db);

      // Broadcast update to real-time clients!
      broadcastUpdate(targetUser, { type: "REFRESH_ANALYTICS", data: newAnalytics });

      res.status(200).json({ success: true, message: "Test log deleted successfully" });
    } catch (error: any) {
      console.error("Failed deleting test log:", error);
      res.status(500).json({ error: "Failed deleting test log" });
    }
  });

  // Mistake Notebook Vault GET
  app.get("/api/mistakes", authenticateToken, (req: any, res) => {
    res.json(req.user.mistakeVault || []);
  });

  // Save/File core mistake
  app.post("/api/mistakes", authenticateToken, (req: any, res) => {
    try {
      const { subject, description, wrongApproach, correctedSequence, questionImage } = req.body;
      const targetUser = req.user.username;

      if (!subject || !description || !wrongApproach || !correctedSequence) {
        return res.status(400).json({ error: "Critical criteria missed" });
      }

      const newMistake: MistakeVault = {
        id: "m_" + Date.now(),
        subject,
        description,
        wrongApproach,
        correctedSequence,
        resolved: false,
        dateAdded: new Date().toISOString().split("T")[0],
        questionImage: questionImage || undefined
      };

      db = loadDB();
      db.users[targetUser].mistakeVault = db.users[targetUser].mistakeVault || [];
      db.users[targetUser].mistakeVault.unshift(newMistake);
      saveDB(db);

      // Broadcast to real-time clients!
      broadcastUpdate(targetUser, { type: "REFRESH_MISTAKES", data: db.users[targetUser].mistakeVault });

      res.status(201).json(newMistake);
    } catch (error: any) {
      res.status(500).json({ error: "Critical failure writing notebook logs" });
    }
  });

  // Resolve/Toggle mistake review status
  app.patch("/api/mistakes/:id/resolve", authenticateToken, (req: any, res) => {
    try {
      const { id } = req.params;
      const targetUser = req.user.username;

      db = loadDB();
      const mistakesList = db.users[targetUser].mistakeVault || [];
      const index = mistakesList.findIndex((m: any) => m.id === id);

      if (index === -1) {
        return res.status(404).json({ error: "No matching slip" });
      }

      mistakesList[index].resolved = !mistakesList[index].resolved;
      db.users[targetUser].mistakeVault = mistakesList;
      saveDB(db);

      // Broadcast to real-time clients!
      broadcastUpdate(targetUser, { type: "REFRESH_MISTAKES", data: mistakesList });

      res.json(mistakesList[index]);
    } catch (error: any) {
      res.status(500).json({ error: "Toggle status failed" });
    }
  });

  // Topic Completion Toggles (Phase-Independent)
  app.post("/api/topics/toggle", authenticateToken, (req: any, res) => {
    try {
      const { subject, topic, completed, phaseId } = req.body;
      const targetUser = req.user.username;

      if (!subject || !topic) {
        return res.status(400).json({ error: "Invalid toggle parameters" });
      }

      db = loadDB();
      const subjectsList = db.users[targetUser].config?.subjects || [];
      const sIndex = subjectsList.findIndex((s: any) => s.name === subject);

      if (sIndex === -1) {
        return res.status(400).json({ error: "Subject config not configured yet" });
      }

      const pKey = phaseId ? `completedTopics_phase${phaseId}` : "completedTopics";
      let phaseTopics: string[] = subjectsList[sIndex][pKey] || (phaseId ? [] : (subjectsList[sIndex].completedTopics || []));
      
      if (completed) {
        if (!phaseTopics.includes(topic)) {
          phaseTopics.push(topic);
        }
      } else {
        phaseTopics = phaseTopics.filter((t: string) => t !== topic);
      }

      subjectsList[sIndex][pKey] = phaseTopics;

      // Also ensure completedTopics has legacy list if phaseId wasn't passed or sync fallback
      if (!phaseId) {
        subjectsList[sIndex].completedTopics = phaseTopics;
      }

      db.users[targetUser].config.subjects[sIndex] = subjectsList[sIndex];
      saveDB(db);

      // Recalculate dynamic calendar and broadcast update
      const activeUserObj = db.users[targetUser];
      const calcPhase = calculateSystemPhase(activeUserObj.config);
      const activePhase = activeUserObj.currentOverrideState !== null ? activeUserObj.currentOverrideState : calcPhase;
      const rotation = getRotationSchedule(activePhase, activeUserObj);

      const payload = {
        type: "REFRESH_SCHEDULE_TOPICS",
        user: activeUserObj,
        schedule: rotation,
        activePhaseId: activePhase,
        systemCalculatedPhase: calcPhase
      };

      broadcastUpdate(targetUser, payload);

      res.json({
        success: true,
        user: activeUserObj,
        schedule: rotation
      });
    } catch (err) {
      res.status(500).json({ error: "Failure toggled topic alignment" });
    }
  });

  // Focus Sessions API Endpoints
  app.get("/api/focus-sessions", authenticateToken, (req: any, res) => {
    res.json(req.user.focusSessions || []);
  });

  app.post("/api/focus-sessions", authenticateToken, (req: any, res) => {
    try {
      const { subject, durationMinutes, notes, preset } = req.body;
      const targetUser = req.user.username;

      if (!subject || !durationMinutes) {
        return res.status(400).json({ error: "Subject and durationMinutes are required" });
      }

      const newSession = {
        id: "session_" + Date.now(),
        subject,
        durationMinutes: Number(durationMinutes),
        notes: notes || "",
        preset: preset || "25m",
        completedAt: new Date().toISOString()
      };

      db = loadDB();
      db.users[targetUser].focusSessions = db.users[targetUser].focusSessions || [];
      db.users[targetUser].focusSessions.unshift(newSession);
      saveDB(db);

      broadcastUpdate(targetUser, {
        type: "REFRESH_FOCUS_SESSIONS",
        data: db.users[targetUser].focusSessions
      });

      res.status(201).json(newSession);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to record focus session" });
    }
  });

  app.delete("/api/focus-sessions/:id", authenticateToken, (req: any, res) => {
    try {
      const { id } = req.params;
      const targetUser = req.user.username;

      db = loadDB();
      const list = db.users[targetUser].focusSessions || [];
      db.users[targetUser].focusSessions = list.filter((s: any) => s.id !== id);
      saveDB(db);

      broadcastUpdate(targetUser, {
        type: "REFRESH_FOCUS_SESSIONS",
        data: db.users[targetUser].focusSessions
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete focus session" });
    }
  });

  // Initialize Google Gen AI client with telemetry user-agent header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // GEMINI AI INTEGRATION ROUTES

  // Multi-turn Chat Route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, systemInstruction, model } = req.body;
      const targetModel = model || "gemini-3.6-flash";
      
      const defaultSysInst = "You are Saber AI, an elite CIE AS & A Level exam prep tutor and academic coach for Cambridge subjects (Physics 9702, Chemistry 9701, Mathematics 9709, Computer Science 9618, Biology 9700, English General Paper 8021). You deliver precise mark-scheme standard answers, step-by-step problem derivations, clear conceptual explanations, and exam strategies.";

      const formattedContents = (messages || []).map((m: any) => ({
        role: m.role === "assistant" ? "model" : m.role || "user",
        parts: [{ text: m.text || m.content || "" }]
      }));

      if (formattedContents.length === 0) {
        return res.status(400).json({ error: "Messages array cannot be empty" });
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction || defaultSysInst,
        }
      });

      const replyText = response.text || "No response generated from Gemini AI.";
      res.json({ text: replyText, model: targetModel });
    } catch (err: any) {
      console.error("[Gemini Chat API Error]:", err);
      res.status(500).json({ 
        error: err.message || "Failed to generate AI chat response",
        details: err.toString()
      });
    }
  });

  // Image Analysis Route
  app.post("/api/gemini/analyze-image", async (req, res) => {
    try {
      const { imageBase64, mimeType, prompt, model } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "imageBase64 payload is required" });
      }

      const targetModel = model || "gemini-3.1-pro-preview";
      const userPrompt = prompt || "Analyze this academic image in detail. If it's a past paper question, provide a step-by-step mark scheme solution. If it's handwritten notes or a diagram, explain the concepts and point out any errors.";

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const cleanMime = mimeType || "image/png";

      const imagePart = {
        inlineData: {
          mimeType: cleanMime,
          data: cleanBase64,
        },
      };

      const textPart = {
        text: userPrompt,
      };

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: "You are an expert Cambridge CIE exam examiner and vision analyzer. Analyze diagrams, handwritten working out, graphs, past paper snippets, and formulas with high precision.",
        }
      });

      const replyText = response.text || "No image analysis response received from Gemini.";
      res.json({ text: replyText, model: targetModel });
    } catch (err: any) {
      console.error("[Gemini Image Analysis Error]:", err);
      res.status(500).json({ 
        error: err.message || "Failed to analyze image with Gemini AI",
        details: err.toString()
      });
    }
  });

  // CLOUD SQL & GOOGLE TASKS PERSISTENCE API ROUTES

  // Sync / Register user in Cloud SQL
  app.post("/api/db/sync-user", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name || "");
      res.json({ user: userRecord });
    } catch (err: any) {
      console.error("[Cloud SQL Sync User Error]:", err);
      res.status(500).json({ error: err.message || "Failed to sync user to Cloud SQL" });
    }
  });

  // Get task items from Cloud SQL
  app.get("/api/db/tasks", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name || "");
      const tasks = await getUserTaskItems(userRecord.id);
      res.json({ tasks });
    } catch (err: any) {
      console.error("[Cloud SQL Get Tasks Error]:", err);
      res.status(500).json({ error: err.message || "Failed to fetch tasks from Cloud SQL" });
    }
  });

  // Upsert task item in Cloud SQL
  app.post("/api/db/tasks/upsert", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name || "");
      const { googleTaskId, tasklistId, title, notes, status, dueDate } = req.body;
      const task = await upsertTaskItem({
        userId: userRecord.id,
        googleTaskId,
        tasklistId,
        title,
        notes,
        status,
        dueDate,
      });
      res.json({ task });
    } catch (err: any) {
      console.error("[Cloud SQL Upsert Task Error]:", err);
      res.status(500).json({ error: err.message || "Failed to upsert task in Cloud SQL" });
    }
  });

  // Delete task item in Cloud SQL
  app.delete("/api/db/tasks/delete", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name || "");
      const { googleTaskId } = req.body;
      if (!googleTaskId) return res.status(400).json({ error: "googleTaskId required" });
      await deleteTaskItemByGoogleId(userRecord.id, googleTaskId);
      res.json({ success: true });
    } catch (err: any) {
      console.error("[Cloud SQL Delete Task Error]:", err);
      res.status(500).json({ error: err.message || "Failed to delete task from Cloud SQL" });
    }
  });

  // Get user study data from Cloud SQL
  app.get("/api/db/study-data", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name || "");
      const studyData = await getUserStudyData(userRecord.id);
      res.json({ studyData });
    } catch (err: any) {
      console.error("[Cloud SQL Get Study Data Error]:", err);
      res.status(500).json({ error: err.message || "Failed to fetch study data from Cloud SQL" });
    }
  });

  // Save user study data to Cloud SQL
  app.post("/api/db/study-data", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name || "");
      const { configJson, testAnalyticsJson, mistakeVaultJson, focusSessionsJson } = req.body;
      const saved = await saveUserStudyData(userRecord.id, {
        configJson,
        testAnalyticsJson,
        mistakeVaultJson,
        focusSessionsJson,
      });
      res.json({ studyData: saved });
    } catch (err: any) {
      console.error("[Cloud SQL Save Study Data Error]:", err);
      res.status(500).json({ error: err.message || "Failed to save study data to Cloud SQL" });
    }
  });


  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Create standard HTTP server instance and run WebSockets on it!
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // Map of active WS connections per username
  const wsClients = new Map<string, Set<WebSocket>>();

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws: WebSocket) => {
    let authUser: string | null = null;
    
    ws.on("message", (msgStr: string) => {
      try {
        const msg = JSON.parse(msgStr);
        if (msg.type === "subscribe" && msg.usernameZone) {
          authUser = msg.usernameZone.trim().toLowerCase();
          if (!wsClients.has(authUser!)) {
            wsClients.set(authUser!, new Set());
          }
          wsClients.get(authUser!)!.add(ws);
          console.log(`[WS] Connection associated with subscriber account: ${authUser}`);
          ws.send(JSON.stringify({ type: "accepted", status: "sync_active" }));
        }
      } catch (err) {
        console.error("[WS] Message processing error:", err);
      }
    });

    ws.on("close", () => {
      if (authUser && wsClients.has(authUser)) {
        wsClients.get(authUser)!.delete(ws);
        if (wsClients.get(authUser)!.size === 0) {
          wsClients.delete(authUser);
        }
      }
      console.log("[WS] Connection released");
    });
  });

  // Broadcast payload to users associated with the target user key
  function broadcastUpdate(username: string, payload: any) {
    const targetUser = username.trim().toLowerCase();
    const clients = wsClients.get(targetUser);
    if (clients) {
      console.log(`[WS] Broadcasting dynamic event type ${payload.type} to ${clients.size} clients under: ${targetUser}`);
      clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(payload));
        }
      });
    }
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[CORE ENGINE ONLINE] Node/Express full stack running on port ${PORT}`);
  });
}

startServer();
