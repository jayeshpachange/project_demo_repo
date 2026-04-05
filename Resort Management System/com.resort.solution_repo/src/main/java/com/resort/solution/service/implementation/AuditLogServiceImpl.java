package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Admin;
import com.resort.solution.entity.AuditLog;
import com.resort.solution.repository.AdminRepository;
import com.resort.solution.repository.AuditLogRepository;
import com.resort.solution.service.AuditLogService;

@Service
public class AuditLogServiceImpl implements AuditLogService {
	
	@Autowired
	private AuditLogRepository auditLogRepo;
	
	@Autowired 
	private AdminRepository adminRepo;

	@Override
	public void logAdminAction(Integer adminId, String action, String entityName) {
		Admin admin = adminRepo.findById(adminId).orElse(null);
		if(admin==null) {
			return;
		}
		AuditLog auditLog = new AuditLog();
        auditLog.setAdmin(admin);
        auditLog.setAction(action);
        auditLog.setEntityName(entityName);

        auditLogRepo.save(auditLog);
	}

	@Override
	public List<AuditLog> getAuditLogs() {
		List<AuditLog> auditLogs = auditLogRepo.findAll();
		return auditLogs;
	}

	@Override
	public List<AuditLog> getAuditLogsByAdmin(Integer adminId) {
		List<AuditLog> auditLogs = auditLogRepo.findByAdmin_AdminId(adminId);
		if(auditLogs==null) {
			return null;
		}
		return auditLogs;
	}

}
