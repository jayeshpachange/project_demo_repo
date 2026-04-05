package com.resort.solution.repository;

import java.util.List; 

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.City;
import com.resort.solution.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Integer> {
	List<Location> findByCity_CityId(Integer cityId);
	List<Location> findAllByCity_CityId(Integer cityId);
	List<Location> findAllByCity(City city);
}

