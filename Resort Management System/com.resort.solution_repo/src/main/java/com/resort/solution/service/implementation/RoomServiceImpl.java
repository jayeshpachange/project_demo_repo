package com.resort.solution.service.implementation;

import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Booking;
import com.resort.solution.entity.BookingRoom;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.Room;
import com.resort.solution.entity.RoomType;
import com.resort.solution.enums.RoomStatus;
import com.resort.solution.repository.BookingRepository;
import com.resort.solution.repository.BookingRoomRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.repository.RoomRepository;
import com.resort.solution.repository.RoomTypeRepository;
import com.resort.solution.service.RoomService;

@Service
public class RoomServiceImpl implements RoomService {

	@Autowired
	private RoomRepository roomRepo;
	
	@Autowired
	private RoomTypeRepository roomTypeRepo;
	
	@Autowired
	private ResortRepository resortRepo;
	
	@Autowired
	private BookingRoomRepository bookingRepo;
	
	

	@Override
	public Room addRoom(Room room) {
		if (room == null || room.getResort() == null || room.getRoomType() == null) {
			return null; 
		}
		Integer resortId = room.getResort().getResortId();
		Resort resort = resortRepo.findById(resortId).orElseThrow(()-> new RuntimeException("No such roomId"));
		room.setResort(resort);
		Integer roomTypeId = room.getRoomType().getRoomTypeId();
		RoomType roomType = roomTypeRepo.findById(roomTypeId).orElseThrow(()-> new RuntimeException("No such room type..."));
		room.setRoomType(roomType);
		return roomRepo.save(room);
	}

	@Override
	public Room updateRoom(Integer roomId, Room room) {

	    Room existing = roomRepo.findById(roomId).orElse(null);

	    if (existing == null || room == null) {
	        return null;
	    }

	    if (room.getRoomNumber() != null && !room.getRoomNumber().equals(existing.getRoomNumber())) {
	        existing.setRoomNumber(room.getRoomNumber());
	    }

	    if (room.getRoomType() != null && !room.getRoomType().equals(existing.getRoomType())) {
	        existing.setRoomType(room.getRoomType());
	    }

	    if (room.getBasePrice() != null && !room.getBasePrice().equals(existing.getBasePrice())) {
	        existing.setBasePrice(room.getBasePrice());
	    }

	    if (room.getStatus() != null && !room.getStatus().equals(existing.getStatus())) {
	        existing.setStatus(room.getStatus());
	    }

	    return roomRepo.save(existing);
	}


	@Override
	public boolean changeRoomStatus(Integer roomId, RoomStatus status) {
		Room room = roomRepo.findById(roomId).orElse(null);
		if (room == null || status == null) {
			return false;
		}
		room.setStatus(status);
		roomRepo.save(room);
		return true;
	}

	@Override
	public List<Room> getRoomsByResort(Integer resortId) {
		if (resortId == null) {
			return null;
		}
		return roomRepo.findByResort_ResortId(resortId);
	}

	@Override
	public List<Room> getAvailableRooms(RoomStatus status) {
		return roomRepo.findByStatus(status);
	}

	@Override
	public Room getRoomBookedByBookingId(Integer bookingId) {
		List<BookingRoom> bookedRooms = bookingRepo.findByBooking_BookingId(bookingId);
        if (bookedRooms.isEmpty()) {
            return null; 
        }
        return bookedRooms.get(0).getRoom();
	}

}
