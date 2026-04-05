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
@Table(name="resort_amenity")
public class ResortAmenity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="resort_amenity_id")
	private Integer resortAmenityId;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="resort_id" , nullable = false)
	private Resort resort;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="amenity_id" , nullable = false)
	private Amenity amenity;
}


//resortId (FK of Resort.resortId)
//amenityId (FK of Amenity.amenityId)