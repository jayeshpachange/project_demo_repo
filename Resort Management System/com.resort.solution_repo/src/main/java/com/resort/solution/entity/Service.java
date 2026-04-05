package com.resort.solution.entity;

import com.resort.solution.enums.ServiceName;
import com.resort.solution.enums.ServiceType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name="service")
public class Service {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="service_id")
	private Integer serviceId;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="service_name" , nullable = false)
	private ServiceName serviceName;
	
	@Setter
	@Column(name="price" , nullable = false)
	private double price;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="service_type" , nullable = false)
	private ServiceType serviceType;
}


//serviceId (PK) → Primary key uniquely identifying each service
//
//serviceName → Name of the service (e.g., Spa, Swimming Pool, Gym)
//
//price → Cost of the service
//
//serviceType → Category of service (SPA, POOL, FOOD, GYM, OTHER)