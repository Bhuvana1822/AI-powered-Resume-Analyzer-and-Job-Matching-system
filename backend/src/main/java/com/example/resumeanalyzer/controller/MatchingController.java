package com.example.resumeanalyzer.controller;

import com.example.resumeanalyzer.dto.*;
import com.example.resumeanalyzer.service.AnalysisHistoryService;
import com.example.resumeanalyzer.service.ResumeMatchingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MatchingController {

    private final ResumeMatchingService resumeMatchingService;
    private final AnalysisHistoryService analysisHistoryService;

    public MatchingController(ResumeMatchingService resumeMatchingService, AnalysisHistoryService analysisHistoryService) {
        this.resumeMatchingService = resumeMatchingService;
        this.analysisHistoryService = analysisHistoryService;
    }

    @PostMapping({"/matching/analyze", "/analyze"})
    public ResponseEntity<AnalysisResultDTO> analyzeResumeAndJob(@Valid @RequestBody AnalysisRequestDTO request) {
        AnalysisResultDTO result = resumeMatchingService.analyzeAndMatch(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/matching/analysis/{id}")
    public ResponseEntity<AnalysisResultDTO> getAnalysis(@PathVariable Long id) {
        AnalysisResultDTO result = resumeMatchingService.getAnalysisById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/matching/history")
    public ResponseEntity<List<AnalysisResultDTO>> getHistory(@RequestParam(value = "userId", required = false) Long userId) {
        List<AnalysisResultDTO> history = analysisHistoryService.getUserHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/matching/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(@RequestParam(value = "userId", required = false) Long userId) {
        DashboardStatsDTO stats = analysisHistoryService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}
