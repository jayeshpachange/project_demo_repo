package com.resort.solution.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.resort.solution.enums.Role;
import com.resort.solution.enums.UserStatus;

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
@Table(name="users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_id")
	private Integer userId;
	
	@Setter
	@Column(name="full_name" , nullable = false)
	private String fullName;
	
	@Setter
	@Column(name="email" , nullable = false , unique = true)
	private String email;
	
	@Setter
	@Column(name="phone" , nullable = false)
	private String phone;
	
	@Setter
	@Column(name="password", nullable = false)
	private String password;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name = "role")
	private Role role;

	
	@Setter
    @Enumerated(EnumType.STRING)
	@Column(name="active_status")
	private UserStatus status;

    @CreationTimestamp
	@Column(name="account_createdAT" , updatable = false)
	private LocalDateTime createdAt;
}
//•	userId (PK)
//•	fullName
//•	email
//•	password
//•	phone
//•	status
//•	createdAt
