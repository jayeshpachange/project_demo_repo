package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.User;

public interface UserService {
	
	User registerUser(User user);
	User loginUser(String email , String password);
	User getUserById(Integer userId);
	User getUserByEmail(String email);
	User updateUserProfile(Integer userId, User updatedUser);
	boolean deactivateUser(Integer userId);
	boolean activateUser(Integer userId);
	boolean deleteUser(Integer userId);
	boolean changePassword(Integer userId , String oldPass , String newPass);
	List<User> getAllUsers();
	

}

//•	registerUser
//•	loginUser
//•	getUserById
//•	getUserByEmail
//•	updateUserProfile
//•	deactivateUser
