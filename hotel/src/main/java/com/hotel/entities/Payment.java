package com.hotel.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name = "payments")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = "booking")
@EqualsAndHashCode(of = "paymentId", callSuper = false)
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long paymentId;
	
	@Column(nullable = false)
	private double amount;
	
	@Column(nullable = false)
	private LocalDateTime paymentDate = LocalDateTime.now();
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Method method;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
	
	@OneToOne
	@JoinColumn(name = "booking_id")
	private Booking  booking;
	
}
