package com.resort.solution.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "food_order_item")
public class FoodOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_order_item_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "food_order_id", nullable = false)
    @JsonBackReference
    private FoodOrder foodOrder;

    @ManyToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false)
    private double price; // Price at the time of order
}


//package com.resort.solution.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Getter
//@NoArgsConstructor
//@Entity
//@Table(name = "food_order_item")
//public class FoodOrderItem {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "food_order_item_id")
//    private Integer foodOrderItemId;
//
//    @Setter
//    @ManyToOne
//    @JoinColumn(name = "food_order_id", nullable = false)
//    private FoodOrder foodOrder;
//
//    @Setter
//    @ManyToOne
//    @JoinColumn(name = "food_item_id", nullable = false)
//    private FoodItem foodItem;
//
//    @Setter
//    @Column(name = "quantity", nullable = false)
//    private int quantity;
//
//    @Setter
//    @Column(name = "price", nullable = false)
//    private double price; // price * quantity
//}
