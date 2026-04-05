package com.resort.solution.controller;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.Resort;
import com.resort.solution.entity.ResortAmenity;
import com.resort.solution.entity.ResortImage;
import com.resort.solution.service.ResortAmenityService;
import com.resort.solution.service.ResortImageService;
import com.resort.solution.service.ResortService;


@RestController
@RequestMapping("/user/resort")
public class ResortController {
	
	@Autowired
	private ResortService resortService;
	
	@Autowired
	private ResortImageService resortImgServ;
	
	@Autowired
	private ResortAmenityService resortAmenityServ;
	
	@Autowired 
	private ResortImageService resortImgService;
	
	
	//=================================================================================
	
	@GetMapping("/getResortImg")
	public List<String> getResortImage(@RequestParam Integer resortId) {
		List<ResortImage> resortImg = resortImgService.getImagesByResort(resortId);
		List<String> imgUrl = new ArrayList<String>();
		for(ResortImage res : resortImg) {
			imgUrl.add(res.getImageUrl());
		}
		return imgUrl;
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PostMapping("/addAmenity")
	public ResortAmenity addResortAmenity(@RequestBody ResortAmenity resAm) {
		if(resAm == null || resAm.getAmenity() == null || resAm.getResort() == null) {
			return null;
		}
		return resortAmenityServ.addAmenityToResort(resAm);
	} 
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@GetMapping("/getAmenityByResort")
	public @ResponseBody List<ResortAmenity> getAmenityByResort(@RequestParam Integer resortId) {
		if(resortId == null) {
			return null;
		}
		return resortAmenityServ.getAmenitiesByResort(resortId);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PutMapping("/deleteAmenityFromResort")
	public boolean deleteAmenityFromResort(@RequestParam Integer resortAmenityId) {
		boolean deleted = resortAmenityServ.removeAmenityFromResort(resortAmenityId);
		if(!deleted) {
			return false;
		}
		return true;
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PostMapping("/addResort")
	public Resort addResort(@RequestBody Resort res) {
		if(res == null) {
			return null;
		}
		return resortService.addResort(res);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PutMapping("/updateResort")
	public Resort updateResort(@RequestParam Integer resortId , @RequestBody Resort res) {
		return resortService.updateResort(resortId, res);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PutMapping("/activateResort")
	public ResponseEntity<?> activateResort(@RequestParam Integer resortId) {
		boolean acti = resortService.activeResort(resortId);
		if(!acti) {
			return ResponseEntity.ok(Map.of("message" , "Activation failed..."));
		}
		return ResponseEntity.ok(Map.of("message" , "Activation successful..."));
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PutMapping("/deactivateResort")
	public ResponseEntity<?> deactivateResort(@RequestParam Integer resortId) {
		boolean acti = resortService.deactivateResort(resortId);
		if(!acti) {
			return ResponseEntity.ok(Map.of("message" , "deactivation failed..."));
		}
		return ResponseEntity.ok(Map.of("message" , "deactivation successful..."));
	}
	

	@GetMapping("/getById")
	public Resort getByResortIds(@RequestParam Integer resId) {
		return resortService.getResortById(resId);
	}
	
	
	@GetMapping("/getByLoc")
	public List<Resort> getByLoc(@RequestParam Integer loc) {
		return resortService.getResortsByLocation(loc);
	}
	

	@GetMapping("/topResort")
	public List<Resort> getTopRated(@RequestParam Double rating) {
		return resortService.getTopRatedResorts(rating);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN' , 'OWNER')")
	@PostMapping("/addImage")
	public ResortImage addImg(@RequestBody ResortImage resImg) {
		return resortImgServ.addResortImage(resImg);
	}
	
	@GetMapping("/getAllResort")
	public List<Resort> getAllResorts() {
		return resortService.getAllResorts();
	}

}

//•	add/update resort
//•	activate/deactivate resort
//•	search resorts
//•	top-rated resorts
//•	resort details
