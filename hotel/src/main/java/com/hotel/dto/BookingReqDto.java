package com.hotel.dto;

import java.time.LocalDate;

import com.hotel.entities.BookingStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class BookingReqDto {

	@NotNull(message = "Please enter user ID")
	private Long userId;
	
	@NotNull(message = "Please enter room ID")
	private Long roomId;
	
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	private String bookingStatus;
}
