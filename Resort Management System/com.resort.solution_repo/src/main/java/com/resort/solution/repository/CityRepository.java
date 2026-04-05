package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.City;

public interface CityRepository extends JpaRepository<City, Integer> {

}
