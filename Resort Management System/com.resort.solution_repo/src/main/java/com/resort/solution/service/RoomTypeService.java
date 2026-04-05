package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.RoomType;

public interface RoomTypeService {
	RoomType addRoomType(RoomType roomType);
	RoomType updateRoomType(Integer roomTypeId, RoomType roomType);
	List<RoomType> getAllRoomTypes();
}

//•	addRoomType
//•	updateRoomType
//•	getAllRoomTypes
