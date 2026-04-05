package com.resort.solution.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="food_item")
public class FoodItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="food_item_id")
	private Integer foodItemId;
	
	@Setter
	@Column(name="name" , nullable = false)
	private String name;
	
	@Setter
	@Column(name="price" , nullable = false)
	private double price;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="food_category_id" , nullable = false)
	private FoodCategory foodCategory;

}


//foodItemId (PK) → Primary key uniquely identifying each food item
//
//name → Name of the food item
//
//price → Price of the food item
//
//categoryId (FK of FoodCategory.foodCategoryId) → Category to which the food item belongs