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
@Table(name="location")
public class Location {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="location_id")
	private Integer locationId;
	
	@Setter
	@Column(name="location_name" , nullable = false)
	private String locationName;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="city_id" , nullable = false)
	private City city;

}


//•	locationId
//•	locationName
//•	cityId (FK)
