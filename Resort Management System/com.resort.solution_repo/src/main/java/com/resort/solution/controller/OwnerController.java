package com.resort.solution.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.Owner;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.User;
import com.resort.solution.security.JwtUtil;
import com.resort.solution.service.OwnerService;

@RestController
@RequestMapping("/owner")
public class OwnerController {

	@Autowired
	private OwnerService ownerServ;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	
	@RequestMapping("/registerOwner")
	public Owner registeOwners(@RequestBody Owner owner) {
		if(owner==null || owner.getEmail() == null || owner.getPassword() == null) {
			return null;
		}
		return ownerServ.registerOwner(owner);
	}
	
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
	    Owner owner = ownerServ.loginOwner(email, password);
	    if (owner == null) {
	        return ResponseEntity.status(401).body("Invalid credentials");
	    }
	    String token = jwtUtil.generateToken(owner.getEmail() , "OWNER");
	    return ResponseEntity.ok( Map.of("token", token,"ownerId", owner.getOwnerId(),"role", owner.getRole().name()));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@GetMapping("/getOwnerById")
	public Owner getOwnerById(@RequestParam Integer ownerId) {
		return ownerServ.getOwnerById(ownerId);
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@GetMapping("/getOwnerByEmail")
	public Owner getOwnerById(@RequestParam String email) {
		return ownerServ.getOwnerByEmail(email);
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@PutMapping("/updateOwner")
	public Owner updateOwner(@RequestParam Integer ownerId , @RequestBody Owner owner) {
		return ownerServ.updateOwner(ownerId, owner);
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@PutMapping("/deactivateOwner")
	public ResponseEntity<?> deactivateOwner(@RequestParam Integer ownerId) {
		boolean deactivated = ownerServ.deactivateOwner(ownerId);
		if(!deactivated) {
			return ResponseEntity.ok(Map.of("message" , "Cant Deactivate Owner account..."));
		}
		return ResponseEntity.ok(Map.of("message" , "Deactivated Owner account..."));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@PutMapping("/activateOwner")
	public ResponseEntity<?> activateOwner(@RequestParam Integer ownerId) {
		boolean deactivated = ownerServ.activateOwner(ownerId);
		if(!deactivated) {
			return ResponseEntity.ok(Map.of("message" , "Cant Activate Owner account..."));
		}
		return ResponseEntity.ok(Map.of("message" , "Activated Owner account..."));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@DeleteMapping("/deleteOwner")
	public ResponseEntity<?> deleteOwner(@RequestParam Integer ownerId) {
		boolean deactivated = ownerServ.deleteOwner(ownerId);
		if(!deactivated) {
			return ResponseEntity.ok(Map.of("message" , "Cant Delete Owner account..."));
		}
		return ResponseEntity.ok(Map.of("message" , "Deleted Owner account..."));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
	@GetMapping("/getResortsByOwnerId")
	public List<Resort> getResortsByOwnerId(@RequestParam Integer ownerId) {
		return ownerServ.getResortsByOwnerId(ownerId);
	}
	
	@PreAuthorize("hasAnyRole('OWNER','ADMIN')")
	@GetMapping("/Ownerme")
	public Owner getMyProfile(Authentication authentication) {
	    String email = authentication.getName(); // JWT sub
	    return ownerServ.getOwnerByEmail(email);
	}
	
	
	@PreAuthorize("hasAnyRole('OWNER','ADMIN')")
	@PutMapping("/changePassword/{ownerId}")
	public ResponseEntity<?> changePasswordOfOwner(@PathVariable Integer ownerId , @RequestParam String oldPassword , @RequestParam String newPassword) {
	   boolean changed = ownerServ.changePassword(ownerId, oldPassword, newPassword); 
	   if(!changed) {
		   return ResponseEntity.ok(Map.of("message" , "Cant change password..."));
	   }
	   return ResponseEntity.ok(Map.of("message" , "Password changed successfully..."));
	}
}



//Owner registerOwner(Owner owner);
//Owner loginOwner(String email, String password);----
//Owner getOwnerById(Integer ownerId);-------
//Owner getOwnerByEmail(String email);-----------
//Owner updateOwner(Integer ownerId , Owner owner);-----
//boolean deactivateOwner(Integer ownerId);---------
//boolean activateOwner(Integer ownerId);-----------
//boolean deleteOwner(Integer ownerId);---------------
//List<Resort> getResortsByOwnerId(Integer ownerId);