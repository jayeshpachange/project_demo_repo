package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Amenity;

public interface AmenityService {
	Amenity addAmenity(Amenity amenity);
	Amenity updateAmenity(Integer amenityId , Amenity amenity);
	boolean deleteAmenity(Integer amenityId);
	List<Amenity> getAllAmenities();
}

//•	addAmenity
//•	updateAmenity
//•	deleteAmenity
//•	getAllAmenities
