package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Resort;
import com.resort.solution.enums.ResortStatus;

public interface ResortRepository extends JpaRepository<Resort, Integer> {
	List<Resort> findByIsActiveAndRatingGreaterThan(ResortStatus status, double rating);
	List<Resort> findByLocation_LocationId(Integer locationId);
	List<Resort> findByRating(double ratings);
	List<Resort> findByOwner_OwnerId(Integer ownerId);
}
