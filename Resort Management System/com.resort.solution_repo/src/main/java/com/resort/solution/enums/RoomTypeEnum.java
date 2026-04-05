package com.resort.solution.enums;

public enum RoomTypeEnum {
    SINGLE(1, 1.0),
    DOUBLE(2, 1.2),
    DELUXE(3, 1.5),
    SUITE(4, 2.0);

    private final int capacity;
    private final double priceMultiplier;

    RoomTypeEnum(int capacity, double priceMultiplier) {
        this.capacity = capacity;
        this.priceMultiplier = priceMultiplier;
    }

    public int getCapacity() {
        return capacity;
    }

    public double getPriceMultiplier() {
        return priceMultiplier;
    }
}


//package com.resort.solution.enums;
//
//public enum RoomTypeEnum {
//	STANDARD , PREMIUM , DELUXE , SUITE
//}

