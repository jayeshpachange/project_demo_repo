package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.BookingRoom;
import com.resort.solution.entity.Room;

public interface BookingRoomService {
	BookingRoom addRoomToBooking(BookingRoom bookingRoom);
	boolean removeRoomFromBooking(Integer bookingRoomId);
	List<BookingRoom> getRoomsByBooking(Integer bookingId);
	BookingRoom addRoomToBooking(Integer bookingId, BookingRoom bookingRoom);

}
//•	addRoomToBooking
//•	removeRoomFromBooking
//•	getRoomsByBooking
