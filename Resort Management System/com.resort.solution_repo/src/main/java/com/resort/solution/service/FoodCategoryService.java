package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.FoodCategory;

public interface FoodCategoryService {
    FoodCategory addFoodCategory(FoodCategory foodCategory);
    FoodCategory updateFoodCategory(Integer foodCategoryId, FoodCategory foodCategory);
    List<FoodCategory> getAllFoodCategories();
}


//•	addFoodCategory
//•	updateFoodCategory
//•	getAllFoodCategories
