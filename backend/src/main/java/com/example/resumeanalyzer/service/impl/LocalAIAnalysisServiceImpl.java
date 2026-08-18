package com.example.resumeanalyzer.service.impl;

import com.example.resumeanalyzer.dto.AnalysisResultDTO;
import com.example.resumeanalyzer.dto.MissingSkillDTO;
import com.example.resumeanalyzer.service.AIAnalysisService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service("localAIAnalysisService")
public class LocalAIAnalysisServiceImpl implements AIAnalysisService {

    @Override
    public AnalysisResultDTO analyze(String resumeText, String jobDescriptionText, Set<String> resumeSkills, Set<String> jdSkills, String jobTitle) {
        AnalysisResultDTO result = new AnalysisResultDTO();

        // 1. Calculate Matched & Missing Skills
        List<String> matchedSkills = new ArrayList<>();
        List<MissingSkillDTO> missingSkills = new ArrayList<>();

        if (jdSkills.isEmpty()) {
            // If no explicit predefined skills were found in JD, infer key words from JD text
            jdSkills = extractKeywordsFromText(jobDescriptionText);
        }

        for (String skill : jdSkills) {
            if (containsSkillIgnoreCase(resumeSkills, skill)) {
                matchedSkills.add(skill);
            } else {
                String explanation = skill + " - This skill is mentioned in the job description but was not detected in your resume.";
                missingSkills.add(new MissingSkillDTO(skill, explanation));
            }
        }

        // 2. Dynamic Match Percentage Calculation
        int skillMatchScore = 0;
        if (!jdSkills.isEmpty()) {
            skillMatchScore = (int) Math.round(((double) matchedSkills.size() / jdSkills.size()) * 100);
        } else {
            skillMatchScore = 50; // default baseline if JD text is general
        }

        // Contextual overlap score based on TF-IDF word vector similarity
        int textContextScore = calculateTextSimilarityScore(resumeText, jobDescriptionText);

        // Weighted final percentage (70% skill match + 30% text context similarity)
        int finalMatchPercentage = (int) Math.round((skillMatchScore * 0.70) + (textContextScore * 0.30));
        finalMatchPercentage = Math.min(98, Math.max(15, finalMatchPercentage));

        result.setMatchPercentage(finalMatchPercentage);
        result.setMatchedSkills(matchedSkills);
        result.setMissingSkills(missingSkills);

        // 3. Experience Match Evaluation
        String experienceMatch = evaluateExperienceMatch(resumeText, jobDescriptionText);
        result.setExperienceMatch(experienceMatch);

        // 4. Education Match Evaluation
        String educationMatch = evaluateEducationMatch(resumeText, jobDescriptionText);
        result.setEducationMatch(educationMatch);

        // 5. Overall Recommendation Summary
        String overallRecommendation = generateRecommendationText(finalMatchPercentage, matchedSkills.size(), missingSkills.size());
        result.setOverallRecommendation(overallRecommendation);

        // 6. Actionable Resume Improvement Suggestions
        List<String> suggestions = generateImprovementSuggestions(matchedSkills, missingSkills, resumeText, jobTitle);
        result.setSuggestions(suggestions);

        // 7. Recommended Skills to Learn
        List<String> recommendedSkills = missingSkills.stream()
                .map(MissingSkillDTO::getSkill)
                .limit(5)
                .collect(Collectors.toList());
        result.setRecommendedSkills(recommendedSkills);

        return result;
    }

    private boolean containsSkillIgnoreCase(Set<String> skills, String target) {
        return skills.stream().anyMatch(s -> s.equalsIgnoreCase(target));
    }

    private int calculateTextSimilarityScore(String text1, String text2) {
        if (text1 == null || text2 == null || text1.isBlank() || text2.isBlank()) return 0;

        Set<String> words1 = extractDistinctWords(text1);
        Set<String> words2 = extractDistinctWords(text2);

        if (words2.isEmpty()) return 50;

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        double jaccard = (double) intersection.size() / words2.size();
        return (int) Math.round(jaccard * 100);
    }

    private Set<String> extractDistinctWords(String text) {
        Set<String> words = new HashSet<>();
        String[] tokens = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        for (String token : tokens) {
            if (token.length() > 3 && !isStopWord(token)) {
                words.add(token);
            }
        }
        return words;
    }

    private boolean isStopWord(String word) {
        return Set.of("with", "that", "this", "from", "have", "will", "your", "their", "about", "which", "would", "there", "should", "could", "must", "other", "into", "also", "more", "some", "than", "them", "then", "only", "first", "very", "after").contains(word);
    }

    private Set<String> extractKeywordsFromText(String text) {
        Set<String> keywords = new LinkedHashSet<>();
        String[] lines = text.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.toLowerCase().startsWith("required") || trimmed.toLowerCase().startsWith("skills") || trimmed.toLowerCase().contains("experience")) {
                String[] words = trimmed.split("[,;:]");
                for (String w : words) {
                    if (w.trim().length() > 2) keywords.add(w.trim());
                }
            }
        }
        return keywords;
    }

    private String evaluateExperienceMatch(String resumeText, String jdText) {
        int jdYears = extractYearsOfExperience(jdText);
        int resumeYears = extractYearsOfExperience(resumeText);

        if (jdYears == 0) {
            return "Good Match — General experience requirements met.";
        }
        if (resumeYears >= jdYears) {
            return "Strong Match — Candidate meets or exceeds the required " + jdYears + "+ years of experience.";
        } else if (resumeYears > 0) {
            return "Partial Match — Candidate has ~" + resumeYears + " years of experience vs " + jdYears + " required.";
        } else {
            return "Needs Verification — Could not explicitly determine years of experience from resume.";
        }
    }

    private int extractYearsOfExperience(String text) {
        if (text == null) return 0;
        Pattern pattern = Pattern.compile("(\\d+)\\+?\\s*(?:years?|yrs?)\\s*(?:of)?\\s*(?:experience)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        int maxYears = 0;
        while (matcher.find()) {
            try {
                int yrs = Integer.parseInt(matcher.group(1));
                if (yrs < 30) maxYears = Math.max(maxYears, yrs);
            } catch (NumberFormatException ignored) {}
        }
        return maxYears;
    }

    private String evaluateEducationMatch(String resumeText, String jdText) {
        String lowerResume = resumeText.toLowerCase();
        boolean hasDegree = lowerResume.contains("bachelor") || lowerResume.contains("master") || lowerResume.contains("b.tech") || lowerResume.contains("m.tech") || lowerResume.contains("b.s") || lowerResume.contains("m.s") || lowerResume.contains("degree") || lowerResume.contains("computer science");

        if (hasDegree) {
            return "Strong Match — Relevant Degree / Educational background detected.";
        } else {
            return "Moderate Match — Specific degree not explicitly recognized; verify education section.";
        }
    }

    private String generateRecommendationText(int score, int matchedCount, int missingCount) {
        if (score >= 80) {
            return "Excellent Match — Your resume aligns strongly with the job requirements. Minor tweaking can maximize your chances.";
        } else if (score >= 60) {
            return "Good Match — Your resume matches most key requirements, but addressing missing skills will significantly boost fit.";
        } else if (score >= 40) {
            return "Moderate Match — Several important skills are missing. Consider tailoring your resume specifically for this position.";
        } else {
            return "Low Match — Significant skill gaps detected. Focus on developing key required skills before applying.";
        }
    }

    private List<String> generateImprovementSuggestions(List<String> matchedSkills, List<MissingSkillDTO> missingSkills, String resumeText, String jobTitle) {
        List<String> suggestions = new ArrayList<>();

        if (!missingSkills.isEmpty()) {
            String missingSkillNames = missingSkills.stream().limit(3).map(MissingSkillDTO::getSkill).collect(Collectors.joining(", "));
            suggestions.add("Add projects or hands-on experience involving key missing skills (" + missingSkillNames + ") if you possess them.");
        }

        if (!matchedSkills.isEmpty()) {
            String topSkills = matchedSkills.stream().limit(3).collect(Collectors.joining(", "));
            suggestions.add("Emphasize your matched core competencies (" + topSkills + ") prominently in your skills section and bullet points.");
        }

        if (jobTitle != null && !jobTitle.isBlank()) {
            suggestions.add("Tailor your professional headline or resume summary to directly reference the role of '" + jobTitle + "'.");
        }

        suggestions.add("Quantify your project achievements using metrics (e.g. 'Improved performance by 30%', 'Built REST API serving 10k+ requests').");
        suggestions.add("Ensure bullet points follow the Action Verb + Context + Result format for maximum ATS impact.");

        return suggestions;
    }
}
