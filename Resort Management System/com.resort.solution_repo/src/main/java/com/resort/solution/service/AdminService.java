package com.resort.solution.service;

import com.resort.solution.entity.Admin;

public interface AdminService {
	Admin loginAdmin(String email, String password);
	Admin getAdminById(Integer adminId);
	Admin updateAdminProfile(Integer adminId , Admin admin);
	Admin registerAdmin(Admin admin);
	boolean deleteAdmin(Integer adminId);

}
//•	loginAdmin
//•	getAdminById
//•	updateAdminProfile
