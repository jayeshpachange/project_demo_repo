package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Location;
import com.resort.solution.entity.Resort;
import com.resort.solution.enums.ResortStatus;
import com.resort.solution.repository.LocationRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.service.ResortService;

@Service
public class ResortServiceImpl implements ResortService {
	
	@Autowired
	private ResortRepository resortRepo;
	@Autowired
	private LocationRepository locationRepo;


	@Override
	public Resort addResort(Resort resort) {
		if(resort == null || resort.getLocation() == null) {
			throw new  RuntimeException("Resort or Location cannot be null....");
		}
		Integer locId = resort.getLocation().getLocationId();
		Location loc = locationRepo.findById(locId).orElseThrow(() -> new RuntimeException("Location not found with id: " + locId));
		resort.setLocation(loc);
		return resortRepo.save(resort);
	}

	@Override
	public Resort updateResort(Integer resortId, Resort resort) {
		Resort res = resortRepo.findById(resortId).orElse(null);
		if(res == null) {
			return null;
		}
		if(resort.getName() != null && !res.getName().equals(resort.getName())) {
			res.setName(resort.getName());
		}
		

		if(resort.getEcoScore() != null && !res.getEcoScore().equals(resort.getEcoScore())) {
			res.setEcoScore(resort.getEcoScore());
		}
		
		if(resort.getDescription() != null && !res.getDescription().equals(resort.getDescription())) {
			res.setDescription(resort.getDescription());
		}
		
		if(resort.getIsActive() != null && !res.getIsActive().equals(resort.getIsActive())) {
			res.setIsActive(resort.getIsActive());
		}
		
		if (resort.getRating() != null && !resort.getRating().equals(res.getRating())) {
			res.setRating(resort.getRating());
		}
		
		
		if(resort.getLocation() != null && resort.getLocation().getLocationId() != null && !res.getLocation().getLocationId().equals(resort.getLocation().getLocationId())) {
			Location location = locationRepo.findById(resort.getLocation().getLocationId()).orElseThrow(() -> new RuntimeException("Location not found"));
	        res.setLocation(location);
		}
		return resortRepo.save(res);
	}

	@Override
	public boolean activeResort(Integer resortId) {
		Resort res = resortRepo.findById(resortId).orElse(null);
		if(res == null) {
			return false;
		}
		res.setIsActive(ResortStatus.ACTIVE);
		resortRepo.save(res);
		return true;
	}

	@Override
	public boolean deactivateResort(Integer resortId) {
		Resort res = resortRepo.findById(resortId).orElse(null);
		if(res == null) {
			return false;
		}
		res.setIsActive(ResortStatus.CLOSED);
		resortRepo.save(res);
		return true;
	}

	@Override
	public Resort getResortById(Integer resortId) {
		Resort res = resortRepo.findById(resortId).orElse(null);
		if(res == null) {
			return null;
		}
		return res;
	}

	@Override
	public List<Resort> getResortsByLocation(Integer locationId) {
		List<Resort> resorts = resortRepo.findByLocation_LocationId(locationId);
		return resorts;
	}

	@Override
	public List<Resort> searchResorts(Integer locationId) {
		List<Resort> resorts = resortRepo.findByLocation_LocationId(locationId);
		return resorts;
	}

	@Override
	public List<Resort> getTopRatedResorts(Double rating) {
		List<Resort> resorts = resortRepo.findByIsActiveAndRatingGreaterThan(ResortStatus.ACTIVE , rating);
		return resorts;
	}
	
	@Override
	public List<Resort> getAllResorts() {
		List<Resort> resorts = resortRepo.findAll();
		return resorts;
	}
}
