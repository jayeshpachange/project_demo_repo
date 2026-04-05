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
@Table(name="city")
public class City {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "city_id")
	private Integer cityId;
	
	@Setter
	@Column(name= "city_name" , nullable = false)
	private String cityName;
	
	@Setter
	@Column(name= "state" , nullable = false)
	private String state;
	
	@Setter
	@Column(name= "country" , nullable = false)
	private String country;

}

//•	cityId
//•	cityName
//•	state
//•	country
