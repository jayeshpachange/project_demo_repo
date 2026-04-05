package com.resort.solution.repository;

import java.util.List; 

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.RecommendationLog;

public interface RecommendationLogRepository extends JpaRepository<RecommendationLog, Integer> {
	List<RecommendationLog> findByUser_UserId(Integer userId);
}
