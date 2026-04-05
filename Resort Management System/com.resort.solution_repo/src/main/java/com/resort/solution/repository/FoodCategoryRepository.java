package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.FoodCategory;

public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer> {

}
