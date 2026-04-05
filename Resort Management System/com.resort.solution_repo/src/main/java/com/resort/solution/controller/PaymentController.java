package com.resort.solution.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.resort.solution.entity.Payment;
import com.resort.solution.service.PaymentService;

@RestController
@RequestMapping("/user/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<?> startPayment(@PathVariable Integer bookingId,@RequestBody Payment payment) {
        try {
            Payment created = paymentService.initiatePayment(bookingId, payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{paymentId}/confirm")
    public ResponseEntity<?> confirmPayment(@PathVariable Integer paymentId) {
        try {
            paymentService.confirmPayment(paymentId);
            return ResponseEntity.ok(Map.of("message", "Payment successful"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{paymentId}/cancel")
    public ResponseEntity<?> cancelPayment(@PathVariable Integer paymentId) {
        try {
            paymentService.cancelPayment(paymentId);
            return ResponseEntity.ok(Map.of("message", "Payment cancelled"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN','OWNER')")
    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBooking(@PathVariable Integer bookingId) {
        return paymentService.getPaymentsByBooking(bookingId);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN', 'OWNER')")
    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUser(@PathVariable Integer userId) {
        return paymentService.getAllPaymentByUserId(userId);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN'  , 'OWNER')")
    @GetMapping("/getAllPayments")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }
}










//package com.resort.solution.controller;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.resort.solution.entity.Payment;
//import com.resort.solution.service.PaymentService;
//
//@RestController
//@RequestMapping("/payment")
//public class PaymentController {
//	
//	@Autowired
//	private PaymentService paymentServ;
//	
//	@PostMapping("/startPayment")
//	public Payment startPayment(@RequestBody Payment pay) {
//		return paymentServ.initiatePayment(pay);
//	}
//	
//	@PutMapping("/confirmPayment")
//	public ResponseEntity<?> confirmPayment(@RequestParam Integer paymentId) {
//		boolean confirmed =  paymentServ.confirmPayment(paymentId);
//		if(!confirmed) {
//			return ResponseEntity.ok(Map.of("message" , "Payment not comfirmed"));
//		}
//		return ResponseEntity.ok(Map.of("message" , "Booking confirmed"));
//	}
//	
//	@PutMapping("/cancelPayment")
//	public ResponseEntity<?> cancelPayment(@RequestParam Integer paymentId) {
//		boolean confirmed =  paymentServ.cancelPayment(paymentId);
//		if(!confirmed) {
//			return ResponseEntity.ok(Map.of("message" , "Payment not cancel"));
//		}
//		return ResponseEntity.ok(Map.of("message" , "Booking cancel"));
//	}
//	
//	@GetMapping("/getPaymentsByBooking")
//	public List<Payment> getPaymentByBaookingId(@RequestParam Integer bookingId) {
//		return paymentServ.getPaymentsByBooking(bookingId);
//	}
//	
//	@GetMapping("/getAllPay")
//	public List<Payment> getAllPayment(){
//		return paymentServ.getAllPayments();
//	}
//	
//	@GetMapping("/getByUser")
//	public List<Payment> getByUserId(@RequestParam Integer userId){
//		return paymentServ.getAllPaymentByUserId(userId);
//	}
//
//}
//
//
////•	initiate payment
////•	confirm/fail payment
////•	payment history