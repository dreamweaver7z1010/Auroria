package com.academic.engine.model;

import java.time.LocalDate;

/**
 * Enterprise JPA Entity mapping mistake notebook vault logs inside Java.
 * Includes tracking wrong processing paths and corrected sequences.
 */
public class MistakeVault {
    private String id;
    private String subject; // "Chemistry" | "Physics" | "Math" | "Computer Science" | "English"
    private String description;
    private String wrongApproach;
    private String correctedSequence;
    private boolean resolved;
    private LocalDate dateAdded;

    // Default Constructor
    public MistakeVault() {
    }

    // Comprehensive Constructor
    public MistakeVault(String id, String subject, String description, String wrongApproach, String correctedSequence, boolean resolved, LocalDate dateAdded) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.wrongApproach = wrongApproach;
        this.correctedSequence = correctedSequence;
        this.resolved = resolved;
        this.dateAdded = dateAdded;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWrongApproach() {
        return wrongApproach;
    }

    public void setWrongApproach(String wrongApproach) {
        this.wrongApproach = wrongApproach;
    }

    public String getCorrectedSequence() {
        return correctedSequence;
    }

    public void setCorrectedSequence(String correctedSequence) {
        this.correctedSequence = correctedSequence;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }
}
