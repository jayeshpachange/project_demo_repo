package com.resort.solution.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.resort.solution.enums.OwnerStatus;
import com.resort.solution.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Data
@Table(name="owner")
public class Owner {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="owner_id")
	private Integer ownerId;
	
	@Setter
	@Column(name="name" , nullable = false)
	private String fullName;
	
	@Setter
	@Column(name="phone" , nullable = false)
	private String phone;
	
	@Setter
	@Column(name="email", unique = true , nullable = false)
	private String email;
	
	@Setter
	@Getter
	@Column(name="password" , nullable = false)
	private String password;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name = "role")
	private Role role;
	
    @CreationTimestamp
	@Column(name="account_createdAT" , updatable = false)
	private LocalDateTime createdAt;
    
	@Setter
    @Enumerated(EnumType.STRING)
	@Column(name="active_status")
	private OwnerStatus status;

}



//ownerId (PK)
//fullName
//email (unique)
//password
//phone
//status (ACTIVE / INACTIVE)
//createdAt