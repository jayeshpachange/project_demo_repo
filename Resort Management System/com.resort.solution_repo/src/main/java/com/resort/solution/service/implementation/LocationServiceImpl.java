package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.City;
import com.resort.solution.entity.Location;
import com.resort.solution.repository.CityRepository;
import com.resort.solution.repository.LocationRepository;
import com.resort.solution.service.LocationService;

@Service
public class LocationServiceImpl implements LocationService {
	
	@Autowired
	private LocationRepository locationRepo;
	
	@Autowired
	private CityRepository cityRepo;

	@Override
	public Location addLocation(Location location) {
		if (location == null || location.getCity() == null) {
	        throw new RuntimeException("City is required");
	    }

	    Integer cityId = location.getCity().getCityId();

	    City city = cityRepo.findById(cityId)
	            .orElseThrow(() -> new RuntimeException("City not found"));

	    location.setCity(city);   

	    return locationRepo.save(location); 
	}

	@Override
	public Location updateLocation(Integer locationId, Location location) {
		if (location == null || location.getCity() == null) {
	        throw new RuntimeException("City is required");
	    }
		Location loc = locationRepo.findById(locationId).orElse(null);
		Integer cityId = location.getCity().getCityId();
		City city = cityRepo.findById(cityId).orElseThrow(() -> new RuntimeException("City Not Found.."));
		if(!loc.getCity().equals(city)) {
			loc.setCity(city);
		}
		if(!loc.getLocationName().equals(location.getLocationName())){
			loc.setLocationName(location.getLocationName());
		}
		return locationRepo.save(loc);		
	}

	@Override
	public boolean deleteLocation(Integer locationId) {
		Optional<Location> loc = locationRepo.findById(locationId);
		if(loc.isEmpty()) {
			return false;
		}
		locationRepo.deleteById(locationId);
		return true;
	} 

	@Override
	public List<Location> getLocationsByCity(Integer cityId) {
		List<Location> locs = locationRepo.findAllByCity_CityId(cityId);
		return locs;
	}

	@Override
	public Location getLocationById(Integer locationId) {
		Location locs = locationRepo.findById(locationId).orElse(null);
		if(locs == null) {
			return null;
		}
		return locs;
	}

}
