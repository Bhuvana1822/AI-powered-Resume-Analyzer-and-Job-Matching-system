package com.example.resumeanalyzer.service;

import com.example.resumeanalyzer.dto.AnalysisRequestDTO;
import com.example.resumeanalyzer.dto.AnalysisResultDTO;
import com.example.resumeanalyzer.dto.MissingSkillDTO;
import com.example.resumeanalyzer.entity.Analysis;
import com.example.resumeanalyzer.entity.Resume;
import com.example.resumeanalyzer.exception.BadRequestException;
import com.example.resumeanalyzer.exception.ResourceNotFoundException;
import com.example.resumeanalyzer.repository.AnalysisRepository;
import com.example.resumeanalyzer.repository.ResumeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class ResumeMatchingService {

    private final SkillExtractionService skillExtractionService;
    private final AIAnalysisService aiAnalysisService;
    private final ResumeRepository resumeRepository;
    private final AnalysisRepository analysisRepository;
    private final ObjectMapper objectMapper;

    public ResumeMatchingService(
            SkillExtractionService skillExtractionService,
            @Qualifier("openAiAnalysisService") AIAnalysisService aiAnalysisService,
            ResumeRepository resumeRepository,
            AnalysisRepository analysisRepository,
            ObjectMapper objectMapper) {
        this.skillExtractionService = skillExtractionService;
        this.aiAnalysisService = aiAnalysisService;
        this.resumeRepository = resumeRepository;
        this.analysisRepository = analysisRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AnalysisResultDTO analyzeAndMatch(AnalysisRequestDTO request) {
        if (request.getJobDescription() == null || request.getJobDescription().isBlank()) {
            throw new BadRequestException("Job Description cannot be empty.");
        }

        String resumeText = request.getResumeText();
        String fileName = request.getFileName() != null ? request.getFileName() : "Uploaded Resume";

        if (request.getResumeId() != null) {
            Resume resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + request.getResumeId()));
            resumeText = resume.getExtractedText();
            fileName = resume.getFileName();
        }

        if (resumeText == null || resumeText.isBlank()) {
            throw new BadRequestException("Resume text cannot be empty.");
        }

        // 1. Extract Skills using SkillExtractionService
        Set<String> resumeSkills = skillExtractionService.extractSkills(resumeText);
        Set<String> jdSkills = skillExtractionService.extractSkills(request.getJobDescription());

        String jobTitle = request.getJobTitle();
        if (jobTitle == null || jobTitle.isBlank()) {
            jobTitle = inferJobTitle(request.getJobDescription());
        }

        // 2. Perform Dynamic Evaluation via AI/NLP Service Interface
        AnalysisResultDTO result = aiAnalysisService.analyze(resumeText, request.getJobDescription(), resumeSkills, jdSkills, jobTitle);
        result.setFileName(fileName);
        result.setJobTitle(jobTitle);
        result.setResumeId(request.getResumeId());

        // 3. Persist Analysis Entity into Database
        Analysis entity = new Analysis();
        entity.setResumeId(request.getResumeId());
        entity.setUserId(request.getUserId() != null ? request.getUserId() : 1L);
        entity.setJobTitle(jobTitle);
        entity.setJobDescription(request.getJobDescription());
        entity.setMatchPercentage(result.getMatchPercentage());
        entity.setExperienceMatch(result.getExperienceMatch());
        entity.setEducationMatch(result.getEducationMatch());
        entity.setRecommendation(result.getOverallRecommendation());

        try {
            entity.setMatchedSkillsJson(objectMapper.writeValueAsString(result.getMatchedSkills()));
            entity.setMissingSkillsJson(objectMapper.writeValueAsString(result.getMissingSkills()));
            entity.setSuggestionsJson(objectMapper.writeValueAsString(result.getSuggestions()));
            entity.setRecommendedSkillsJson(objectMapper.writeValueAsString(result.getRecommendedSkills()));
        } catch (JsonProcessingException e) {
            entity.setMatchedSkillsJson("[]");
            entity.setMissingSkillsJson("[]");
            entity.setSuggestionsJson("[]");
            entity.setRecommendedSkillsJson("[]");
        }

        Analysis savedEntity = analysisRepository.save(entity);
        result.setId(savedEntity.getId());
        result.setCreatedAt(savedEntity.getCreatedAt());

        return result;
    }

    public AnalysisResultDTO getAnalysisById(Long id) {
        Analysis entity = analysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis record not found for ID: " + id));

        AnalysisResultDTO dto = new AnalysisResultDTO();
        dto.setId(entity.getId());
        dto.setResumeId(entity.getResumeId());
        dto.setJobTitle(entity.getJobTitle());
        dto.setMatchPercentage(entity.getMatchPercentage());
        dto.setExperienceMatch(entity.getExperienceMatch());
        dto.setEducationMatch(entity.getEducationMatch());
        dto.setOverallRecommendation(entity.getRecommendation());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getResumeId() != null) {
            resumeRepository.findById(entity.getResumeId()).ifPresent(r -> dto.setFileName(r.getFileName()));
        }

        try {
            dto.setMatchedSkills(objectMapper.readValue(entity.getMatchedSkillsJson(), new TypeReference<List<String>>() {}));
            dto.setMissingSkills(objectMapper.readValue(entity.getMissingSkillsJson(), new TypeReference<List<MissingSkillDTO>>() {}));
            dto.setSuggestions(objectMapper.readValue(entity.getSuggestionsJson(), new TypeReference<List<String>>() {}));
            dto.setRecommendedSkills(objectMapper.readValue(entity.getRecommendedSkillsJson(), new TypeReference<List<String>>() {}));
        } catch (Exception e) {
            dto.setMatchedSkills(Collections.emptyList());
            dto.setMissingSkills(Collections.emptyList());
            dto.setSuggestions(Collections.emptyList());
            dto.setRecommendedSkills(Collections.emptyList());
        }

        return dto;
    }

    private String inferJobTitle(String jdText) {
        if (jdText == null) return "Target Job Position";
        String[] lines = jdText.split("\n");
        for (String line : lines) {
            String l = line.trim();
            if (l.toLowerCase().startsWith("job title") || l.toLowerCase().startsWith("position") || l.toLowerCase().startsWith("role")) {
                int colonIdx = l.indexOf(':');
                if (colonIdx != -1 && colonIdx < l.length() - 1) {
                    return l.substring(colonIdx + 1).trim();
                }
            }
        }
        return "Software / Technical Role";
    }
}
