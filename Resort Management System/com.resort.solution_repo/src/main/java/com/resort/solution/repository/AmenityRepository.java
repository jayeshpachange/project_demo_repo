package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Amenity;

public interface AmenityRepository extends JpaRepository<Amenity, Integer> {
	Amenity findByName(String name);
}
