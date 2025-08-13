package com.hotel.dto;

import com.hotel.entities.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class PaymentReqDto {

	
	@NotNull(message = "Please enter amount")
	private double amount;
	private String method;
	private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
}
