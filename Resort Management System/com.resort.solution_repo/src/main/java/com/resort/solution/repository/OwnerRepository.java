package com.resort.solution.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Integer> {
	Optional<Owner> findByEmail(String email);
}
 