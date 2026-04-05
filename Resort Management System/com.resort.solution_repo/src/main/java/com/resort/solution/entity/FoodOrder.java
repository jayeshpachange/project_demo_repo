package com.resort.solution.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.resort.solution.enums.FoodOrderStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "food_order")
public class FoodOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_order_id")
    private Integer foodOrderId;

    @Setter
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private FoodOrderStatus orderStatus;

    @Setter
    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    @CreationTimestamp
    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt;

    // NEW: Use FoodOrderItem to track items + quantity
    @OneToMany(mappedBy = "foodOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<FoodOrderItem> items;
}


//package com.resort.solution.entity;
//
//import java.time.LocalDateTime;
//import java.util.List;
//

//import org.hibernate.annotations.CreationTimestamp;
//
//import com.resort.solution.enums.FoodOrderStatus;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;

//
//
//@NoArgsConstructor
//@Getter
//@Entity
//@Table(name = "food_order")
//public class FoodOrder {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "food_order_id")
//    private Integer foodOrderId;
//
//    @Setter
//    @ManyToOne
//    @JoinColumn(name = "booking_id", nullable = false)
//    private Booking booking;
//
//    @Setter
//    @Enumerated(EnumType.STRING)
//    @Column(name = "order_status", nullable = false)
//    private FoodOrderStatus orderStatus;
//
//    @Setter
//    @Column(name = "total_amount", nullable = false)
//    private double totalAmount;
//
//    @CreationTimestamp
//    @Column(name = "ordered_at", nullable = false)
//    private LocalDateTime orderedAt;
//
//    @OneToMany(mappedBy = "foodOrder", cascade = CascadeType.ALL)
//    private List<FoodItem> items;
//}
