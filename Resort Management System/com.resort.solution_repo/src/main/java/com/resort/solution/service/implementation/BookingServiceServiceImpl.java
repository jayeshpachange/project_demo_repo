package com.resort.solution.service.implementation;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Booking;
import com.resort.solution.entity.BookingService;
import com.resort.solution.enums.BookingStatus;
import com.resort.solution.repository.BookingRepository;
import com.resort.solution.repository.BookingRoomRepository;
import com.resort.solution.repository.BookingServiceRepository;
import com.resort.solution.service.BookingServiceService;

@Service
public class BookingServiceServiceImpl implements BookingServiceService {
	
	@Autowired
	private BookingServiceRepository bookingServiceRepo;
	
	@Autowired
	private BookingRepository bookingRepo;
	
	@Autowired
	private BookingRoomRepository bookingRoomRepo;
	
	private double calculateTotalAmount(Integer bookingId) {

	    Booking booking = bookingRepo.findById(bookingId)
	            .orElseThrow(() -> new RuntimeException("Booking not found"));

	    long nights = ChronoUnit.DAYS.between(	booking.getCheckInDate(),booking.getCheckOutDate());

	    if (nights <= 0) {
	        throw new RuntimeException("Invalid check-in/check-out dates");
	    }

	    double roomTotal = bookingRoomRepo
	            .findByBooking_BookingId(bookingId)
	            .stream()
	            .mapToDouble(br -> br.getPricePerNight() * nights)
	            .sum();

	    double serviceTotal = bookingServiceRepo
	            .findByBooking_BookingId(bookingId)
	            .stream()
	            .mapToDouble(bs -> bs.getAmount())
	            .sum();

	    return roomTotal + serviceTotal;
	}
	
	@Override
	public BookingService addServiceToBooking(Integer bookingId, BookingService bookingService) {

	    if (bookingService == null || bookingService.getService() == null) {
	        throw new RuntimeException("Invalid booking service data");
	    }

	    Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

	    if (booking.getBookingStatus() != BookingStatus.PENDING) {
	        throw new RuntimeException("Services can only be added before confirmation");
	    }

	    bookingService.setBooking(booking);

	    double amount = bookingService.getService().getPrice() * bookingService.getServiceCount();

	    bookingService.setAmount(amount);

	    BookingService saved = bookingServiceRepo.save(bookingService);

	    double total = calculateTotalAmount(booking.getBookingId());
	    booking.setTotalAmount(total);
	    bookingRepo.save(booking);
	    return saved;
	}


	@Override
	public boolean removeServiceFromBooking(Integer bookingServiceId) {

	    BookingService bookingService = bookingServiceRepo.findById(bookingServiceId).orElse(null);

	    if (bookingService == null) {
	        return false;
	    }

	    Booking booking = bookingService.getBooking();

	    if (booking.getBookingStatus() != BookingStatus.PENDING) {
	        throw new RuntimeException("Cannot remove service after booking is confirmed");
	    }

	    bookingServiceRepo.delete(bookingService);

	    double total = calculateTotalAmount(booking.getBookingId());
	    booking.setTotalAmount(total);
	    bookingRepo.save(booking);

	    return true;
	}


	@Override
	public List<BookingService> getServicesByBooking(Integer bookingId) {
		return bookingServiceRepo.findByBooking_BookingId(bookingId);
	}
	
	@Override
	public List<BookingService> getAllBookingServices() {
		return bookingServiceRepo.findAll();
	}
 
}
