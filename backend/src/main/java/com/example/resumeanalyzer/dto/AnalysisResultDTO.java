package com.example.resumeanalyzer.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AnalysisResultDTO {

    private Long id;
    private Long resumeId;
    private String fileName;
    private String jobTitle;
    private Integer matchPercentage;

    private List<String> matchedSkills;
    private List<MissingSkillDTO> missingSkills;
    private List<String> suggestions;
    private List<String> recommendedSkills;

    private String experienceMatch;
    private String educationMatch;
    private String overallRecommendation;

    private LocalDateTime createdAt;

    public AnalysisResultDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Integer getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Integer matchPercentage) { this.matchPercentage = matchPercentage; }

    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<MissingSkillDTO> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<MissingSkillDTO> missingSkills) { this.missingSkills = missingSkills; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<String> getRecommendedSkills() { return recommendedSkills; }
    public void setRecommendedSkills(List<String> recommendedSkills) { this.recommendedSkills = recommendedSkills; }

    public String getExperienceMatch() { return experienceMatch; }
    public void setExperienceMatch(String experienceMatch) { this.experienceMatch = experienceMatch; }

    public String getEducationMatch() { return educationMatch; }
    public void setEducationMatch(String educationMatch) { this.educationMatch = educationMatch; }

    public String getOverallRecommendation() { return overallRecommendation; }
    public void setOverallRecommendation(String overallRecommendation) { this.overallRecommendation = overallRecommendation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
