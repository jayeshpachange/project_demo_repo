package com.resort.solution.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.resort.solution.entity.RecommendationLog;
import com.resort.solution.entity.Resort;
import com.resort.solution.service.RecommendationLogService;

@RestController
@RequestMapping("/user/recommendations")
public class RecommendationLogController {

    @Autowired
    private RecommendationLogService recommendationService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/generate")
    public ResponseEntity<List<Resort>> generateRecommendations(@RequestParam Integer userId) {
        List<Resort> resorts = recommendationService.generateRecommendations(userId);
        if (resorts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resorts);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<RecommendationLog> saveRecommendation(@RequestBody RecommendationLog recommendationLog) {
        RecommendationLog savedLog = recommendationService.saveRecommendation(recommendationLog);
        if (savedLog == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedLog);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/user")
    public ResponseEntity<List<RecommendationLog>> getRecommendationsByUser(@RequestParam Integer userId) {
        List<RecommendationLog> logs = recommendationService.getRecommendationsByUser(userId);
        if (logs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(logs);
    }
    
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getAll")
    public List<RecommendationLog> getAllRec() {
    	return recommendationService.getAll();
    }    
    
}


//•	get recommendations
//•	recommendation history
