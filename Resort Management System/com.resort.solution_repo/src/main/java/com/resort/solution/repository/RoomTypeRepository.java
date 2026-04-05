package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

}
