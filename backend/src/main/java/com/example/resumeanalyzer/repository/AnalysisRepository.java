package com.example.resumeanalyzer.repository;

import com.example.resumeanalyzer.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    List<Analysis> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Analysis> findAllByOrderByCreatedAtDesc();
}
