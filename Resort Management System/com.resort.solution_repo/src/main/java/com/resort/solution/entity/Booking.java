package com.resort.solution.entity;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.resort.solution.enums.BookingStatus;

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
@Table(name="booking")
public class Booking {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="booking_id")
	private Integer bookingId;
	
	@ManyToOne
	@Setter
	@JoinColumn(name ="user_id" , nullable = false)
	private User user;
	
	@ManyToOne
	@Setter
	@JoinColumn(name="resort_id" , nullable=false)
	private Resort resort;
	
	@Setter
	@Column(name="check_in", nullable=false)
	private LocalDate checkInDate;
	
	@Setter
	@Column(name="check_out", nullable=false)
	private LocalDate checkOutDate;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="booking_status", nullable=false)
	private BookingStatus bookingStatus;
	
	@Setter
	@Column(name="total_amount" , nullable=false)
	private double totalAmount;
	
	@Setter
	@CreationTimestamp
	@Column(name="booking_time" , nullable=false)
	private LocalDateTime createdAt;
}

//•	bookingId (PK) 
//•	userId (FK of User.userId) → User who made the booking
//•	resortId (FK of Resort.resortId) → Resort that is booked
//•	checkInDate → Date when the user checks in
//•	checkOutDate → Date when the user checks out
//•	bookingStatus → Current state of the booking (PENDING, CONFIRMED, CANCELLED, COMPLETED)
//•	totalAmount → Total amount for the booking including room charges
//•	createdAt → Date and time when the booking was created
