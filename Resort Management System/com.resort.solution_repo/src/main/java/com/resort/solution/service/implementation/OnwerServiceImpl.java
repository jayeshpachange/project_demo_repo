package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Owner;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.User;
import com.resort.solution.enums.OwnerStatus;
import com.resort.solution.enums.Role;
import com.resort.solution.repository.OwnerRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.service.OwnerService;

@Service
public class OnwerServiceImpl implements OwnerService {
	
	@Autowired
	private OwnerRepository ownerRepo;
	
	@Autowired
	private ResortRepository resortRepo;

	@Override
	public Owner registerOwner(Owner owner) {
		if(owner == null || owner.getEmail() == null || owner.getPassword() == null) {
			return null;
		}
		owner.setRole(Role.OWNER);
		owner.setStatus(OwnerStatus.ACTIVE);
		return ownerRepo.save(owner);
	}
 
	
	@Override
	public Owner loginOwner(String email, String password) {
		Owner owner = ownerRepo.findByEmail(email).orElse(null);
		if(owner==null) {
			return null;
		}
		if(!owner.getPassword().equals(password)) {
			return null;
		}
		ownerRepo.save(owner);
		return owner;
	}
	
	

	@Override
	public Owner getOwnerById(Integer ownerId) {
		return ownerRepo.findById(ownerId).orElseThrow(()-> new RuntimeException("No such ownerId"));
	}

	@Override
	public Owner getOwnerByEmail(String email) {
		return ownerRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("No such owner Email"));
		
	}

	@Override
	public Owner updateOwner(Integer ownerId, Owner owner) {
		Owner currentOwner = ownerRepo.findById(ownerId).orElse(null);
		if(currentOwner == null) {
			return null;
		}
		
		if (owner.getFullName() != null) {
			currentOwner.setFullName(owner.getFullName());
		}
		
		if(owner.getPhone() != null) {
			currentOwner.setPhone(owner.getPhone());
		}
		 
		if(owner.getEmail() != null) {
			currentOwner.setEmail(owner.getEmail());
		}
		if(owner.getPassword() != null) {
			currentOwner.setPassword(owner.getPassword());
		}		
		return ownerRepo.save(currentOwner);
	}

	
	@Override
	public boolean deactivateOwner(Integer ownerId) {
		if(ownerId == null) {
			throw new RuntimeException("Owner Id is null...");
		}
		Owner owner = ownerRepo.findById(ownerId).orElseThrow( () -> new RuntimeException("Invalid owner id..."));
		owner.setStatus(OwnerStatus.INACTIVE);
		ownerRepo.save(owner);
		return true;
	}

	@Override
	public boolean activateOwner(Integer ownerId) {
		if(ownerId == null) {
			throw new RuntimeException("Owner Id is null...");
		}
		Owner owner = ownerRepo.findById(ownerId).orElseThrow( () -> new RuntimeException("Invalid owner id..."));
		owner.setStatus(OwnerStatus.ACTIVE);
		ownerRepo.save(owner);
		return true;
	}

	@Override
	public boolean deleteOwner(Integer ownerId) {
		if(ownerId == null) {
			throw new RuntimeException("Owner Id is null...");
		}
		Owner owner = ownerRepo.findById(ownerId).orElseThrow( () -> new RuntimeException("Invalid owner id..."));
		if(owner == null) {
			return false;
		}
		ownerRepo.deleteById(ownerId);
		return true;
	}


	@Override
	public List<Resort> getResortsByOwnerId(Integer ownerId) {
		if(ownerId == null) {
			throw new RuntimeException("Owner Id is null...");
		}
		Owner owner = ownerRepo.findById(ownerId).orElseThrow( () -> new RuntimeException("Invalid owner id..."));
		List<Resort> resorts = resortRepo.findByOwner_OwnerId(owner.getOwnerId());
		return resorts;
	}


	@Override
	public boolean changePassword(Integer ownerId, String oldPassword, String newPassword) {
		Owner owner = ownerRepo.findById(ownerId).orElseThrow(() -> new RuntimeException("No such owner "));
		if(!oldPassword.equals(owner.getPassword())) {
			return false;
		}else {
			owner.setPassword(newPassword);
			ownerRepo.save(owner);
			return true;
		} 
	}
	
	
	
	

}
