package com.example.resumeanalyzer.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SkillExtractionService {

    private final Map<String, List<String>> skillDictionary = new LinkedHashMap<>();

    public SkillExtractionService() {
        initDictionary();
    }

    private void initDictionary() {
        // Core Languages
        addSkill("Java", "java", "core java", "java 8", "java 11", "java 17", "java 21");
        addSkill("Python", "python", "python3", "py");
        addSkill("JavaScript", "javascript", "js", "ecmascript");
        addSkill("TypeScript", "typescript", "ts");
        addSkill("C++", "c\\+\\+", "cpp");
        addSkill("C", "c language", "c programming", "\\bc\\b");
        addSkill("C#", "c#", "csharp", "\\.net");
        addSkill("Go", "golang", "\\bgo\\b");
        addSkill("Rust", "rust");
        addSkill("SQL", "\\bsql\\b", "structured query language");

        // Frontend Technologies
        addSkill("React", "react", "reactjs", "react.js");
        addSkill("Angular", "angular", "angularjs", "angular 2+");
        addSkill("Vue.js", "vue", "vuejs", "vue.js");
        addSkill("Node.js", "node", "nodejs", "node.js");
        addSkill("Next.js", "next.js", "nextjs");
        addSkill("HTML", "html", "html5");
        addSkill("CSS", "css", "css3");
        addSkill("Tailwind CSS", "tailwind", "tailwindcss");
        addSkill("Bootstrap", "bootstrap");
        addSkill("Redux", "redux", "redux toolkit");

        // Backend Frameworks
        addSkill("Spring Boot", "spring boot", "springboot");
        addSkill("Spring", "spring framework", "spring mvc", "spring data");
        addSkill("Express.js", "express", "expressjs", "express.js");
        addSkill("Django", "django");
        addSkill("Flask", "flask");
        addSkill("FastAPI", "fastapi");

        // Databases & Storage
        addSkill("MySQL", "mysql");
        addSkill("PostgreSQL", "postgresql", "postgres");
        addSkill("MongoDB", "mongodb", "mongo");
        addSkill("Redis", "redis");
        addSkill("Oracle", "oracle db", "oracle database");
        addSkill("SQLite", "sqlite");

        // Cloud & DevOps
        addSkill("AWS", "aws", "amazon web services", "ec2", "s3", "lambda");
        addSkill("Azure", "azure", "microsoft azure");
        addSkill("GCP", "gcp", "google cloud", "google cloud platform");
        addSkill("Docker", "docker", "containerization");
        addSkill("Kubernetes", "kubernetes", "k8s");
        addSkill("Git", "\\bgit\\b");
        addSkill("GitHub", "github");
        addSkill("GitLab", "gitlab");
        addSkill("CI/CD", "ci/cd", "ci-cd", "jenkins", "github actions");
        addSkill("Linux", "linux", "ubuntu", "bash", "shell scripting");

        // Architecture & APIs
        addSkill("REST API", "rest api", "rest apis", "restful", "restful apis");
        addSkill("GraphQL", "graphql");
        addSkill("Microservices", "microservices", "microservice architecture");

        // Data Science & AI
        addSkill("Machine Learning", "machine learning", "ml");
        addSkill("Artificial Intelligence", "artificial intelligence", "\\bai\\b");
        addSkill("Data Structures", "data structures", "dsa");
        addSkill("Algorithms", "algorithms", "algo");
        addSkill("Deep Learning", "deep learning", "dl");
        addSkill("TensorFlow", "tensorflow");
        addSkill("PyTorch", "pytorch");
        addSkill("Pandas", "pandas");
        addSkill("NumPy", "numpy");
        addSkill("Scikit-Learn", "scikit-learn", "sklearn");
    }

    private void addSkill(String canonicalName, String... patterns) {
        List<String> regexes = new ArrayList<>();
        for (String pat : patterns) {
            regexes.add(pat);
        }
        skillDictionary.put(canonicalName, regexes);
    }

    public Set<String> extractSkills(String text) {
        Set<String> detectedSkills = new LinkedHashSet<>();
        if (text == null || text.isBlank()) {
            return detectedSkills;
        }

        String lowerText = text.toLowerCase();

        for (Map.Entry<String, List<String>> entry : skillDictionary.entrySet()) {
            String canonicalName = entry.getKey();
            List<String> regexes = entry.getValue();

            for (String regex : regexes) {
                // If regex doesn't already contain boundary operators like \b or \+, wrap with word boundaries
                String patternString = regex;
                if (!regex.contains("\\b") && !regex.contains("\\+") && !regex.contains("#")) {
                    patternString = "\\b" + Pattern.quote(regex) + "\\b";
                }

                Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(lowerText);
                if (matcher.find()) {
                    detectedSkills.add(canonicalName);
                    break;
                }
            }
        }

        return detectedSkills;
    }

    public Map<String, List<String>> getSkillDictionary() {
        return Collections.unmodifiableMap(skillDictionary);
    }
}
