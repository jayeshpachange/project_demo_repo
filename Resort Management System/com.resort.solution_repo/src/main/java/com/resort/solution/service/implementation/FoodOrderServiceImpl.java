package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.*;
import com.resort.solution.repository.*;
import com.resort.solution.service.BookingServiceInterface;
import com.resort.solution.service.FoodOrderService;
import com.resort.solution.enums.FoodOrderStatus;

@Service
public class FoodOrderServiceImpl implements FoodOrderService {

    @Autowired
    private FoodOrderRepository foodOrderRepo;

    @Autowired
    private FoodItemRepository foodItemRepo;

    @Autowired
    private FoodOrderItemRepository foodOrderItemRepo;

    @Autowired
    private BookingServiceInterface bookingService;

    @Override
    public FoodOrder createFoodOrder(Integer bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        FoodOrder order = new FoodOrder();
        order.setBooking(booking);
        order.setOrderStatus(FoodOrderStatus.PREPARING);
        order.setTotalAmount(0);
        return foodOrderRepo.save(order);
    }

    @Override
    public FoodOrder addFoodItem(Integer orderId, Integer foodItemId, int quantity) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        FoodItem foodItem = foodItemRepo.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("Food item not found"));

        FoodOrderItem orderItem = new FoodOrderItem();
        orderItem.setFoodOrder(order);
        orderItem.setFoodItem(foodItem);
        orderItem.setQuantity(quantity);
        orderItem.setPrice(foodItem.getPrice());

        order.getItems().add(orderItem);
        foodOrderItemRepo.save(orderItem);

        double total = order.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalAmount(total);

        return foodOrderRepo.save(order);
    }

    @Override
    public FoodOrder getFoodOrder(Integer orderId) {
        return foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Food order not found"));
    }

    @Override
    public List<FoodOrder> getFoodOrdersByBooking(Integer bookingId) {
        return foodOrderRepo.findByBookingBookingId(bookingId);
    }
    
    
    @Override
    public List<FoodOrder> getAllFoodOrder() {
        return foodOrderRepo.findAll();
    }
    
}
