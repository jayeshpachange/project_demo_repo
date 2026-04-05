package com.resort.solution.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.City;
import com.resort.solution.service.CityService;

@RestController
@RequestMapping("/admin/city")
public class CityController {
	
	@Autowired
	private CityService cityService;
	
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/addCity")
	public City addCitys(@RequestBody City city) {
		return cityService.addCity(city);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/updateCity")
	public City addCitys(@RequestParam Integer cityId , @RequestBody City city) {
		return cityService.updateCity(cityId ,city);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteCity(@RequestParam Integer cityId) {
		boolean deleted = cityService.deleteCity(cityId);
		if(!deleted) {
			return ResponseEntity.ok(Map.of("message" , "Deletation failed..."));
		}
		return ResponseEntity.ok(Map.of("message" , "Deletation successful..."));		
	}

}
