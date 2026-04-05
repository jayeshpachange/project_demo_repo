package com.resort.solution.entity;

import com.resort.solution.enums.RoomTypeEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="room_type")
public class RoomType {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="room_type_id")
	private Integer roomTypeId;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="type_name" , nullable = false)
	private RoomTypeEnum typeName;
	
	@Setter
	@Column(name="room_capacity" , nullable = false)
	private Integer capacity;

}


//roomTypeId (PK)
//typeName →Standard, Premium, Deluxe, Suite
//capacity