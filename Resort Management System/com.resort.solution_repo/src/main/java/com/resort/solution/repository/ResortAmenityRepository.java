package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.ResortAmenity;

public interface ResortAmenityRepository extends JpaRepository<ResortAmenity, Integer> {
	List<ResortAmenity> findByResort_ResortId(Integer resortId);
}
