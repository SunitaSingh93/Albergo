package com.hotel.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "bookings")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true,exclude = {"room","user","payment"})
@EqualsAndHashCode(of = "bookingId", callSuper = false)
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;
	
	@ManyToOne()
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "room_id")
	private Room room;
	
	
	private LocalDate bookingDate = LocalDate.now();
	
	@Column(nullable = false)
	private LocalDate checkInDate;
	
	@Column(nullable = false)
	private LocalDate checkOutDate;
	
	@OneToOne(mappedBy = "booking", orphanRemoval = true, fetch = FetchType.LAZY)
	private Payment payment;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BookingStatus bookingStatus;
	
	
}
