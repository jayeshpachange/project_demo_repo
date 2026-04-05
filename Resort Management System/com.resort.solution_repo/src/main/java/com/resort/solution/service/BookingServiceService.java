package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.BookingService;

public interface BookingServiceService {
    boolean removeServiceFromBooking(Integer bookingServiceId);
    List<BookingService> getServicesByBooking(Integer bookingId);
    BookingService addServiceToBooking(Integer bookingId, BookingService bookingService);
    List<BookingService> getAllBookingServices();
}

//•	addServiceToBooking
//•	removeServiceFromBooking
//•	getServicesByBooking = > get service by bookingId.
