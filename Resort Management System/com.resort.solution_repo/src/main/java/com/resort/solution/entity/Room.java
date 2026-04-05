package com.resort.solution.entity;

import com.resort.solution.enums.RoomStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name="room")
public class Room {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="room_id")
	private Integer roomId;
	
	@Setter
	@Column(name="room_number" , nullable = false)
	private Integer roomNumber;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="resort_id" , nullable = false)
	private Resort resort;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="room_type_id" , nullable = false)
	private RoomType roomType;
	
	@Setter
	@Column(name="base_price" , nullable = false)
	private Double basePrice = 700.00;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="availability_status" , nullable = false)
	private RoomStatus status;

}

//roomId (PK) → Primary key uniquely identifying each room
//
//roomNumber → Unique room number within a resort
//
//resortId (FK of Resort.resortId) → Resort to which the room belongs
//
//roomTypeId (FK of RoomType.roomTypeId) → Type/category of the room
//
//basePrice → Base price per night for the room
//
//status → Current state of the room (AVAILABLE, BOOKED, MAINTENANCE)