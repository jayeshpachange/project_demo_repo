package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.RecommendationLog;
import com.resort.solution.entity.Resort;

public interface RecommendationLogService {
    List<Resort> generateRecommendations(Integer userId);
    RecommendationLog saveRecommendation(RecommendationLog recommendationLog);
    List<RecommendationLog> getRecommendationsByUser(Integer userId);
    List<RecommendationLog> getAll();
}

//•	generateRecommendations
//•	saveRecommendation
//•	getRecommendationsByUser
