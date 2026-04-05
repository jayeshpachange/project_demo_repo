package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.User;
import com.resort.solution.enums.Role;
import com.resort.solution.enums.UserStatus;
import com.resort.solution.repository.UserRepository;
import com.resort.solution.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepo;

	@Override
	public User registerUser(User user) {
		if (user == null || user.getEmail() == null) {
			return null;
		}
		user.setRole(Role.USER);
		user.setStatus(UserStatus.ACTIVE);
		return userRepo.save(user);
	}

	@Override
	public User loginUser(String email, String password) {
		if (email == null || password == null) {
			return null;
		}
		return userRepo.findByEmailAndPassword(email, password);
	}

	@Override
	public User getUserById(Integer userId) {
		return userRepo.findById(userId).orElse(null);
	}

	@Override
	public User getUserByEmail(String email) {
		if (email == null) {
			return null;
		}
		User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		if (user == null) {
			return null;
		}
		return user;
	}

	@Override
	public User updateUserProfile(Integer userId, User updatedUser) {
		User existing = userRepo.findById(userId).orElse(null);
		if (existing == null || updatedUser == null) {
			return null;
		}
		if (updatedUser.getFullName() != null) {
			existing.setFullName(updatedUser.getFullName());
		}
		if (updatedUser.getPhone() != null) {
			existing.setPhone(updatedUser.getPhone());
		}
		if (updatedUser.getEmail() != null) {
			existing.setEmail(updatedUser.getEmail());
		}
		if (updatedUser.getPassword() != null) {
			existing.setPassword(updatedUser.getPassword());
		}
		return userRepo.save(existing);
	}

	@Override
	public boolean deactivateUser(Integer userId) {
		User user = userRepo.findById(userId).orElse(null);
		if (user == null) {
			return false;
		}
		user.setStatus(UserStatus.OFFLINE);
		userRepo.save(user);
		return true;
	}
	
	@Override
	public boolean activateUser(Integer userId) {
		User user = userRepo.findById(userId).orElse(null);
		if (user == null) {
			return false;
		}
		user.setStatus(UserStatus.ACTIVE);
		userRepo.save(user);
		return true;
	}

	@Override
	public boolean deleteUser(Integer userId) {
		Optional<User> user = userRepo.findById(userId);
		if(user.isEmpty()) {
			return false;
		}
		userRepo.deleteById(userId);
		return true;
	}

	@Override
	public boolean changePassword(Integer userId, String oldPass , String newPass) {
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("No such user "));
		if(!oldPass.equals(user.getPassword())) {
			return false;
		}else {
			user.setPassword(newPass);
			userRepo.save(user);
			return true;
		}
		
	}

	@Override
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	
	
	
	
	
}
