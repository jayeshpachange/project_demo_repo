package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.FoodItem;

public interface FoodItemService {
    FoodItem addFoodItem(FoodItem foodItem);
    FoodItem updateFoodItem(Integer foodItemId, FoodItem foodItem);
    boolean deleteFoodItem(Integer foodItemId);
    List<FoodItem> getFoodItemsByCategory(Integer foodCategoryId);
}

//•	addFoodItem
//•	updateFoodItem
//•	deleteFoodItem
//•	getFoodItemsByCategory
