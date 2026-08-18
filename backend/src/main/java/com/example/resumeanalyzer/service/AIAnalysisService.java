package com.example.resumeanalyzer.service;

import com.example.resumeanalyzer.dto.AnalysisResultDTO;
import java.util.Set;

public interface AIAnalysisService {
    AnalysisResultDTO analyze(String resumeText, String jobDescriptionText, Set<String> resumeSkills, Set<String> jdSkills, String jobTitle);
}
