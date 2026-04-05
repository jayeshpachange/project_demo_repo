package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Service;

public interface ServicesService {
	Service addService(Service service);
	Service updateService(Integer serviceId , Service service);
	boolean deleteService(Integer serviceId);
	List<Service> getAllServices();
}

//•	addService
//•	updateService
//•	deleteService
//•	getAllServices
