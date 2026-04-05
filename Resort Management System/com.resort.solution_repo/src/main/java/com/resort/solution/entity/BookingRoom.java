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
@Table(name="booking_room")
public class BookingRoom {
	
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name="booking_room_id")
	private Integer bookingRoomId;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="booking_id" , nullable = false)
	private Booking booking;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="room_id", nullable = false)
	private Room room; 
	
	
	@Setter
	@Column(name="price_per_night" , nullable = false)
	private double pricePerNight;

}


//bookingRoomId (PK) → Primary key uniquely identifying each booked room entry
//
//bookingId (FK of Booking.bookingId) → Booking to which the room belongs
//
//roomId (FK of Room.roomId) → Room that is booked
//
//pricePerNight → Price charged per night for the specific room


//This code defines a BookingRoom table that:
//
//Stores which room is booked in which booking
//
//Links one booking to one room
//
//Saves the price per night for that room at the time of booking
//
//Allows a single booking to contain multiple rooms (by having multiple records)
//
//In short:
//👉 It connects bookings and rooms and remembers the room price for that booking.