package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Amenity;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.ResortAmenity;
import com.resort.solution.repository.AmenityRepository;
import com.resort.solution.repository.ResortAmenityRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.service.ResortAmenityService;

@Service
public class ResortAmenityServiceImpl implements ResortAmenityService {
	
	@Autowired
	private ResortAmenityRepository resrepo;
	
	@Autowired
	private ResortRepository resortRepo;
	
	@Autowired
	private AmenityRepository amenityRepo;

	@Override
	public ResortAmenity addAmenityToResort(ResortAmenity resortAmenity) {
		if(resortAmenity == null || resortAmenity.getResort() != null || resortAmenity.getAmenity() != null) {
			return null;
		}
		
		Integer resortId = resortAmenity.getResort().getResortId();
		Resort resort = resortRepo.findById(resortId).orElseThrow(() -> new RuntimeException("Invalid ResortId"));
		resortAmenity.setResort(resort);
		
		Integer amenityId = resortAmenity.getAmenity().getAmenityId();
		Amenity amenity = amenityRepo.findById(amenityId).orElseThrow(() -> new RuntimeException("Invalid Amenity Id..."));
		resortAmenity.setAmenity(amenity);
		
		return resrepo.save(resortAmenity);
	}

	@Override
	public boolean removeAmenityFromResort(Integer resortAmenityId) {
		Optional<ResortAmenity> resAm = resrepo.findById(resortAmenityId);
		if(resAm.isEmpty()) {
			return false;
		}
		resrepo.deleteById(resortAmenityId);
		return true;
	}

	@Override
	public List<ResortAmenity> getAmenitiesByResort(Integer resortId) {
		List<ResortAmenity> resAmenity = resrepo.findByResort_ResortId(resortId);
		return resAmenity;
	}

}
