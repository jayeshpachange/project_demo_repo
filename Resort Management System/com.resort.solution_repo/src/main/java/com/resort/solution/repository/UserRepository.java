package com.resort.solution.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	User findByEmailAndPassword(String email, String password);
	Optional<User> findByEmail(String email);
}

