package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.BookingService;

public interface BookingServiceRepository extends JpaRepository<BookingService, Integer> {
	List<BookingService> findByBooking_BookingId(Integer bookingId);
}
