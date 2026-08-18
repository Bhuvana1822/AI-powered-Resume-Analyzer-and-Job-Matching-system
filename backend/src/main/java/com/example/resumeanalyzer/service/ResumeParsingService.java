package com.example.resumeanalyzer.service;

import com.example.resumeanalyzer.exception.ResumeParsingException;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

@Service
public class ResumeParsingService {

    private final Tika tika = new Tika();
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "doc", "txt");

    public String parseResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResumeParsingException("Uploaded resume file is empty.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidExtension(originalFilename)) {
            throw new ResumeParsingException("Unsupported file type. Please upload a PDF or DOCX file.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            String extractedText = tika.parseToString(inputStream);

            if (extractedText == null || extractedText.isBlank()) {
                throw new ResumeParsingException("Could not extract text from file. The document may be empty or image-only.");
            }

            // Clean up multiple spaces and empty lines
            return extractedText.replaceAll("\\r\\n|\\r", "\n").replaceAll("\n{3,}", "\n\n").trim();

        } catch (IOException | TikaException e) {
            throw new ResumeParsingException("Failed to parse uploaded document: " + e.getMessage());
        }
    }

    private boolean isValidExtension(String filename) {
        int lastIndex = filename.lastIndexOf('.');
        if (lastIndex == -1) return false;
        String ext = filename.substring(lastIndex + 1).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(ext);
    }
}
