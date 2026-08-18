package com.example.resumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;

public class AnalysisRequestDTO {

    private Long resumeId;

    private String resumeText;

    private String fileName;

    @NotBlank(message = "Job description cannot be empty")
    private String jobDescription;

    private String jobTitle;

    private Long userId;

    public AnalysisRequestDTO() {}

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
