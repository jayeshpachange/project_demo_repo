package com.resort.solution.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.Review;
import com.resort.solution.service.ReviewService;

@RestController
@RequestMapping("/user/review")
public class ReviewController {
	
	@Autowired
	private ReviewService reviewServ;
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@PostMapping("/addReview")
	public Review addReview(@RequestBody Review review) {
		return reviewServ.addReview(review);
	}
	

	@GetMapping("/getReviewByResort")
	public List<Review> getByResort(@RequestParam Integer resortId) {
		return reviewServ.getReviewsByResort(resortId);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@GetMapping("/getReviewByRUser")
	public List<Review> getByuSer(@RequestParam Integer userId) {
		return reviewServ.getReviewsByUser(userId);
	}
	

	@GetMapping("/getResortRating")
	public double getResortRating(@RequestParam Integer resortId) {
		return reviewServ.calculateAverageRating(resortId);
	}
}


//•	add review
//•	get reviews by resort
//•	get reviews by user
