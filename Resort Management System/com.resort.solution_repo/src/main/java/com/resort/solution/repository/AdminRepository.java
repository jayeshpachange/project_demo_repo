package com.resort.solution.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
//	Optional<Admin> findById(Integer id);
	Optional<Admin> findByEmail(String email);

}
