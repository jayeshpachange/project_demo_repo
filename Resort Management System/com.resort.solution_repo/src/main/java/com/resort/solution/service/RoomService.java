package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Resort;
import com.resort.solution.entity.Room;
import com.resort.solution.enums.RoomStatus;

public interface RoomService {
	Room addRoom(Room room);
	Room updateRoom(Integer roomId, Room room);	
	boolean changeRoomStatus(Integer roomId, RoomStatus status);
	List<Room> getRoomsByResort(Integer resortId);
	Room getRoomBookedByBookingId(Integer bookingId);
	List<Room> getAvailableRooms(RoomStatus status);
}

//•	addRoom
//•	updateRoom
//•	changeRoomStatus
//•	getRoomsByResort
//•	getAvailableRooms
