package com.example.resumeanalyzer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analyses")
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resumeId;

    private Long userId;

    private String jobTitle;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String jobDescription;

    private Integer matchPercentage;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String matchedSkillsJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String missingSkillsJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String suggestionsJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String recommendedSkillsJson;

    private String experienceMatch;

    private String educationMatch;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Analysis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public Integer getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Integer matchPercentage) { this.matchPercentage = matchPercentage; }

    public String getMatchedSkillsJson() { return matchedSkillsJson; }
    public void setMatchedSkillsJson(String matchedSkillsJson) { this.matchedSkillsJson = matchedSkillsJson; }

    public String getMissingSkillsJson() { return missingSkillsJson; }
    public void setMissingSkillsJson(String missingSkillsJson) { this.missingSkillsJson = missingSkillsJson; }

    public String getSuggestionsJson() { return suggestionsJson; }
    public void setSuggestionsJson(String suggestionsJson) { this.suggestionsJson = suggestionsJson; }

    public String getRecommendedSkillsJson() { return recommendedSkillsJson; }
    public void setRecommendedSkillsJson(String recommendedSkillsJson) { this.recommendedSkillsJson = recommendedSkillsJson; }

    public String getExperienceMatch() { return experienceMatch; }
    public void setExperienceMatch(String experienceMatch) { this.experienceMatch = experienceMatch; }

    public String getEducationMatch() { return educationMatch; }
    public void setEducationMatch(String educationMatch) { this.educationMatch = educationMatch; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
