package com.resort.solution.service;

import java.util.List;
import com.resort.solution.entity.ResortAmenity;

public interface ResortAmenityService {
	ResortAmenity addAmenityToResort(ResortAmenity resortAmenity);
	boolean removeAmenityFromResort(Integer resortAmenityId);
	List<ResortAmenity> getAmenitiesByResort(Integer resortId);
}


//•	addAmenityToResort
//•	removeAmenityFromResort
//•	getAmenitiesByResort