package com.resort.solution.controller;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.Room;
import com.resort.solution.enums.RoomStatus;
import com.resort.solution.service.RoomService;


@RestController
@RequestMapping("/user/room")
public class RoomController {
	@Autowired
	private RoomService roomService;
	
	@PreAuthorize("hasAnyRole('USER','ADMIN', 'OWNER')")
	@PostMapping("/addRoom")
	public Room addRoom(@RequestBody Room room) {
		return roomService.addRoom(room);
	} 
	
	@PreAuthorize("hasAnyRole('USER','ADMIN', 'OWNER')")
	@PutMapping("/updateRoom")
	public Room updateRoom(@RequestParam Integer roomId , @RequestBody Room room) {
		return roomService.updateRoom(roomId, room);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN', 'OWNER')")
	@PutMapping("/changeStatus")
	public ResponseEntity<?> changeStatus( @RequestParam Integer roomId, @RequestParam RoomStatus status) {
	    if (roomId == null || status == null) {
	        return ResponseEntity.badRequest().body(Map.of("message", "roomId and status are required"));
	    }
	    boolean changed = roomService.changeRoomStatus(roomId, status);

	    if (!changed) {
	        return ResponseEntity.status(404).body(Map.of("message", "Room not found or status not changed"));
	    }
	    return ResponseEntity.ok(Map.of("message", "Room status updated successfully"));
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN', 'OWNER')")
	@GetMapping("/getAllAvail")
	public List<Room> getAllAvailable() {
		return roomService.getAvailableRooms(RoomStatus.AVAILABLE);
	}
	
	
	
	@PreAuthorize("hasAnyRole('USER','ADMIN', 'OWNER')")
	@GetMapping("/getRoomsByResortId")
	public List<Room> getRoomByResortId(@RequestParam Integer resortId) {
		return roomService.getRoomsByResort(resortId);
	}
	
}

//•	add/update room
//•	change room status
//•	available rooms
