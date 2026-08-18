package com.example.resumeanalyzer.service;

import com.example.resumeanalyzer.dto.AnalysisResultDTO;
import com.example.resumeanalyzer.dto.DashboardStatsDTO;
import com.example.resumeanalyzer.dto.MissingSkillDTO;
import com.example.resumeanalyzer.entity.Analysis;
import com.example.resumeanalyzer.repository.AnalysisRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalysisHistoryService {

    private final AnalysisRepository analysisRepository;
    private final ResumeMatchingService resumeMatchingService;

    public AnalysisHistoryService(AnalysisRepository analysisRepository, ResumeMatchingService resumeMatchingService) {
        this.analysisRepository = analysisRepository;
        this.resumeMatchingService = resumeMatchingService;
    }

    public List<AnalysisResultDTO> getUserHistory(Long userId) {
        List<Analysis> analyses;
        if (userId != null && userId > 0) {
            analyses = analysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            analyses = analysisRepository.findAllByOrderByCreatedAtDesc();
        }

        return analyses.stream()
                .map(a -> resumeMatchingService.getAnalysisById(a.getId()))
                .collect(Collectors.toList());
    }

    public DashboardStatsDTO getDashboardStats(Long userId) {
        List<AnalysisResultDTO> history = getUserHistory(userId);
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalAnalyses(history.size());

        if (history.isEmpty()) {
            stats.setAverageMatchPercentage(0.0);
            stats.setBestMatchPercentage(0);
            stats.setBestMatchJobTitle("N/A");
            stats.setTopMissingSkills(Collections.emptyList());
            stats.setRecentAnalyses(Collections.emptyList());
            return stats;
        }

        double avg = history.stream().mapToInt(AnalysisResultDTO::getMatchPercentage).average().orElse(0.0);
        stats.setAverageMatchPercentage(Math.round(avg * 10.0) / 10.0);

        AnalysisResultDTO best = history.stream().max(Comparator.comparingInt(AnalysisResultDTO::getMatchPercentage)).orElse(history.get(0));
        stats.setBestMatchPercentage(best.getMatchPercentage());
        stats.setBestMatchJobTitle(best.getJobTitle());

        // Count top missing skills across all analyses
        Map<String, Integer> missingSkillCounts = new HashMap<>();
        for (AnalysisResultDTO dto : history) {
            if (dto.getMissingSkills() != null) {
                for (MissingSkillDTO ms : dto.getMissingSkills()) {
                    missingSkillCounts.put(ms.getSkill(), missingSkillCounts.getOrDefault(ms.getSkill(), 0) + 1);
                }
            }
        }

        List<Map<String, Object>> topMissingList = missingSkillCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("skill", e.getKey());
                    map.put("count", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        stats.setTopMissingSkills(topMissingList);
        stats.setRecentAnalyses(history.stream().limit(5).collect(Collectors.toList()));

        return stats;
    }
}
