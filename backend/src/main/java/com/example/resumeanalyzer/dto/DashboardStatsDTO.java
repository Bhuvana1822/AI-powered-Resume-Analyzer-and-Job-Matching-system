package com.example.resumeanalyzer.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalAnalyses;
    private double averageMatchPercentage;
    private int bestMatchPercentage;
    private String bestMatchJobTitle;
    private List<Map<String, Object>> topMissingSkills;
    private List<AnalysisResultDTO> recentAnalyses;

    public DashboardStatsDTO() {}

    public long getTotalAnalyses() { return totalAnalyses; }
    public void setTotalAnalyses(long totalAnalyses) { this.totalAnalyses = totalAnalyses; }

    public double getAverageMatchPercentage() { return averageMatchPercentage; }
    public void setAverageMatchPercentage(double averageMatchPercentage) { this.averageMatchPercentage = averageMatchPercentage; }

    public int getBestMatchPercentage() { return bestMatchPercentage; }
    public void setBestMatchPercentage(int bestMatchPercentage) { this.bestMatchPercentage = bestMatchPercentage; }

    public String getBestMatchJobTitle() { return bestMatchJobTitle; }
    public void setBestMatchJobTitle(String bestMatchJobTitle) { this.bestMatchJobTitle = bestMatchJobTitle; }

    public List<Map<String, Object>> getTopMissingSkills() { return topMissingSkills; }
    public void setTopMissingSkills(List<Map<String, Object>> topMissingSkills) { this.topMissingSkills = topMissingSkills; }

    public List<AnalysisResultDTO> getRecentAnalyses() { return recentAnalyses; }
    public void setRecentAnalyses(List<AnalysisResultDTO> recentAnalyses) { this.recentAnalyses = recentAnalyses; }
}
