package com.resort.solution.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.resort.solution.enums.SentimentScore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="review")
public class Review {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="review_id")
	private Integer reviewId;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="user_id" , nullable = false)
	private User user;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="resort_id" , nullable = false)
	private Resort resort;
	
	@Setter
	@Column(name="rating" , nullable=false)
	@DecimalMin(value = "0.0", inclusive = true, message = "Rating must be at least 0.0")
	@DecimalMax(value = "5.0", inclusive = true, message = "Rating must be at most 5.0")
	private double rating;
	
	@Setter
	@Column(name="comment")
	private String comment;
	
	@Setter
	@Column(name="sentiment_score")
	@Enumerated(EnumType.STRING)
	private SentimentScore sentimentScore;
	
	@CreationTimestamp
	@Setter
	@Column(name="created_at")
	private LocalDateTime createdAt;

}


//reviewId (PK) → Primary key uniquely identifying each review
//
//userId (FK of User.userId) → User who submitted the review
//
//resortId (FK of Resort.resortId) → Resort being reviewed
//
//rating → Numerical rating given by the user (e.g., 1–5)
//
//comment → Text feedback provided by the user
//
//sentimentScore → Computed sentiment value derived from the review comment (negative / neutral / positive)
//
//createdAt → Date and time when the review was submitted