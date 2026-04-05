package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.ResortImage;

public interface ResortImageRepository extends JpaRepository<ResortImage, Integer> {
	List<ResortImage> findByResort_ResortId(Integer resortId);
}
