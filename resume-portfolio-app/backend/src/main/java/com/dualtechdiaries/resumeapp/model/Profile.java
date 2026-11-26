package com.dualtechdiaries.resumeapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA Entity for saving resume draft profiles to H2 database.
 */
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String title;

    private String fullName;

    private String email;

    private String desiredRole;

    private String targetTemplate;

    @Column(columnDefinition = "TEXT")
    private String resumeJson;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Profile() {
    }

    public Profile(String fullName, String email, String desiredRole, String targetTemplate, String resumeJson) {
        this.fullName = fullName;
        this.email = email;
        this.desiredRole = desiredRole;
        this.targetTemplate = targetTemplate;
        this.resumeJson = resumeJson;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDesiredRole() {
        return desiredRole;
    }

    public void setDesiredRole(String desiredRole) {
        this.desiredRole = desiredRole;
    }

    public String getTargetTemplate() {
        return targetTemplate;
    }

    public void setTargetTemplate(String targetTemplate) {
        this.targetTemplate = targetTemplate;
    }

    public String getResumeJson() {
        return resumeJson;
    }

    public void setResumeJson(String resumeJson) {
        this.resumeJson = resumeJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
