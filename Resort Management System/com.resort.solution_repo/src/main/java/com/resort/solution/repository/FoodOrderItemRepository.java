package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.FoodOrderItem;

public interface FoodOrderItemRepository extends JpaRepository<FoodOrderItem, Integer> {
}
