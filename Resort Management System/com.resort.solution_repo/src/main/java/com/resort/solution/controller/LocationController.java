package com.resort.solution.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.Location;
import com.resort.solution.service.LocationService;

@RestController
@RequestMapping("/admin/loaction")
public class LocationController {
	
	@Autowired
	private LocationService locationService;
	
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/addLoc")
	public Location addLocations(@RequestBody Location loc) {
		return locationService.addLocation(loc);
	}
	
	
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/updateLoc")
	public Location updateLocations(@RequestParam Integer locId, @RequestBody Location loc) {
		return locationService.updateLocation(locId, loc);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteLocation(@RequestParam Integer locId) {
		boolean deleted = locationService.deleteLocation(locId);
		if(!deleted) {
			return ResponseEntity.ok(Map.of("message" , "Delete is failed..."));
		}
		return ResponseEntity.ok(Map.of("message" , "Delete is successfull..."));
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/getAllLocs")
	public  List<Location> getAllLocByCity(@RequestParam Integer cityId) {
		return locationService.getLocationsByCity(cityId);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/getLocsById")
	public Location getAllLocById(@RequestParam Integer locId) {
		return locationService.getLocationById(locId);
	}

}


//•	add/update/delete city
//•	add/update/delete location
//•	get locations by city
