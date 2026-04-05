package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.FoodItem;

public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {
	List<FoodItem> findByFoodCategory_FoodCategoryId(Integer foodcatId);
}
