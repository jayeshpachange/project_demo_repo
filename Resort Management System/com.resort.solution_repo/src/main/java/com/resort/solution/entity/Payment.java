package com.resort.solution.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.resort.solution.enums.PaymentMode;
import com.resort.solution.enums.PaymentStatus;

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
@Table(name="payment")
public class Payment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="payment_id")
	private Integer paymentId;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="booking_id" , nullable = false)
	private Booking booking;
	
	@Setter
	@Column(name="amount" , nullable = false)
	private double amount;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="payment_mode" ,  nullable = false)
	private PaymentMode paymentMode;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="payment_status")
	private PaymentStatus paymentStatus;
	
	@Setter
	@Column(name="transaction_id")
	private String transactionId;
	
	@Setter
	@CreationTimestamp
	@Column(name="payment_date" , nullable = false)
	private LocalDateTime paymentDate;
	
}


//paymentId (PK) → Primary key uniquely identifying each payment
//
//bookingId (FK of Booking.bookingId) → Booking for which the payment is made
//
//amount → Amount paid for the booking or additional services
//
//paymentMode → Method of payment (ONLINE, CASH, CARD, UPI)
//
//paymentStatus → Current status of the payment (PENDING, SUCCESS, FAILED, REFUNDED)
//
//transactionId → Unique transaction reference from payment gateway
//
//paymentDate → Date and time when the payment was completed