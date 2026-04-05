package com.resort.solution.entity;

import com.resort.solution.enums.FoodCategoryName;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="food_category")
public class FoodCategory {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="food_category_id")
	private Integer foodCategoryId;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="category_name" , nullable = false)
	private FoodCategoryName categoryName;

}


//foodCategoryId (PK) → Primary key uniquely identifying each food category
//
//categoryName → Name of the food category (e.g., Starters, Main Course, Desserts)