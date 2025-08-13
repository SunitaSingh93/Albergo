package com.hotel.dto;

import java.time.LocalDateTime;

import com.hotel.entities.Method;
import com.hotel.entities.PaymentStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class PaymentRespDto {

	private Long paymentId;
    private double amount;
    private LocalDateTime paymentDate;
    private PaymentStatus paymentStatus;
    private Method method;

    private Long bookingId;

}
