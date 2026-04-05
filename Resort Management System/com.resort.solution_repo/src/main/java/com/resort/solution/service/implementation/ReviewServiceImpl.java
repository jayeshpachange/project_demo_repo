package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Resort;
import com.resort.solution.entity.Review;
import com.resort.solution.entity.User;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.repository.ReviewRepository;
import com.resort.solution.repository.UserRepository;
import com.resort.solution.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

	@Autowired
	private ReviewRepository reviewRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private ResortRepository resortRepo;

	@Override
	public Review addReview(Review review) {
		if (review == null || review.getUser() == null || review.getResort() == null) {
			return null;
		}
		Integer userId = review.getUser().getUserId();
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("Invalid userId"));
		review.setUser(user);
		
		Integer resortId = review.getResort().getResortId();
		Resort reosrt = resortRepo.findById(resortId).orElseThrow(() -> new RuntimeException("Invalid resortId"));
		review.setResort(reosrt);
		
		return reviewRepo.save(review);
	}

	@Override
	public List<Review> getReviewsByResort(Integer resortId) {
		return reviewRepo.findByResort_ResortId(resortId);
	}

	@Override
	public List<Review> getReviewsByUser(Integer userId) {
		return reviewRepo.findByUser_UserId(userId);
	}

	@Override
	public double calculateAverageRating(Integer resortId) {
		List<Review> reviews = reviewRepo.findByResort_ResortId(resortId);
		if (reviews == null || reviews.isEmpty()) {
			return 0.0;
		}
		double total = 0;
		for (Review r : reviews) {
			total += r.getRating();
		}
		return total / reviews.size();
	}

}
