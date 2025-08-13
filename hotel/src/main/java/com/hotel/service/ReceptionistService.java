package com.hotel.service;

import java.util.List;

import com.hotel.dto.AddBookingRespDto;
import com.hotel.dto.ApiResponse;
import com.hotel.dto.BookingReqDto;
import com.hotel.dto.BookingRespDto;
import com.hotel.dto.CustomerReqDto;
import com.hotel.dto.CustomerRespDto;
import com.hotel.dto.LoginReqDto;
import com.hotel.dto.PaymentReqDto;
import com.hotel.dto.UserRespDto;

public interface ReceptionistService {
	
	UserRespDto loginUser(LoginReqDto loginDto);

	CustomerRespDto registerCustomer(CustomerReqDto reqDto);
	
	CustomerRespDto getCustomerById(Long id);
	
	List<CustomerRespDto> getAllCustomer();
	
	CustomerRespDto getCustomerByEmail(String email);
	
	AddBookingRespDto createBooking(BookingReqDto bookDto);
	
	BookingRespDto makePayment(Long bookingId, PaymentReqDto paymentDto);
	
	List<BookingRespDto> getBookingsByUserId(Long userId);
	
	ApiResponse cancelBooking(Long userId, Long bookingId);
	
	BookingRespDto getBookingById(Long bookingId);
	
	//void updateCompletedBookings();
	
	void updateCompletedBookingsAndRooms();
	
}
