package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.City;
import com.resort.solution.repository.CityRepository;
import com.resort.solution.service.CityService;

@Service
public class CityServiceImpl implements CityService {
	
	@Autowired
	private CityRepository cityRepo;

	@Override
	public City addCity(City city) {
		if(city == null || city.getCityName() == null) {
			return null;
		}
		return cityRepo.save(city);
	}

	@Override
	public City updateCity(Integer cityId, City city) {
		City newCity = cityRepo.findById(cityId).orElse(null);
		if(newCity==null) {
			return null;
		}
		if(!newCity.getCityName().equals(city.getCityName())) {
			newCity.setCityName(city.getCityName());
		}
		if(!newCity.getCountry().equals(city.getCountry())) {
			newCity.setCountry(city.getCountry());
		}
		if(!newCity.getState().equals(city.getState())) {
			newCity.setState(city.getState());
		}
		return cityRepo.save(newCity);
	}

	@Override
	public boolean deleteCity(Integer cityId) {
		Optional<City> city = cityRepo.findById(cityId);
		if(city.isEmpty()) {
			return false;
		}
		cityRepo.deleteById(cityId);
		return true;
	}

	@Override
	public List<City> getAllCities() {
		List<City> cities = cityRepo.findAll();
		return cities;
	}

	@Override
	public City getCityById(Integer cityId) {
		City city = cityRepo.findById(cityId).orElse(null);
		if(city == null || city.getCityName() == null) {
			return null;
		}
		return city;
	}

}
