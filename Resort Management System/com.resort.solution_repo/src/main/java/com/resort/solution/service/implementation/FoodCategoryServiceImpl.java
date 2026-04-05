package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.FoodCategory;
import com.resort.solution.repository.FoodCategoryRepository;
import com.resort.solution.service.FoodCategoryService;

@Service
public class FoodCategoryServiceImpl implements FoodCategoryService {

	@Autowired
	private FoodCategoryRepository foodCatRepo;
	
	@Override
	public FoodCategory addFoodCategory(FoodCategory foodCategory) {
		if(foodCategory == null || foodCategory.getCategoryName() == null) {
			return null;
		}
		return foodCatRepo.save(foodCategory);
	}

	@Override
	public FoodCategory updateFoodCategory(Integer foodCategoryId, FoodCategory foodCategory) {
		FoodCategory foodCat = foodCatRepo.findById(foodCategoryId).orElse(null);
		if(foodCat == null) {
			return null;
		}
		if(!foodCat.getCategoryName().equals(foodCategory.getCategoryName())) {
			foodCat.setCategoryName(foodCategory.getCategoryName());
		}
		return foodCatRepo.save(foodCat);
	}

	@Override
	public List<FoodCategory> getAllFoodCategories() {
		List<FoodCategory> foodCat = foodCatRepo.findAll();
		return foodCat;
	}

}
