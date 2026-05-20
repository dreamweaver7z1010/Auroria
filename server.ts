import express from "express";
import path from "path";
import http from "http";
import fs from "fs";
import crypto from "crypto";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import { TestAnalytics, MistakeVault, DaySchedule, SubjectId, OnboardingConfig } from "./src/types";

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

  // Session token mapping
  const tokenStore = new Map<string, string>(); // token -> username

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
    const completedList = new Set(user.config?.subjects?.flatMap((s: any) => s.completedTopics || []) || []);

    // Helper to find first uncompleted topic
    function getTopic(subj: SubjectId, firstGroup: boolean): string {
      const g = (config && config.customSyllabus && config.customSyllabus[subj]) || defaultSyllabus[subj];
      if (!g) return "Review Core Textbook";
      
      let targetList: string[] = [];
      if (Array.isArray(g)) {
        if (firstGroup) {
          targetList = g[0]?.topics || [];
        } else {
          // Fall back to subsequent groups if available, otherwise first group
          targetList = (g[1] || g[0])?.topics || [];
        }
      } else {
        targetList = firstGroup ? (g.groupA?.topics || []) : (g.groupB?.topics || []);
      }
      
      const uncompleted = targetList.find(t => !completedList.has(t));
      return uncompleted ? `Topic: ${uncompleted}` : `[ALL TOPICS ARCHIVED]`;
    }

    if (phaseId === 1) {
      // 3-Day operational cycle
      return [
        {
          dayName: "DAY TYPE A",
          dayType: "A",
          subjects: ["Chemistry", "Math", "English"],
          targets: `Chemistry -> ${getTopic("Chemistry", true)} // Math -> ${getTopic("Math", true)} // English -> ${getTopic("English", true)}`
        },
        {
          dayName: "DAY TYPE B",
          dayType: "B",
          subjects: ["Physics", "Computer Science", "Math"],
          targets: `Physics -> ${getTopic("Physics", true)} // Computer Science -> ${getTopic("Computer Science", false)} // Math -> ${getTopic("Math", false)}`
        },
        {
          dayName: "DAY TYPE C",
          dayType: "C",
          subjects: ["Chemistry", "Physics", "English"],
          targets: `Chemistry -> ${getTopic("Chemistry", false)} // Physics -> ${getTopic("Physics", false)} // English -> ${getTopic("English", false)}`
        }
      ];
    } else if (phaseId === 2) {
      // 5-Day horizontal rotational active recall layout tracks topics
      return [
        {
          dayName: "DAY BLOCK 1",
          dayType: "D1",
          subjects: ["Chemistry", "Math", "English"],
          targets: `Recall drill: ${getTopic("Chemistry", true)} // ${getTopic("Math", true)}`
        },
        {
          dayName: "DAY BLOCK 2",
          dayType: "D2",
          subjects: ["Physics", "Computer Science", "Math"],
          targets: `Recall drill: ${getTopic("Physics", true)} // ${getTopic("Computer Science", false)}`
        },
        {
          dayName: "DAY BLOCK 3",
          dayType: "D3",
          subjects: ["Chemistry", "Physics", "English"],
          targets: `Recall drill: ${getTopic("Chemistry", false)} // ${getTopic("English", true)}`
        },
        {
          dayName: "DAY BLOCK 4",
          dayType: "D4",
          subjects: ["Computer Science", "Math", "English"],
          targets: `Recall drill: ${getTopic("Computer Science", true)} // ${getTopic("Math", false)}`
        },
        {
          dayName: "DAY BLOCK 5",
          dayType: "D5",
          subjects: ["Chemistry", "Computer Science", "Physics"],
          targets: `Recall drill: ${getTopic("Chemistry", true)} // ${getTopic("Physics", false)}`
        }
      ];
    } else {
      // Phase 3 Past Paper High intensity cycle
      const chemCfg = config?.subjects?.find((s: any) => s.name === "Chemistry");
      const csCfg = config?.subjects?.find((s: any) => s.name === "Computer Science");
      const mathCfg = config?.subjects?.find((s: any) => s.name === "Math");
      const physCfg = config?.subjects?.find((s: any) => s.name === "Physics");
      const engCfg = config?.subjects?.find((s: any) => s.name === "English");

      return [
        { 
          dayName: "MONDAY", 
          dayType: "PA", 
          subjects: ["Computer Science", "Math"], 
          targets: `[SIM_LOAD]: ${csCfg ? generatePastPaperTask(csCfg, 0) : "CS paper"} // ${mathCfg ? generatePastPaperTask(mathCfg, 0) : "Math paper"}` 
        },
        { 
          dayName: "TUESDAY", 
          dayType: "PB", 
          subjects: ["Chemistry", "Physics"], 
          targets: `[SIM_LOAD]: ${chemCfg ? generatePastPaperTask(chemCfg, 0) : "Chem paper"} // ${physCfg ? generatePastPaperTask(physCfg, 0) : "Phys paper"}` 
        },
        { 
          dayName: "WEDNESDAY", 
          dayType: "PC", 
          subjects: ["Math", "English"], 
          targets: `[SIM_LOAD]: ${mathCfg ? generatePastPaperTask(mathCfg, 1) : "Math paper"} // ${engCfg ? generatePastPaperTask(engCfg, 0) : "Eng paper"}` 
        },
        { 
          dayName: "THURSDAY", 
          dayType: "PD", 
          subjects: ["Computer Science", "Physics"], 
          targets: `[SIM_LOAD]: ${csCfg ? generatePastPaperTask(csCfg, 1) : "CS paper"} // ${physCfg ? generatePastPaperTask(physCfg, 1) : "Phys paper"}` 
        },
        { 
          dayName: "FRIDAY", 
          dayType: "PE", 
          subjects: ["Chemistry", "English"], 
          targets: `[SIM_LOAD]: ${chemCfg ? generatePastPaperTask(chemCfg, 1) : "Chem paper"} // ${engCfg ? generatePastPaperTask(engCfg, 1) : "Eng paper"}` 
        },
        { 
          dayName: "SATURDAY", 
          dayType: "PM1", 
          subjects: ["Chemistry", "Physics", "Math", "Computer Science"], 
          targets: `4 EXAMS MAX: ${chemCfg ? generatePastPaperTask(chemCfg, 2) : "Chem"} // ${physCfg ? generatePastPaperTask(physCfg, 2) : "Phys"} // ${mathCfg ? generatePastPaperTask(mathCfg, 2) : "Math"}`, 
          extraFlag: "MAX_LOAD" 
        },
        { 
          dayName: "SUNDAY", 
          dayType: "PM2", 
          subjects: ["Chemistry", "Physics", "Math", "English"], 
          targets: `4 EXAMS MAX: ${chemCfg ? generatePastPaperTask(chemCfg, 3) : "Chem"} // ${physCfg ? generatePastPaperTask(physCfg, 3) : "Phys"} // ${mathCfg ? generatePastPaperTask(mathCfg, 3) : "Math"}`, 
          extraFlag: "MAX_LOAD" 
        }
      ];
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

  // User Sign-up
  app.post("/api/auth/signup", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password || username.trim().length === 0 || password.length === 0) {
        return res.status(400).json({ error: "Username and password criteria are required." });
      }

      db = loadDB();
      db.users = db.users || {};
      const targetUser = username.trim().toLowerCase();

      if (db.users[targetUser]) {
        return res.status(400).json({ error: "Username already exists. Choose a different one." });
      }

      const salt = createSalt();
      const passwordHash = hashPassword(password, salt);

      db.users[targetUser] = {
        username: targetUser,
        salt,
        passwordHash,
        onboarded: false,
        config: null,
        testAnalytics: [],
        mistakeVault: [],
        currentOverrideState: null
      };

      saveDB(db);

      // Generate Session Token
      const sessionToken = crypto.randomBytes(32).toString("hex");
      tokenStore.set(sessionToken, targetUser);

      res.status(201).json({
        success: true,
        token: sessionToken,
        user: {
          username: targetUser,
          onboarded: false
        }
      });
    } catch (error: any) {
      console.error("Sign-up error:", error);
      res.status(500).json({ error: "Critical server error during sign-up registration" });
    }
  });

  // Google Account - Check Email state
  app.post("/api/auth/google/check-email", (req, res) => {
    try {
      const { email } = req.body;
      if (!email || email.trim().length === 0) {
        return res.status(400).json({ error: "Email parameter required." });
      }

      db = loadDB();
      const searchEmail = email.trim().toLowerCase();
      
      // Look up if any user already has this google email
      let associatedUser: any = null;
      for (const username of Object.keys(db.users || {})) {
        if (db.users[username].googleEmail === searchEmail) {
          associatedUser = db.users[username];
          break;
        }
      }

      if (associatedUser) {
        return res.json({
          exists: true,
          username: associatedUser.username
        });
      }

      return res.json({
        exists: false
      });
    } catch (error: any) {
      console.error("Google verify check error:", error);
      res.status(500).json({ error: "Server check fault during verification" });
    }
  });

  // Google Account - Register with Username + Password
  app.post("/api/auth/google/register", (req, res) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password || username.trim().length === 0 || password.length === 0) {
        return res.status(400).json({ error: "All account parameters (email, username, password) are required." });
      }

      db = loadDB();
      db.users = db.users || {};
      const targetUser = username.trim().toLowerCase();
      const targetEmail = email.trim().toLowerCase();

      // Ensure username is completely unique globally
      if (db.users[targetUser]) {
        return res.status(400).json({ error: "Username already exists. Select a different distinct username identity." });
      }

      // Ensure email isn't already used
      for (const u of Object.keys(db.users)) {
        if (db.users[u].googleEmail === targetEmail) {
          return res.status(400).json({ error: "This Google account already owns a registered study portal session." });
        }
      }

      const salt = createSalt();
      const passwordHash = hashPassword(password, salt);

      db.users[targetUser] = {
        username: targetUser,
        googleEmail: targetEmail,
        salt,
        passwordHash,
        onboarded: false,
        config: null,
        testAnalytics: [],
        mistakeVault: [],
        currentOverrideState: null
      };

      saveDB(db);

      // Secure session link
      const sessionToken = crypto.randomBytes(32).toString("hex");
      tokenStore.set(sessionToken, targetUser);

      res.status(201).json({
        success: true,
        token: sessionToken,
        user: {
          username: targetUser,
          googleEmail: targetEmail,
          onboarded: false
        }
      });
    } catch (error: any) {
      console.error("Google sign up saving error:", error);
      res.status(500).json({ error: "Could not persist Google linked account" });
    }
  });

  // Google Account - Login with Email + Password verification
  app.post("/api/auth/google/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing login details parameter keys" });
      }

      db = loadDB();
      const searchEmail = email.trim().toLowerCase();

      // Find user
      let matchedUser: any = null;
      for (const username of Object.keys(db.users || {})) {
        if (db.users[username].googleEmail === searchEmail) {
          matchedUser = db.users[username];
          break;
        }
      }

      if (!matchedUser) {
        return res.status(404).json({ error: "No student profile registered under this Google Account." });
      }

      // Check passcode
      const hash = hashPassword(password, matchedUser.salt);
      if (hash !== matchedUser.passwordHash) {
        return res.status(401).json({ error: "Credential verification mismatch. Incorrect authorization code." });
      }

      // Create session
      const sessionToken = crypto.randomBytes(32).toString("hex");
      tokenStore.set(sessionToken, matchedUser.username);

      res.json({
        success: true,
        token: sessionToken,
        user: {
          username: matchedUser.username,
          googleEmail: matchedUser.googleEmail,
          onboarded: matchedUser.onboarded
        }
      });
    } catch (error: any) {
      console.error("Google credentials login error:", error);
      res.status(500).json({ error: "Credential matching fault" });
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

  // Topic Completion Toggles
  app.post("/api/topics/toggle", authenticateToken, (req: any, res) => {
    try {
      const { subject, topic, completed } = req.body;
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

      let completedTopics: string[] = subjectsList[sIndex].completedTopics || [];
      if (completed) {
        if (!completedTopics.includes(topic)) {
          completedTopics.push(topic);
        }
      } else {
        completedTopics = completedTopics.filter((t: string) => t !== topic);
      }

      db.users[targetUser].config.subjects[sIndex].completedTopics = completedTopics;
      saveDB(db);

      // Since completed topics changed, recalculate the dynamic calendar and reload on all boards!
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
