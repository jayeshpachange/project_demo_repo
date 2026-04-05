package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Amenity;
import com.resort.solution.repository.AmenityRepository;
import com.resort.solution.service.AmenityService;

@Service
public class AmenityServiceImpl implements AmenityService {
	
	@Autowired
	private AmenityRepository amenityRepo;

	@Override
	public Amenity addAmenity(Amenity amenity) {
		if(amenity == null) {
			return null;
		}
		Amenity newAmenity = amenity;
		return amenityRepo.save(newAmenity);
	}
 
	@Override
	public Amenity updateAmenity(Integer amenityId, Amenity amenity) {
		Amenity currentAmenity = amenityRepo.findById(amenityId).orElse(null);
		if(currentAmenity == null) {
			return null;
		}
		currentAmenity.setName(amenity.getName());
		currentAmenity.setDescription(amenity.getDescription());
		
		return amenityRepo.save(currentAmenity);		
	}

	@Override
	public boolean deleteAmenity(Integer amenityId) {
		Amenity currentAmenity = amenityRepo.findById(amenityId).orElse(null);
		if(currentAmenity==null) {
			return false;
		}
		amenityRepo.delete(currentAmenity);
		return true;
	}

	@Override
	public List<Amenity> getAllAmenities() {
		List<Amenity> amenities = amenityRepo.findAll();
		return amenities;
	}

}
