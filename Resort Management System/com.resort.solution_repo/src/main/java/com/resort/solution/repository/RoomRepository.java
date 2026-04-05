package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Room;
import com.resort.solution.enums.RoomStatus;

public interface RoomRepository extends JpaRepository<Room, Integer> {
	List<Room> findByResort_ResortId(Integer resortId);
	List<Room> findByStatus(RoomStatus status);
}
