package com.hotel.dto;

import java.time.LocalDate;

import com.hotel.entities.BookingStatus;
import com.hotel.entities.Category;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class AddBookingRespDto {

	private Long bookingId;
	private Long roomId;
	private Category category;
	
	private Long userId;
	private String userName;
	
	private LocalDate bookingDate;
	private BookingStatus bookingStatus; 
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	
	
}
