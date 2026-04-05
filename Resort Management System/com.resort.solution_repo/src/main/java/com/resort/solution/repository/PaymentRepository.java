package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Payment;
import com.resort.solution.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
	List<Payment> findByBooking_BookingId(Integer bookingId);
	boolean existsByBooking_BookingIdAndPaymentStatus(Integer bookingId, PaymentStatus paymentStatus);

}
