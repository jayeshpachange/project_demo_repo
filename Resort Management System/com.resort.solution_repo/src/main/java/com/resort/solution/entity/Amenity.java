package com.resort.solution.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="amenity")
public class Amenity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="amenity_id")
	private Integer amenityId;
	
	@Setter
	@Column(name="amenity_name" , nullable = false)
	private String name;
	
	@Setter
	@Column(name="description" , nullable = false)
	private String description;

}



//amenityId (PK)
//name 
//description 