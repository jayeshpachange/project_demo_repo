package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Location;
import com.resort.solution.entity.Resort;

public interface ResortService {
	
	Resort addResort(Resort resort);
	Resort updateResort(Integer resortId , Resort resort);
	boolean activeResort(Integer resortId);
	boolean deactivateResort(Integer resortId);
	Resort getResortById(Integer resortId);
	List<Resort> getResortsByLocation(Integer location);
	List<Resort> searchResorts(Integer location);
	List<Resort> getTopRatedResorts(Double rating);
	List<Resort> getAllResorts();
}


//•	addResort
//•	updateResort
//•	activateResort
//•	deactivateResort
//•	getResortById
//•	getResortsByLocation
//•	searchResorts
//•	getTopRatedResorts
