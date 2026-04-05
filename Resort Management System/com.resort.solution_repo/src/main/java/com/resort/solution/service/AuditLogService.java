package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.AuditLog;

public interface AuditLogService {
    void logAdminAction(Integer adminId, String action, String entityName);
    List<AuditLog> getAuditLogs();
    List<AuditLog> getAuditLogsByAdmin(Integer adminId);
}

//•	logAdminAction
//•	getAuditLogs
//•	getAuditLogsByAdmin
