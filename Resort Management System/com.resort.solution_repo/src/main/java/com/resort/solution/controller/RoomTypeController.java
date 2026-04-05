package com.resort.solution.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.RoomType;
import com.resort.solution.repository.RoomTypeRepository;
import com.resort.solution.service.RoomTypeService;

@RestController
@RequestMapping("/admin/roomType")
public class RoomTypeController {
	
	@Autowired
	private RoomTypeService roomTypeServ;
	
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/addRoomType")
	public RoomType addRoomType(@RequestBody RoomType roomtype) {
		return roomTypeServ.addRoomType(roomtype);
	}

}
