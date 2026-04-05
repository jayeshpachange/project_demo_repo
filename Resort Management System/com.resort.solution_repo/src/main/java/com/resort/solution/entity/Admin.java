package com.resort.solution.entity;

import java.time.LocalDateTime;

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
@Table(name="admin")
public class Admin {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="admin_Id")
	private Integer adminId;
	
	@Setter
	@Column(name="name" , nullable = false)
	private String name;
	
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

	
	@Setter
	@Column(name="last_login")
	private LocalDateTime lastLogin;
	

}


//•	adminId (PK)
//•	name
//•	email
//•	password
//•	role (SUPER_ADMIN / STAFF)
//•	lastLogin
