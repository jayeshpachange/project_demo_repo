package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.City;
import com.resort.solution.entity.Location;

public interface LocationService {
	
	Location addLocation(Location location);
	Location updateLocation(Integer locationId , Location location);
	boolean deleteLocation(Integer locationId);
	List<Location> getLocationsByCity(Integer cityId);
	Location getLocationById(Integer locationId);

}


//•	addLocation
//•	updateLocation
//•	deleteLocation
//•	getLocationsByCity
//•	getLocationById
