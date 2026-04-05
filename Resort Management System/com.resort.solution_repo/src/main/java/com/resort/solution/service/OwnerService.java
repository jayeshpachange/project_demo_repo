package com.resort.solution.service;


import java.util.List;

import com.resort.solution.entity.Owner;
import com.resort.solution.entity.Resort;

public interface OwnerService {
	
	Owner registerOwner(Owner owner);
	Owner loginOwner(String email, String password);
	Owner getOwnerById(Integer ownerId);
	Owner getOwnerByEmail(String email);
	Owner updateOwner(Integer ownerId , Owner owner);
	boolean deactivateOwner(Integer ownerId);
	boolean activateOwner(Integer ownerId);
	boolean deleteOwner(Integer ownerId);
	boolean changePassword(Integer ownerId , String oldPassword , String newPassword);
	List<Resort> getResortsByOwnerId(Integer ownerId);
}




//registerOwner
//loginOwner
//getOwnerById
//getOwnerByEmail
//updateProfile
//deactivateOwner