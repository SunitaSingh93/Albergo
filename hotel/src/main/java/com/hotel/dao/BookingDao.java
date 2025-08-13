package com.hotel.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Booking;
import com.hotel.entities.BookingStatus;

public interface BookingDao extends JpaRepository<Booking, Long> {

	List<Booking> findByUserUserId(Long userId);
	
	List<Booking> findByBookingStatusNotAndCheckOutDateBefore(BookingStatus status, LocalDate date);
}
