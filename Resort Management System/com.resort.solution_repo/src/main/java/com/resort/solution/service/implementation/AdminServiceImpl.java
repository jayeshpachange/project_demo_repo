package com.resort.solution.service.implementation;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Admin;
import com.resort.solution.enums.Role;
import com.resort.solution.repository.AdminRepository;
import com.resort.solution.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {
	
	@Autowired
	private AdminRepository adminRepo;

	@Override
	public Admin loginAdmin(String email, String password) {
		Admin admin = adminRepo.findByEmail(email).orElse(null);
		if(admin==null) {
			return null;
		}
		if(!admin.getPassword().equals(password)) {
			return null;
		}
		admin.setLastLogin(LocalDateTime.now());
		adminRepo.save(admin);
		return admin;
	}

	@Override
	public Admin getAdminById(Integer adminId) {
		return adminRepo.findById(adminId).orElse(null);
	}

	@Override
	public Admin updateAdminProfile(Integer adminId, Admin admin) {
		Admin currentAdmin = adminRepo.findById(adminId).orElse(null);
		if(currentAdmin == null) {
			return null;
		}
		currentAdmin.setName(admin.getName());
		currentAdmin.setEmail(admin.getEmail());
		if(admin.getPassword()!=null) {
			currentAdmin.setPassword(admin.getPassword());
		}
		return adminRepo.save(currentAdmin);
		
	}

	@Override
	public Admin registerAdmin(Admin admin) {
		if(admin == null || admin.getEmail() == null) {
			return null;
		}
		admin.setRole(Role.ADMIN);
		return adminRepo.save(admin);		
	}

	@Override
	public boolean deleteAdmin(Integer adminId) {
		Optional<Admin> admin = adminRepo.findById(adminId);
		if(admin.isEmpty()) {
			return false;
		}
		adminRepo.deleteById(adminId);
		return true;
	}

}
