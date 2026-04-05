package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.Service;

public interface ServiceRepository extends JpaRepository<Service, Integer> {

}
