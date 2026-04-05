package com.resort.solution.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
	List<AuditLog> findByAdmin_AdminId(Integer adminId);
}
