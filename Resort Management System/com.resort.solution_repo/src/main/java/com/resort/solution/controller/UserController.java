package com.resort.solution.controller;

import java.util.List;
import java.util.Map;   

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;


import com.resort.solution.entity.User;
import com.resort.solution.security.JwtUtil;
import com.resort.solution.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService userService;	
	
	@Autowired
	private JwtUtil jwtUtil;
		
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@GetMapping("/getAllUsers")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@PostMapping("/register")
	public User register(@RequestBody User user) {
		return userService.registerUser(user);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@GetMapping("/getById")
	public User getUserByIds(@RequestParam Integer userId) {
		return userService.getUserById(userId);
	}
	
//	@PostMapping("/login")
//	public User login(@RequestParam String email , @RequestParam String password){
//		return userService.loginUser(email, password);
//	}
	

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
	    User user = userService.loginUser(email, password);
	    if (user == null) {
	        return ResponseEntity.status(401).body("Invalid credentials");
	    }
	    String token = jwtUtil.generateToken(user.getEmail() , "USER");
	    return ResponseEntity.ok( Map.of("token", token,"userId", user.getUserId(),"role", user.getRole().name()));
	}

	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@PutMapping("/update")
	public User register(@RequestParam Integer userId ,@RequestBody User user) {
		return userService.updateUserProfile(userId, user);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@PutMapping("/offState")
	public ResponseEntity<?> offStateUser(@RequestParam Integer userId) {
		boolean changed = userService.deactivateUser(userId);
		if(!changed) {
			return ResponseEntity.ok(Map.of("message" , "User not found..."));
		}
		return ResponseEntity.ok(Map.of("message" , "User state OFF successfully..."));
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@PutMapping("/OnState")
	public ResponseEntity<?> onStateUser(@RequestParam Integer userId) {
		boolean changed = userService.activateUser(userId);
		if(!changed) {
			return ResponseEntity.ok(Map.of("message" , "User not found..."));
		}
		return ResponseEntity.ok(Map.of("message" , "User state ACTIVATED successfully..."));
	}
	
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteUser(@RequestParam Integer userId) {
		boolean deleted = userService.deleteUser(userId);
		if(!deleted) { 
			return ResponseEntity.ok(Map.of("message" , "User not found..."));
		}
		return ResponseEntity.ok(Map.of("message" , "User deleted successfully..."));
	}
	
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@GetMapping("/me")
	public User getMyProfile(Authentication authentication) {
	    String email = authentication.getName(); // JWT sub
	    return userService.getUserByEmail(email);
	}
	
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@PutMapping("/changePassword/{userId}")
	public ResponseEntity<?> changePasswordOfUser(@PathVariable Integer userId , @RequestParam String oldPassword , @RequestParam String newPassword) {
	   boolean changed = userService.changePassword(userId, oldPassword, newPassword); 
	   if(!changed) {
		   return ResponseEntity.ok(Map.of("message" , "Cant change password..."));
	   }
	   return ResponseEntity.ok(Map.of("message" , "Password changed successfully..."));
	}


	
} 

//•	register
//•	login
//•	view/update profile
//•	deactivate account
