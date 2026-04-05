package com.resort.solution.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.resort.solution.entity.*;
import com.resort.solution.enums.FoodOrderStatus;
import com.resort.solution.repository.FoodItemRepository;
import com.resort.solution.repository.FoodOrderRepository;
import com.resort.solution.service.*;

@RestController
@RequestMapping("/user/foodOrder")
public class FoodOrderController {

    /* -------------------- SERVICES -------------------- */

    @Autowired
    private FoodCategoryService foodCategoryService;

    @Autowired
    private FoodItemService foodItemService;

    @Autowired
    private FoodOrderService foodOrderService;
    
    @Autowired
    private FoodOrderRepository foodOrderRepository;
    
    @Autowired
    private FoodItemRepository foodItemRepo;
    
    @Autowired FoodOrderRepository foodOrderRepo;

    /* -------------------- FOOD CATEGORY APIs -------------------- */

    @PostMapping("/categories")
    public ResponseEntity<FoodCategory> addFoodCategory(@RequestBody FoodCategory category) {
        return ResponseEntity.ok(foodCategoryService.addFoodCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<FoodCategory> updateFoodCategory( @PathVariable Integer id,  @RequestBody FoodCategory category) {
        return ResponseEntity.ok(foodCategoryService.updateFoodCategory(id, category));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @GetMapping("/getAllCategories")
    public ResponseEntity<List<FoodCategory>> getAllFoodCategories() {
        return ResponseEntity.ok(foodCategoryService.getAllFoodCategories());
    }

    /* -------------------- FOOD ITEM (MENU) APIs -------------------- */
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PostMapping("/items")
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodItemService.addFoodItem(foodItem));
    }
    
    @GetMapping("/getAllFoodItems")
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepo.findAll();
    }
    @PutMapping("/items/{id}")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Integer id, @RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodItemService.updateFoodItem(id, foodItem));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<String> deleteFoodItem(@PathVariable Integer id) {
        return foodItemService.deleteFoodItem(id)
                ? ResponseEntity.ok("Food item deleted successfully")
                : ResponseEntity.badRequest().body("Food item not found");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<FoodItem>> getFoodItemsByCategory(
            @PathVariable Integer categoryId) {
        return ResponseEntity.ok(
                foodItemService.getFoodItemsByCategory(categoryId));
    }

    /* -------------------- FOOD ORDER APIs -------------------- */

    // Create a food order for a booking
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/orders/booking/{bookingId}")
    public ResponseEntity<FoodOrder> createFoodOrder( @PathVariable Integer bookingId) {
        return ResponseEntity.ok(foodOrderService.createFoodOrder(bookingId));
    }

    // Add food item to an order
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/orders/{orderId}/items/{foodItemId}")
    public ResponseEntity<FoodOrder> addFoodItemToOrder( @PathVariable Integer orderId, @PathVariable Integer foodItemId, @RequestParam int quantity) {
        return ResponseEntity.ok(foodOrderService.addFoodItem(orderId, foodItemId, quantity));
    }

    // View single food order
    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<FoodOrder> getFoodOrder( @PathVariable Integer orderId) {
        return ResponseEntity.ok( foodOrderService.getFoodOrder(orderId));
    }

    // Get all food orders for a booking
    @PreAuthorize("hasAnyRole('USER','ADMIN' ,'OWNER')")
    @GetMapping("/orders/booking/{bookingId}")
    public List<FoodOrder> getOrdersByBooking(@PathVariable Integer bookingId) {
        return foodOrderService.getFoodOrdersByBooking(bookingId);
    }
    
    
 // Get all food orders 
    @PreAuthorize("hasAnyRole('USER','ADMIN' ,'OWNER')")
    @GetMapping("/getAllFoodOrder")
    public List<FoodOrder> getAllFood() {
        return foodOrderService.getAllFoodOrder();
    }

    /* -------------------- ORDER STATUS APIs -------------------- */

    // Update food order status (kitchen/admin)
    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<FoodOrder> updateOrderStatus( @PathVariable Integer orderId, @RequestParam FoodOrderStatus status) {
        FoodOrder order = foodOrderService.getFoodOrder(orderId);
        order.setOrderStatus(status);
        foodOrderRepo.save(order);
        return ResponseEntity.ok(order);
    }

    // Cancel food order
    @PreAuthorize("hasAnyRole('USER','ADMIN' ,'OWNER')")
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<FoodOrder> cancelFoodOrder( @PathVariable Integer orderId) {
        FoodOrder order = foodOrderService.getFoodOrder(orderId);
        order.setOrderStatus(FoodOrderStatus.CANCELLED);
        foodOrderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    /* -------------------- BILLING APIs -------------------- */

    // Get food bill for one order
    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @GetMapping("/orders/{orderId}/bill")
    public ResponseEntity<Double> getFoodBill( @PathVariable Integer orderId) {

        FoodOrder order = foodOrderService.getFoodOrder(orderId);
        return ResponseEntity.ok(order.getTotalAmount());
    }

    // Get total food bill for a booking
    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @GetMapping("/booking/{bookingId}/food-bill")
    public ResponseEntity<Double> getTotalFoodBillByBooking( @PathVariable Integer bookingId) {
        double total = foodOrderService.getFoodOrdersByBooking(bookingId)
                .stream()
                .mapToDouble(FoodOrder::getTotalAmount)
                .sum();
        return ResponseEntity.ok(total);
    }
}
