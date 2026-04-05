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
@Table(name="booking_service")
public class BookingService {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="booking_service_id")
	private Integer bookingServiceId;
	
	@ManyToOne
	@Setter
	@JoinColumn(name="booking_id" , nullable = false)
	private Booking booking;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="service_id" , nullable = false)
	private Service service;
	
	@Setter
	@Column(name="service_count" , nullable=false)
	private int serviceCount;
	
	@Setter
	@Column(name="amount" , nullable=false)
	private double amount;

}


//bookingServiceId (PK) → Primary key uniquely identifying each booking-service entry
//
//bookingId (FK of Booking.bookingId) → Booking to which the service is added
//
//serviceId (FK of Service.serviceId) → Service availed by the user
//
//quantity → Number of times or units the service is used
//
//amount → Total amount calculated for the service (price × quantity)