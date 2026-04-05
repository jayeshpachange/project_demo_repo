package com.resort.solution.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="recommendation_log")
public class RecommendationLog {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="log_id")
	private Integer logId;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="user_id" , nullable=false)
	private User user;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="resort_id" , nullable=false)
	private Resort resort;	
	
	@Setter
	@Column(name="score")
	private double score;
	
	@Setter
	@CreationTimestamp
	@Column(name="recommended_at")
	private LocalDateTime recommendedAt;

}



//logId (PK) → Primary key uniquely identifying each recommendation entry
//
//userId (FK of User.userId) → User for whom the recommendation was generated
//
//resortId (FK of Resort.resortId) → Resort that was recommended
//
//score → Recommendation confidence or relevance score
//
//recommendedAt → Date and time when the recommendation was generated