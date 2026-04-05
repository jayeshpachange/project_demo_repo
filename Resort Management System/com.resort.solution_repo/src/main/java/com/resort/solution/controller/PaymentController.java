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


////•	initiate payment
////•	confirm/fail payment
////•	payment history