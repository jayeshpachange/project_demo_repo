package com.resort.solution.dto;

import java.util.List;

import com.resort.solution.enums.FoodOrderStatus;

public class FoodOrderDTO {
	
	
    private Integer id;
    private FoodOrderStatus status;
    public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public FoodOrderStatus getStatus() {
		return status;
	}
	public void setStatus(FoodOrderStatus status) {
		this.status = status;
	}
	public List<FoodItemDTO> getItems() {
		return items;
	}
	public void setItems(List<FoodItemDTO> items) {
		this.items = items;
	}
	private List<FoodItemDTO> items;
}


