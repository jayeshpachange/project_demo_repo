package com.resort.solution.service.implementation;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Booking;
import com.resort.solution.entity.BookingRoom;
import com.resort.solution.entity.Room;
import com.resort.solution.enums.BookingStatus;
import com.resort.solution.enums.RoomStatus;
import com.resort.solution.repository.BookingRepository;
import com.resort.solution.repository.BookingRoomRepository;
import com.resort.solution.repository.BookingServiceRepository;
import com.resort.solution.repository.RoomRepository;
import com.resort.solution.service.BookingRoomService;

@Service
public class BookingRoomServiceImpl implements BookingRoomService {
	
	@Autowired
	private BookingRoomRepository bookingRoomRepo;
	
	@Autowired
	private BookingRepository bookingRepo;
	
	@Autowired
	private RoomRepository roomRepo;
	
	@Autowired
	private BookingServiceRepository bookingServiceRepo;

	
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
	public BookingRoom addRoomToBooking(BookingRoom bookingRoom) {

	    if (bookingRoom == null || bookingRoom.getBooking() == null || bookingRoom.getRoom() == null) {
	        throw new RuntimeException("Invalid booking room data");
	    }

	    Booking booking = bookingRepo.findById(bookingRoom.getBooking().getBookingId()).orElseThrow(() -> new RuntimeException("Booking not found"));

	    if (booking.getBookingStatus() != BookingStatus.PENDING) {
	        throw new RuntimeException("Rooms can only be added in PENDING state");
	    }

	    Room room = roomRepo.findById(bookingRoom.getRoom().getRoomId()).orElseThrow(() -> new RuntimeException("Room not found"));

	    if (room.getStatus() == RoomStatus.MAINTENANCE) {
	        throw new RuntimeException("Room under maintenance");
	    }

	    boolean conflict = bookingRoomRepo.existsRoomBookedBetweenDates(room.getRoomId(), booking.getCheckInDate(),booking.getCheckOutDate());

	    if (conflict) {
	        throw new RuntimeException("Room already booked for selected dates");
	    }

	    bookingRoom.setBooking(booking);
	    bookingRoom.setRoom(room);
	    room.setStatus(RoomStatus.BOOKED);
	    roomRepo.save(room);
	    double pricePerNight = room.getBasePrice() * room.getRoomType().getTypeName().getPriceMultiplier();

	    bookingRoom.setPricePerNight(pricePerNight);

	    BookingRoom saved = bookingRoomRepo.save(bookingRoom);

	    double total = calculateTotalAmount(booking.getBookingId());
	    booking.setTotalAmount(total);
	    bookingRepo.save(booking);

	    return saved;
	}



	@Override
	public boolean removeRoomFromBooking(Integer bookingRoomId) {
	    BookingRoom bookingRoom = bookingRoomRepo.findById(bookingRoomId).orElse(null);
	    if (bookingRoom == null) {
	        return false;
	    }
	    Room room = roomRepo.findById(bookingRoom.getRoom().getRoomId()).orElseThrow(() -> new RuntimeException("Room not found"));
	    room.setStatus(RoomStatus.AVAILABLE);
	    roomRepo.save(room);
	    Booking booking = bookingRoom.getBooking();
	    if (booking.getBookingStatus() != BookingStatus.PENDING) {
	        throw new RuntimeException("Cannot remove room after booking is confirmed");
	    }
	    bookingRoomRepo.delete(bookingRoom);

	    double total = calculateTotalAmount(booking.getBookingId());
	    booking.setTotalAmount(total);
	    bookingRepo.save(booking);

	    return true;
	}


	@Override
	public List<BookingRoom> getRoomsByBooking(Integer bookingId) {
		List<BookingRoom> allRooms = bookingRoomRepo.findByBooking_BookingId(bookingId);
		return allRooms;
	}
	
	
	@Override
	public BookingRoom addRoomToBooking(Integer bookingId, BookingRoom bookingRoom) {
	    if (bookingRoom == null || bookingRoom.getRoom() == null) {
	        throw new RuntimeException("Invalid booking room data");
	    }

	    Booking booking = bookingRepo.findById(bookingId)
	            .orElseThrow(() -> new RuntimeException("Booking not found"));

	    if (booking.getBookingStatus() != BookingStatus.PENDING) {
	        throw new RuntimeException("Rooms can only be added in PENDING state");
	    }

	    Room room = roomRepo.findById(bookingRoom.getRoom().getRoomId()
	    ).orElseThrow(() -> new RuntimeException("Room not found"));

	    if (room.getStatus() == RoomStatus.MAINTENANCE) {
	        throw new RuntimeException("Room under maintenance");
	    }

	    boolean conflict = bookingRoomRepo.existsRoomBookedBetweenDates(room.getRoomId(), booking.getCheckInDate(), booking.getCheckOutDate() );

	    if (conflict) {
	        throw new RuntimeException("Room already booked for selected dates");
	    }

	    bookingRoom.setBooking(booking);
	    bookingRoom.setRoom(room);

	    double pricePerNight = room.getBasePrice() * room.getRoomType().getTypeName().getPriceMultiplier();

	    bookingRoom.setPricePerNight(pricePerNight);

	    BookingRoom saved = bookingRoomRepo.save(bookingRoom);

	    double total = calculateTotalAmount(booking.getBookingId());
	    booking.setTotalAmount(total);
	    bookingRepo.save(booking);

	    return saved;
	}


}
