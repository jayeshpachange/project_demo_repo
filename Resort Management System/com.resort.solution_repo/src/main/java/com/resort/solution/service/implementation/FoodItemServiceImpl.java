package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.FoodItem;
import com.resort.solution.repository.FoodItemRepository;
import com.resort.solution.service.FoodItemService;

@Service
public class FoodItemServiceImpl implements FoodItemService {
	
	@Autowired
	private FoodItemRepository foodItemRepo;

	@Override
	public FoodItem addFoodItem(FoodItem foodItem) {
		if(foodItem == null || foodItem.getName() == null) {
			return null;
		}
		return foodItemRepo.save(foodItem);
	}

	@Override
	public FoodItem updateFoodItem(Integer foodItemId, FoodItem foodItem) {
		FoodItem foodIt = foodItemRepo.findById(foodItemId).orElse(null);
		if(foodIt == null) {
			return null;
		}
		if(!foodIt.getName().equals(foodItem.getName())) {
			foodIt.setName(foodItem.getName());
		}
		if(!foodIt.getFoodCategory().equals(foodItem.getFoodCategory())) {
			foodIt.setFoodCategory(foodItem.getFoodCategory());
		}
		if(foodIt.getPrice() != foodItem.getPrice()) {
			foodIt.setPrice(foodItem.getPrice());
		}
		return foodItemRepo.save(foodIt);
	}

	@Override
	public boolean deleteFoodItem(Integer foodItemId) {
		Optional<FoodItem> foodIt = foodItemRepo.findById(foodItemId);
		if(foodIt.isEmpty()) {
			return false;
		}
		foodItemRepo.deleteById(foodItemId);
		return true;
	}

	@Override
	public List<FoodItem> getFoodItemsByCategory(Integer foodCategoryId) {
		List<FoodItem> foodIt = foodItemRepo.findByFoodCategory_FoodCategoryId(foodCategoryId);
		return foodIt;
	}

}
