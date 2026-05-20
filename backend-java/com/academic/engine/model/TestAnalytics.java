package com.academic.engine.model;

import java.time.LocalDate;

/**
 * Enterprise Spring Boot JPA/DTO representation of study test analytics and logs. This corresponds
 * directly to the TestAnalytics interface in the core React layout metrics.
 */
public class TestAnalytics {
    private String id;
    private String name;
    private String classification; // "Mock" | "Monthly" | "Past Paper"
    private int rawScore;
    private int totalMaxPoints;
    private double percentage;
    private String gritLog;
    private LocalDate date;

    // Default Constructor
    public TestAnalytics() {
    }

    // Comprehensive Constructor
    public TestAnalytics(String id, String name, String classification, int rawScore, int totalMaxPoints, double percentage, String gritLog, LocalDate date) {
        this.id = id;
        this.name = name;
        this.classification = classification;
        this.rawScore = rawScore;
        this.totalMaxPoints = totalMaxPoints;
        this.percentage = percentage;
        this.gritLog = gritLog;
        this.date = date;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }

    public int getRawScore() {
        return rawScore;
    }

    public void setRawScore(int rawScore) {
        this.rawScore = rawScore;
    }

    public int getTotalMaxPoints() {
        return totalMaxPoints;
    }

    public void setTotalMaxPoints(int totalMaxPoints) {
        this.totalMaxPoints = totalMaxPoints;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getGritLog() {
        return gritLog;
    }

    public void setGritLog(String gritLog) {
        this.gritLog = gritLog;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
