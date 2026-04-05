package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.City;

public interface CityService {
	
	City addCity(City city);
	City updateCity(Integer cityId , City city);
	boolean deleteCity(Integer cityId);
	List<City> getAllCities();
	City getCityById(Integer cityId);
	
}

//•	addCity
//•	updateCity
//•	deleteCity
//•	getAllCities
//•	getCityById