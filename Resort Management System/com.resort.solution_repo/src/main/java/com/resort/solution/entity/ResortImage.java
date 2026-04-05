package com.resort.solution.entity;

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
@Table(name="resort_image")
public class ResortImage {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="image_id")
	private Integer imageId;
	
	@Setter
	@Column(name="image_url" ,columnDefinition = "LONGTEXT", nullable = false)
	private String imageUrl;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="resort_id" , nullable = false)
	private Resort resort;
}

//
//imageId (PK)
//
//imageUrl 
//
//resortId (FK of Resort.resortId) 