package com.resort.solution.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name="audit_log")
public class AuditLog {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="log_Id")
	private Integer logId;
	
	@Setter
	@ManyToOne
	@JoinColumn(name="admin_Id")
	private Admin admin;
	
	@Setter
	@Column(name="action" , nullable = false)
	private String action;
	
	@Setter
	@Column(name="entity_name" , nullable=false)
	private String entityName;
	
	@Setter
	@CreationTimestamp
	@Column(name="time_stamps")
	private LocalDateTime timeStamps;
}


//logId (PK) → Primary key uniquely identifying each audit log entry
//
//adminId (FK of Admin.adminId) → Admin who performed the action
//
//action → Operation performed (CREATE, UPDATE, DELETE, LOGIN, APPROVE, etc.)
//
//entityName → Name of the entity on which the action was performed (Resort, Booking, User, etc.)
//
//timestamp → Date and time when the action was recorded


//Note = AuditLog maintains a complete audit trail of administrative actions to ensure accountability, security, and traceability