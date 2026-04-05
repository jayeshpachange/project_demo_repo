package com.resort.solution.service;

import java.util.List;
import com.resort.solution.entity.FoodOrder;

public interface FoodOrderService {
    FoodOrder createFoodOrder(Integer bookingId);
    FoodOrder addFoodItem(Integer orderId, Integer foodItemId, int quantity);
    FoodOrder getFoodOrder(Integer orderId);
    List<FoodOrder> getFoodOrdersByBooking(Integer bookingId);
    List<FoodOrder> getAllFoodOrder();
}
