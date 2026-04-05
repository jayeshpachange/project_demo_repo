package com.resort.solution.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resort.solution.entity.Service;
import com.resort.solution.service.ServicesService;

@RestController
@RequestMapping("/owner/service")
public class ServiceController {

	
	@Autowired
    private ServicesService servicesService;  


	@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PostMapping("/addService")
    public ResponseEntity<Service> addService(@RequestBody Service service) {
        Service saved = servicesService.addService(service);
        if (saved == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(saved);
    }

 
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PutMapping("/updateService/{id}")
    public ResponseEntity<Service> updateService(@PathVariable("id") Integer serviceId, @RequestBody Service service) {
        Service updated = servicesService.updateService(serviceId, service);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }


    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @DeleteMapping("/deleteService/{id}")
    public ResponseEntity<String> deleteService(@PathVariable("id") Integer serviceId) {
        boolean deleted = servicesService.deleteService(serviceId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Service deleted successfully");
    }


    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @GetMapping("/allService")
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = servicesService.getAllServices();
        return ResponseEntity.ok(services);
    }
	
}
