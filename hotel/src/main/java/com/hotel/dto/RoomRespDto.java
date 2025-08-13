package com.hotel.dto;

import com.hotel.entities.Category;
import com.hotel.entities.Status;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomRespDto {

	private Long roomId;
	
	private String roomNumber;
	
	private String occupancy;
	
	private Category category;
	
	private double price;
	
	private Status status ;
	
	private String imagePath;
}
