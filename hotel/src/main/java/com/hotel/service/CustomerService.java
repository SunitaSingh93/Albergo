package com.hotel.service;
import java.util.List;

import com.hotel.dto.AddBookingRespDto;
import com.hotel.dto.ApiResponse;
import com.hotel.dto.BookingReqDto;
import com.hotel.dto.BookingRespDto;
import com.hotel.dto.ChangePasswordDto;
import com.hotel.dto.LoginReqDto;
import com.hotel.dto.PaymentReqDto;
import com.hotel.dto.ReviewReqDto;
import com.hotel.dto.ReviewRespDto;
import com.hotel.dto.RoomRespDto;
import com.hotel.dto.UpdateUserDto;
import com.hotel.dto.UserReqDto;
import com.hotel.dto.UserRespDto;


public interface CustomerService {
	
	UserRespDto registerUser(UserReqDto dto);
	
	UserRespDto loginUser(LoginReqDto loginDto);
	
	ApiResponse changePassword(ChangePasswordDto dto);
	
	UserRespDto getUserById(Long id);
	
	UserRespDto updateUserDetails(Long id,UpdateUserDto dto);
	
	ApiResponse deleteUser(Long id);
	
	ReviewRespDto giveReview(ReviewReqDto dto, Long userId);
	
	ReviewRespDto updateReview(Long reviewId, ReviewReqDto dto);
	
	List<ReviewRespDto> getReviewById(Long reviewId);
	
	List<ReviewRespDto> getAllReviews();
	
	ApiResponse deleteReview(Long reviewId);
	
	//------------BOOKING--------------
	
	AddBookingRespDto createBooking(BookingReqDto dto);
	
	BookingRespDto makePayment(Long bookingId, PaymentReqDto paymentDto);
	
	List<BookingRespDto> getBookingsByUserId(Long userId);
	
	ApiResponse cancelBooking(Long userId, Long bookingId);
	
	BookingRespDto getBookingById(Long bookingId);
	
	void updateCompletedBookingsAndRooms();
	
	List<RoomRespDto> getAllRooms();
	
	RoomRespDto getRoomById(Long id);
}

