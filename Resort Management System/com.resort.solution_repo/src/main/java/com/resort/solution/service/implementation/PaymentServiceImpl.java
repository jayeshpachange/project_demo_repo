package com.resort.solution.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Booking;
import com.resort.solution.entity.BookingRoom;
import com.resort.solution.entity.Payment;
import com.resort.solution.entity.User;
import com.resort.solution.enums.BookingStatus;
import com.resort.solution.enums.PaymentStatus;
import com.resort.solution.repository.BookingRepository;
import com.resort.solution.repository.BookingRoomRepository;
import com.resort.solution.repository.PaymentRepository;
import com.resort.solution.repository.UserRepository;
import com.resort.solution.service.BookingServiceInterface;
import com.resort.solution.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {
	
	@Autowired
	private PaymentRepository payRepo;
	
	@Autowired
	private BookingRepository bookingRepo;
	
	@Autowired
	private BookingRoomRepository bookingRoomRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private BookingServiceInterface bookingServ;

//	@Override
//	public Payment initiatePayment(Payment payment) {
//		if(payment == null || payment.getBooking() == null) {
//			return null;
//		}
//		Integer bookingId = payment.getBooking().getBookingId();
//		Booking book = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Invalid Booking id. Give Valis bookingID"));
//		payment.setBooking(book);
//		payment.setPaymentStatus(PaymentStatus.PENDING);
//		String tranId = "PAY" +System.currentTimeMillis() + ThreadLocalRandom.current().nextInt(1000 , 9999);
//		payment.setTransactionId(tranId);
//		double amt = book.getTotalAmount();
//		payment.setAmount(amt);
//		return payRepo.save(payment);
//	}

	@Override
	public boolean confirmPayment(Integer paymentId) {

	    Payment payment = payRepo.findById(paymentId).orElseThrow(() -> new RuntimeException("Payment not found"));

	    if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
	        throw new RuntimeException("Payment already processed");
	    }

	    payment.setPaymentStatus(PaymentStatus.SUCCESS);
	    payRepo.save(payment);

	    return true;
	}


	@Override
	public boolean cancelPayment(Integer paymentId) {
	    Payment payment = payRepo.findById(paymentId).orElseThrow(() -> new RuntimeException("Payment not found"));
	    if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
	        throw new RuntimeException("Cannot cancel successful payment");
	    }
	    payment.setPaymentStatus(PaymentStatus.CANCELED);
	    payRepo.save(payment);
	    return true;
	}



	@Override
	public List<Payment> getPaymentsByBooking(Integer bookingId) {
		List<Payment> pays = payRepo.findByBooking_BookingId(bookingId);
		return pays;
	}

	@Override
	public List<Payment> getAllPayments() {
		return payRepo.findAll();
	}

	@Override
	public List<Payment> getAllPaymentByUserId(Integer userId) {
		List<Booking> books = bookingServ.getBookingsByUser(userId);
		Integer bookingId;
		List<Payment> pays = new ArrayList<Payment>(); 
		for(Booking b : books) {
			bookingId = b.getBookingId();
			pays.addAll(payRepo.findByBooking_BookingId(bookingId));
		}
		return pays;
	}

	
	@Override
	public Payment initiatePayment(Integer bookingId, Payment payment) {

	    if (payment == null || payment.getPaymentMode() == null) {
	        throw new RuntimeException("Invalid payment data");
	    }

	    Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
	    
	    List<BookingRoom> rooms = bookingRoomRepo.findByBooking_BookingId(bookingId);
	    
	    if (rooms.isEmpty()) {
            throw new RuntimeException("No rooms added to booking");
        }


	    if (booking.getBookingStatus() != BookingStatus.CONFIRMED || booking.getBookingStatus() != BookingStatus.COMPLETED) {

		    boolean alreadyPaid = payRepo.existsByBooking_BookingIdAndPaymentStatus(bookingId, PaymentStatus.SUCCESS);

		    if (alreadyPaid) {
		        throw new RuntimeException("Booking already paid");
		    }

		    payment.setBooking(booking);
		    payment.setAmount(booking.getTotalAmount());
		    payment.setPaymentStatus(PaymentStatus.PENDING);

		    String txnId = "PAY" + System.currentTimeMillis()+ ThreadLocalRandom.current().nextInt(1000, 9999);

		    payment.setTransactionId(txnId);

		    return payRepo.save(payment);
	    }else {
	    	throw new RuntimeException("Payment allowed only for CONFIRMED bookings");
	    }

	}
	 
	
	
}
