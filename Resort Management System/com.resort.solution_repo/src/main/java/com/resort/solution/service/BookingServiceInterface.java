package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Booking;
import com.resort.solution.entity.BookingService;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.User;
import com.resort.solution.enums.BookingStatus;

public interface BookingServiceInterface {
	Booking createBooking(Booking booking);
	boolean confirmBooking(Integer bookingId);
	boolean cancelBooking(Integer bookingId);
	boolean completeBooking(Integer bookingId);
	Booking getBookingById(Integer bookingId);
	List<Booking> getBookingsByUser(Integer userId);
	List<Booking> getBookingsByResort(Integer resortId);
	List<Booking> getAllBookings();
	BookingService addServiceToBooking(BookingService bookingService);
	
}
//•	createBooking
//•	confirmBooking
//•	cancelBooking
//•	completeBooking
//•	getBookingById
//•	getBookingsByUser
//•	getBookingsByResort


//This interface refers to Booking entity.