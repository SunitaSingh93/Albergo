package com.hotel.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hotel.entities.BookingStatus;
import com.hotel.entities.PaymentStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class BookingRespDto {

	private Long bookingId;
	private LocalDate bookingDate;
	private BookingStatus status; 
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	
	private Long roomId;
	
	private Long userId;
	private String userName;
	
	private Long paymentId;
	private double amount;
	private PaymentStatus paymentStatus;
	private LocalDateTime paymentDate;
}

