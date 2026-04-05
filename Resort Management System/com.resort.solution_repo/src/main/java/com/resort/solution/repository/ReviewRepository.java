package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
	List<Review> findByResort_ResortId(Integer resortId);
	List<Review> findByUser_UserId(Integer userId);
}
