package com.resort.solution.entity;

import com.resort.solution.enums.EnvironmentScore; 
import com.resort.solution.enums.ResortStatus;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="resort")
public class Resort {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="resort_id")
	private Integer resortId;
	
	@Setter
	@Column(name="resort_name" , nullable = false)
	private String name;
	
	@Setter
	@Column(name="description" , nullable = false)
	private String description;
	
	
	
	@Setter
	@ManyToOne
	@JoinColumn(name="location_id" , nullable = false)
	private Location location;
	
	@Setter
	@Column(name="rating")
	private Double rating;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="eco_score")
	private EnvironmentScore ecoScore;
	
	@ManyToOne
	@JoinColumn(name = "owner_id", nullable = false)
	private Owner owner;

	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="active_status")
	private ResortStatus isActive;
	
	
	
}


//resortId (PK)
//
//name 
//
//description
//
//locationId (FK of Location.locationId) 
//
//rating 
//
//ecoScore 
//
//isActive 