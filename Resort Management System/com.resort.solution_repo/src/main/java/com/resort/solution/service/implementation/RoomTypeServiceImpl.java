package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.RoomType;
import com.resort.solution.repository.RoomTypeRepository;
import com.resort.solution.service.RoomTypeService;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

	@Autowired
	private RoomTypeRepository roomTypeRepo;

	@Override
	public RoomType addRoomType(RoomType roomType) {
		if (roomType == null || roomType.getTypeName() == null) {
			return null;
		}
		return roomTypeRepo.save(roomType);
	}

	@Override
	public RoomType updateRoomType(Integer roomTypeId, RoomType roomType) {
		RoomType existing = roomTypeRepo.findById(roomTypeId).orElse(null);
		if (existing == null || roomType == null) {
			return null;
		}

		if (roomType.getTypeName() != null) {
			existing.setTypeName(roomType.getTypeName());
		}
		if (roomType.getCapacity() > 0) {
			existing.setCapacity(roomType.getCapacity());
		}

		return roomTypeRepo.save(existing);
	}

	@Override
	public List<RoomType> getAllRoomTypes() {
		return roomTypeRepo.findAll();
	}
	
	

}
