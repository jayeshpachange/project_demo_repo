package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Payment;
import com.resort.solution.enums.PaymentStatus;

public interface PaymentService {
	//Payment initiatePayment(Payment payment);
	boolean confirmPayment(Integer paymentId);
	boolean cancelPayment(Integer paymentId);
	List<Payment> getPaymentsByBooking(Integer bookingId);
	List<Payment> getAllPayments();
	List<Payment> getAllPaymentByUserId(Integer userId);
	Payment initiatePayment(Integer bookingId, Payment payment);


}

//•	initiatePayment
//•	confirmPayment
//•	failPayment
//•	getPaymentsByBooking
