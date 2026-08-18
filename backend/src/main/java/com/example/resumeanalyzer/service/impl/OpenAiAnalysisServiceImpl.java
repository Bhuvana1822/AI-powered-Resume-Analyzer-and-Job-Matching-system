package com.example.resumeanalyzer.service.impl;

import com.example.resumeanalyzer.dto.AnalysisResultDTO;
import com.example.resumeanalyzer.service.AIAnalysisService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service("openAiAnalysisService")
public class OpenAiAnalysisServiceImpl implements AIAnalysisService {

    @Value("${openai.api.key:}")
    private String apiKey;

    private final AIAnalysisService fallbackService;

    public OpenAiAnalysisServiceImpl(@Qualifier("localAIAnalysisService") AIAnalysisService fallbackService) {
        this.fallbackService = fallbackService;
    }

    @Override
    public AnalysisResultDTO analyze(String resumeText, String jobDescriptionText, Set<String> resumeSkills, Set<String> jdSkills, String jobTitle) {
        if (apiKey == null || apiKey.isBlank()) {
            // Fall back cleanly to high-precision local rule/keyword engine
            return fallbackService.analyze(resumeText, jobDescriptionText, resumeSkills, jdSkills, jobTitle);
        }

        // If an OpenAI API Key is configured in environment, external LLM call logic can be executed here
        try {
            // Future OpenAI HTTP call integration point...
            return fallbackService.analyze(resumeText, jobDescriptionText, resumeSkills, jdSkills, jobTitle);
        } catch (Exception e) {
            return fallbackService.analyze(resumeText, jobDescriptionText, resumeSkills, jdSkills, jobTitle);
        }
    }
}
