package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.resort.solution.entity.Service;
import com.resort.solution.repository.ServiceRepository;
import com.resort.solution.service.ServicesService;

@org.springframework.stereotype.Service
public class ServicesServiceImpl implements ServicesService {
	
	@Autowired
	private ServiceRepository serviceRepo;


	@Override
	public Service addService(Service service) {
		if (service == null || service.getServiceName() == null) {
			return null;
		}
		return serviceRepo.save(service);
	}

	@Override
	public Service updateService(Integer serviceId, Service service) {
		// TODO Auto-generated method stub
		Service existing = serviceRepo.findById(serviceId).orElse(null);
		if (existing == null || service == null) {
			return null;
		}

		if (service.getServiceName() != null) {
			existing.setServiceName(service.getServiceName());
		}
		if (service.getPrice() > 0) {
			existing.setPrice(service.getPrice());
		}
		if (service.getServiceType() != null) {
			existing.setServiceType(service.getServiceType());
		}

		return serviceRepo.save(existing);
	}

	@Override
	public boolean deleteService(Integer serviceId) {
		if (!serviceRepo.existsById(serviceId)) {
			return false;
		}
		serviceRepo.deleteById(serviceId);
		return true;
	}

	@Override
	public List<Service> getAllServices() {
		return serviceRepo.findAll();
	}

}
