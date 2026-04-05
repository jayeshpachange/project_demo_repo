package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Review;

public interface ReviewService {
    Review addReview(Review review);
    List<Review> getReviewsByResort(Integer resortId);
    List<Review> getReviewsByUser(Integer userId);
    double calculateAverageRating(Integer resortId);
}

//•	addReview
//•	getReviewsByResort
//•	getReviewsByUser
//•	calculateAverageRating
