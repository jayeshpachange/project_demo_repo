package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.resort.solution.entity.FoodOrder;

import java.util.List;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Integer> {
    List<FoodOrder> findByBookingBookingId(Integer bookingId);
}
