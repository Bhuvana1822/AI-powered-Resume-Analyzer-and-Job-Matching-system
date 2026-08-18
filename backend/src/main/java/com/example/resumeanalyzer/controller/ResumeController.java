package com.example.resumeanalyzer.controller;

import com.example.resumeanalyzer.entity.Resume;
import com.example.resumeanalyzer.repository.ResumeRepository;
import com.example.resumeanalyzer.service.ResumeParsingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeParsingService resumeParsingService;
    private final ResumeRepository resumeRepository;

    public ResumeController(ResumeParsingService resumeParsingService, ResumeRepository resumeRepository) {
        this.resumeParsingService = resumeParsingService;
        this.resumeRepository = resumeRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) Long userId) {

        String extractedText = resumeParsingService.parseResume(file);

        Resume resume = new Resume(
                userId != null ? userId : 1L,
                file.getOriginalFilename(),
                file.getContentType(),
                extractedText
        );

        Resume savedResume = resumeRepository.save(resume);

        Map<String, Object> response = new HashMap<>();
        response.put("resumeId", savedResume.getId());
        response.put("fileName", savedResume.getFileName());
        response.put("fileType", savedResume.getFileType());
        response.put("extractedText", savedResume.getExtractedText());
        response.put("uploadedAt", savedResume.getUploadedAt());
        response.put("message", "Resume uploaded and parsed successfully.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable Long id) {
        return resumeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
