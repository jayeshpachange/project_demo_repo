package com.resort.solution.service.implementation;

import java.time.temporal.ChronoUnit;
import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Booking;
import com.resort.solution.entity.BookingRoom;
import com.resort.solution.entity.BookingService;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.Room;
import com.resort.solution.entity.User;
import com.resort.solution.enums.BookingStatus;
import com.resort.solution.enums.RoomStatus;
import com.resort.solution.enums.RoomTypeEnum;
import com.resort.solution.repository.BookingRepository;
import com.resort.solution.repository.BookingRoomRepository;
import com.resort.solution.repository.BookingServiceRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.repository.RoomRepository;
import com.resort.solution.repository.UserRepository;
import com.resort.solution.service.BookingServiceInterface;

@Service
public class BookingServiceInterfaceImpl implements BookingServiceInterface {
	
	@Autowired
	private BookingRepository bookingRepo;
	
	@Autowired
	private BookingServiceRepository bookingServiceRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private ResortRepository resortRepo;
	
	@Autowired
	private BookingRoomRepository bookingRoomRepo;
	
	@Autowired
	private RoomRepository roomRepo;
	
	
	
	
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
	public Booking createBooking(Booking booking) {
		if(booking == null || booking.getUser() == null || booking.getResort() == null) {
			return null;
		}
		Integer userid = booking.getUser().getUserId();
		User user = userRepo.findById(userid).orElseThrow(() -> new RuntimeException("User id is invalid..."));
		booking.setUser(user);
		Integer resortId = booking.getResort().getResortId();
		Resort resort = resortRepo.findById(resortId).orElseThrow(() -> new RuntimeException("Resort id is invalid..."));
		booking.setResort(resort);
		booking.setTotalAmount(0.00);
		booking.setBookingStatus(BookingStatus.PENDING);
		
		return bookingRepo.save(booking);
	}

	@Override
	public boolean confirmBooking(Integer bookingId) {

	    Booking booking = bookingRepo.findById(bookingId).orElse(null);
	    if (booking == null) return false;

	    List<BookingRoom> rooms = bookingRoomRepo.findByBooking_BookingId(bookingId);

	    if (rooms.isEmpty()) {
	        throw new RuntimeException("Cannot confirm booking without rooms");
	    }

	    booking.setBookingStatus(BookingStatus.CONFIRMED);
	    bookingRepo.save(booking);
	    
	    if (booking.getTotalAmount() <= 0) {
	        throw new RuntimeException("Invalid booking total amount");
	    }

	    return true;
	}


	@Override
	public boolean cancelBooking(Integer bookingId) {
		Booking newBooking = bookingRepo.findById(bookingId).orElse(null);
		if(newBooking == null) {
			return false;
		}
		newBooking.setBookingStatus(BookingStatus.CANCELLED);
		bookingRepo.save(newBooking);
		return true;
	}

	@Override
	public boolean completeBooking(Integer bookingId) {
	    Booking booking = bookingRepo.findById(bookingId).orElse(null);
	    if (booking == null) return false;

	    if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
	        throw new RuntimeException("Only confirmed bookings can be completed");
	    }

	    booking.setBookingStatus(BookingStatus.COMPLETED);

	    List<BookingRoom> rooms = bookingRoomRepo.findByBooking_BookingId(bookingId);

	    for (BookingRoom br : rooms) {
	        Room room = br.getRoom();
	        room.setStatus(RoomStatus.AVAILABLE);
	        roomRepo.save(room);
	    }

	    bookingRepo.save(booking);
	    return true;
	}
	
	@Override
	public BookingService addServiceToBooking(BookingService bookingService) {
	    if (bookingService == null || bookingService.getBooking() == null || bookingService.getService() == null) {
	        throw new RuntimeException("Invalid booking service data");
	    }
	    Booking booking = bookingRepo.findById(bookingService.getBooking().getBookingId() ).orElseThrow(() -> new RuntimeException("Booking not found"));

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
	public Booking getBookingById(Integer bookingId) {
		Booking booking = bookingRepo.findById(bookingId).orElse(null);
		if(booking == null || booking.getBookingId() == null) {
			return null;
		}
		return booking;
	}

	@Override
	public List<Booking> getBookingsByUser(Integer userId) {
		List<Booking> bookings = bookingRepo.findByUser_UserId(userId);
		return bookings;
	}

	@Override
	public List<Booking> getBookingsByResort(Integer resortId) {
		List<Booking> bookings = bookingRepo.findByResort_ResortId(resortId);
		return bookings;
	}

	@Override
	public List<Booking> getAllBookings() {
		return bookingRepo.findAll();
	}
	
	
	public double calculateRoomPrice(Room room) {
	    double basePrice = room.getBasePrice();
	    RoomTypeEnum type = room.getRoomType().getTypeName();
	    return basePrice * type.getPriceMultiplier();
	}

}
