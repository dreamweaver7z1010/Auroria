package com.academic.engine.controller;

import com.academic.engine.model.TestAnalytics;
import com.academic.engine.model.MistakeVault;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.logging.Logger;

/**
 * REST Controller mapping endpoint routes for CORE ACADEMIC ENGINE in Spring Boot.
 * Handles the state calculation logic, test score submissions, and mistake notebooks.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AcademicEngineController {

    private static final Logger LOGGER = Logger.getLogger(AcademicEngineController.class.getName());

    // In-Memory Database persistence emulation
    private Integer currentOverrideState = null;
    private final List<TestAnalytics> testAnalyticsList = new ArrayList<>();
    private final List<MistakeVault> mistakeVaultList = new ArrayList<>();

    // Constructor seeds initial mock data matching Express specification directly
    public AcademicEngineController() {
        seedInitialData();
    }

    private void seedInitialData() {
        // Seed tests
        testAnalyticsList.add(new TestAnalytics("test_1", "Computer Science Paper 1 - Past Paper 2025", "Past Paper", 68, 75, 90.6, "Flawless on OOP design and assembly logic.", LocalDate.of(2026, 5, 2)));
        testAnalyticsList.add(new TestAnalytics("test_2", "Chemistry Term Mock Unit 4", "Mock", 54, 80, 67.5, "CONCEPT GAP: Arrhenius plot Arrhenius graph error.", LocalDate.of(2026, 5, 10)));
        testAnalyticsList.add(new TestAnalytics("test_3", "Maths Advanced Calculus - Monthly Test", "Monthly", 48, 50, 96.0, "Elite integration by parts. Perfectly optimized proofs.", LocalDate.of(2026, 5, 14)));

        // Seed mistake log
        mistakeVaultList.add(new MistakeVault("m_1", "Chemistry", "Arrhenius plot Activation Energy sign mixup.",
                "ln(k) = - (Ea/R) * (1/T) ; Slope m = Ea/R ==> Negative Ea value.",
                "Slope m = -Ea/R ==> Ea must ALWAYS be a positive thermodynamic value.",
                false, LocalDate.of(2026, 5, 10)));
        mistakeVaultList.add(new MistakeVault("m_2", "Computer Science", "Assembly linear register word misalignment index off.",
                "ADD R1, R1, #1 ; Incrementing raw bytes on 32-bit width bus",
                "ADD R1, R1, #4 ; Align address increment by 4-byte boundaries.",
                true, LocalDate.of(2026, 5, 12)));
    }

    // 1. GET Dashboard State
    @GetMapping("/dashboard/state")
    public ResponseEntity<Map<String, Object>> getDashboardState() {
        try {
            int systemCalculatedPhase = calculateSystemPhase();
            int activePhase = (currentOverrideState != null) ? currentOverrideState : systemCalculatedPhase;

            Map<String, Object> stateMap = new HashMap<>();
            stateMap.put("systemCalculatedPhase", systemCalculatedPhase);
            stateMap.put("currentOverrideState", currentOverrideState);
            stateMap.put("activePhaseId", activePhase);
            stateMap.put("localTime", "2026-05-20T04:49:06Z");
            stateMap.put("schedule", getRotationSchedule(activePhase));

            return ResponseEntity.ok(stateMap);
        } catch (Exception e) {
            LOGGER.severe("Error reading state logs: " + e.getMessage());
            Map<String, Object> errResponse = new HashMap<>();
            errResponse.put("error", "Failed to retrieve engine metadata runtime");
            errResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errResponse);
        }
    }

    // 2. POST Dashboard Override Configuration
    @PostMapping("/dashboard/override")
    public ResponseEntity<Map<String, Object>> overrideState(@RequestBody Map<String, Object> payload) {
        try {
            Object overrideVal = payload.get("overridePhase");
            if (overrideVal == null) {
                currentOverrideState = null;
            } else {
                int phaseVal = Integer.parseInt(overrideVal.toString());
                if (phaseVal < 1 || phaseVal > 3) {
                    Map<String, Object> badReq = new HashMap<>();
                    badReq.put("error", "Invalid phase state index. Must run between [1, 3] or be null.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(badReq);
                }
                currentOverrideState = phaseVal;
            }

            int systemCalculatedPhase = calculateSystemPhase();
            int activePhase = (currentOverrideState != null) ? currentOverrideState : systemCalculatedPhase;

            Map<String, Object> stateMap = new HashMap<>();
            stateMap.put("success", true);
            stateMap.put("systemCalculatedPhase", systemCalculatedPhase);
            stateMap.put("currentOverrideState", currentOverrideState);
            stateMap.put("activePhaseId", activePhase);
            stateMap.put("schedule", getRotationSchedule(activePhase));

            return ResponseEntity.ok(stateMap);
        } catch (NumberFormatException e) {
            Map<String, Object> parseErr = new HashMap<>();
            parseErr.put("error", "Override phase parameter must be an integer, null or void.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(parseErr);
        } catch (Exception e) {
            LOGGER.severe("Failure saving override parameters inside Java controller: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 3. GET Analytics logs
    @GetMapping("/analytics")
    public ResponseEntity<List<TestAnalytics>> getAnalytics() {
        return ResponseEntity.ok(testAnalyticsList);
    }

    // 4. POST Submitting new Test score
    @PostMapping("/analytics/test")
    public ResponseEntity<Object> saveTestScore(@RequestBody TestAnalytics payload) {
        try {
            if (payload.getName() == null || payload.getClassification() == null || payload.getTotalMaxPoints() <= 0) {
                Map<String, String> bodyErr = new HashMap<>();
                bodyErr.put("error", "Required criteria properties missing or total score boundary matches zero limit.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bodyErr);
            }

            double percentage = ((double) payload.getRawScore() / payload.getTotalMaxPoints()) * 100.0;
            // Round off percentage utility
            percentage = Math.round(percentage * 10.0) / 10.0;

            TestAnalytics newRecord = new TestAnalytics();
            newRecord.setId("test_" + System.currentTimeMillis());
            newRecord.setName(payload.getName());
            newRecord.setClassification(payload.getClassification());
            newRecord.setRawScore(payload.getRawScore());
            newRecord.setTotalMaxPoints(payload.getTotalMaxPoints());
            newRecord.setPercentage(percentage);
            newRecord.setGritLog(payload.getGritLog() != null ? payload.getGritLog() : "Engine validated.");
            newRecord.setDate(LocalDate.now());

            testAnalyticsList.add(0, newRecord); // prepend log entries
            return ResponseEntity.status(HttpStatus.CREATED).body(newRecord);
        } catch (Exception e) {
            LOGGER.severe("Failure executing save on metric elements: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 5. GET Mistakes Notebook
    @GetMapping("/mistakes")
    public ResponseEntity<List<MistakeVault>> getMistakes() {
        return ResponseEntity.ok(mistakeVaultList);
    }

    // 6. POST new Mistake
    @PostMapping("/mistakes")
    public ResponseEntity<Object> addMistake(@RequestBody MistakeVault payload) {
        if (payload.getSubject() == null || payload.getDescription() == null || payload.getWrongApproach() == null || payload.getCorrectedSequence() == null) {
            Map<String, String> bodyErr = new HashMap<>();
            bodyErr.put("error", "Wrong Approach or Corrected workflows must match active criteria rules.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bodyErr);
        }

        MistakeVault entry = new MistakeVault();
        entry.setId("m_" + System.currentTimeMillis());
        entry.setSubject(payload.getSubject());
        entry.setDescription(payload.getDescription());
        entry.setWrongApproach(payload.getWrongApproach());
        entry.setCorrectedSequence(payload.getCorrectedSequence());
        entry.setResolved(false);
        entry.setDateAdded(LocalDate.now());

        mistakeVaultList.add(0, entry);
        return ResponseEntity.status(HttpStatus.CREATED).body(entry);
    }

    // 7. PATCH Resolve Mistake log
    @PatchMapping("/mistakes/{id}/resolve")
    public ResponseEntity<Object> resolveMistake(@PathVariable String id) {
        for (MistakeVault mistake : mistakeVaultList) {
            if (mistake.getId().equals(id)) {
                mistake.setResolved(!mistake.isResolved());
                return ResponseEntity.ok(mistake);
            }
        }
        Map<String, String> failRes = new HashMap<>();
        failRes.put("error", "ID reference not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(failRes);
    }

    private int calculateSystemPhase() {
        // Mock calculations referencing system prompt target data directly
        return 1; // Since May 20 is Phase 1 (Apr 1 - Jun 1)
    }

    private List<Map<String, Object>> getRotationSchedule(int phaseId) {
        List<Map<String, Object>> rotation = new ArrayList<>();
        if (phaseId == 1) {
            rotation.add(createDayMap("DAY TYPE A", "A", Arrays.asList("Chemistry", "Math", "English"), "Focus: Core Organic reactions, Calculus proofs, Syntax syntax."));
            rotation.add(createDayMap("DAY TYPE B", "B", Arrays.asList("Physics", "Computer Science", "Math"), "Focus: Quantum wave limits, Logic configurations, Calculus integrals."));
            rotation.add(createDayMap("DAY TYPE C", "C", Arrays.asList("Chemistry", "Physics", "English"), "Focus: Kinetics graphs, Electromagnetism drills, Literary text parsing."));
        } else if (phaseId == 2) {
            rotation.add(createDayMap("ROTATION BLOCK 1", "D1", Arrays.asList("Computer Science", "Math"), "Topic Practice & 5-Day Recall: Network routers, Vector alignments."));
            rotation.add(createDayMap("ROTATION BLOCK 2", "D2", Arrays.asList("Chemistry", "Physics"), "Topic Practice & 5-Day Recall: Organic transitions, Induction limits."));
            rotation.add(createDayMap("ROTATION BLOCK 3", "D3", Arrays.asList("Math", "English"), "Topic Practice & 5-Day Recall: Statistics bounds, Comparative essays."));
            rotation.add(createDayMap("ROTATION BLOCK 4", "D4", Arrays.asList("Computer Science", "Physics"), "Topic Practice & 5-Day Recall: Database normalizing, Wave particles."));
            rotation.add(createDayMap("ROTATION BLOCK 5", "D5", Arrays.asList("Chemistry", "English"), "Topic Practice & 5-Day Recall: Gas kinetics drills, Sentence logic parsing."));
        } else {
            rotation.add(createDayMap("MONDAY", "PA", Arrays.asList("Computer Science", "Math"), "2 PAPERS // TARGETS: CS + MATH (CS: 2021-2026 | Math: 2022-2026)"));
            rotation.add(createDayMap("TUESDAY", "PB", Arrays.asList("Chemistry", "Physics"), "2 PAPERS // TARGETS: CHEM + PHYS (Chem: 2022-2026 | Phys: 2022-2026)"));
            rotation.add(createDayMap("WEDNESDAY", "PC", Arrays.asList("Math", "English"), "2 PAPERS // TARGETS: MATH + ENG (Math: 2022-2026 | Eng: 2022-2026)"));
            rotation.add(createDayMap("THURSDAY", "PD", Arrays.asList("Computer Science", "Physics"), "2 PAPERS // TARGETS: CS + PHYS (CS: 2021-2026 | Phys: 2022-2026)"));
            rotation.add(createDayMap("FRIDAY", "PE", Arrays.asList("Chemistry", "English"), "2 PAPERS // TARGETS: CHEM + ENG (Chem: 2022-2026 | Eng: 2022-2026)"));
            rotation.add(createDayMap("SATURDAY", "PM1", Arrays.asList("Chemistry", "Physics", "Math", "Computer Science"), "4 PAPERS // MAXIMUM LOAD // ALL SUBJECTS ACTIVE"));
            rotation.add(createDayMap("SUNDAY", "PM2", Arrays.asList("Chemistry", "Physics", "Math", "English"), "4 PAPERS // MAXIMUM LOAD // ALL SUBJECTS ACTIVE"));
        }
        return rotation;
    }

    private Map<String, Object> createDayMap(String dayName, String dayType, List<String> subjects, String targets) {
        Map<String, Object> map = new HashMap<>();
        map.put("dayName", dayName);
        map.put("dayType", dayType);
        map.put("subjects", subjects);
        map.put("targets", targets);
        return map;
    }
}
