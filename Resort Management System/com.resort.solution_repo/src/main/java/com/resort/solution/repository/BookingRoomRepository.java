package com.resort.solution.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.resort.solution.entity.BookingRoom;

public interface BookingRoomRepository extends JpaRepository<BookingRoom, Integer> {
	List<BookingRoom> findByBooking_BookingId(Integer bookingId);
	
	@Query("""
		    SELECT COUNT(br) > 0
		    FROM BookingRoom br
		    WHERE br.room.roomId = :roomId
		    AND br.booking.bookingStatus IN ('PENDING','CONFIRMED')
		    AND br.booking.checkInDate < :checkOut
		    AND br.booking.checkOutDate > :checkIn
		""")
		boolean existsRoomBookedBetweenDates(Integer roomId,LocalDate checkIn, LocalDate checkOut);


}
