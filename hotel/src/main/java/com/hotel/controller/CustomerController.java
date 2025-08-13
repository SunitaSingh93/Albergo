package com.hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dto.BookingReqDto;
import com.hotel.dto.BookingRespDto;
import com.hotel.dto.ChangePasswordDto;
import com.hotel.dto.LoginReqDto;
import com.hotel.dto.PaymentReqDto;
import com.hotel.dto.ReviewReqDto;
import com.hotel.dto.UpdateUserDto;
import com.hotel.dto.UserReqDto;
import com.hotel.service.CustomerService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
@Validated
public class CustomerController {
	
	private final CustomerService userService;
	
	//USER REGISTERATION
	@PostMapping("/register")
	public ResponseEntity<?> userRegisteration(@RequestBody @Valid UserReqDto dto){
		
			return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(dto));
		
	}
	
	//USER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginReqDto dto) {
		return ResponseEntity.ok(userService.loginUser(dto));
	}
	
	//CHANGE PASSWORD
		@PutMapping("/changePassword")
		public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto dto){
			return ResponseEntity.ok(userService.changePassword(dto));
		}
		
		//GET USER BY ID
		@GetMapping("/{userId}")
		public ResponseEntity<?> getUserById(@PathVariable("userId") Long userId){
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.getUserById(userId));
		}
		
		//UPDATE USER
		@PutMapping("/{userId}")
		public ResponseEntity<?> updateUser(@PathVariable("userId") Long userId, @RequestBody UpdateUserDto dto){
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.updateUserDetails(userId,dto));
		}
		
		
		//DELETE USER
		@DeleteMapping("/{id}")
		public ResponseEntity<?> deleteUser(@PathVariable("id") Long id){
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.deleteUser(id));
		}
		
		//-----------REVIEWS--------
		
		//ADD REVIEW
		@PostMapping("/reviews/{userId}")
		public ResponseEntity<?> giveReview(@RequestBody @Valid ReviewReqDto dto, 
				@PathVariable("userId") Long userId){
				return ResponseEntity.status(HttpStatus.CREATED)
						.body(userService.giveReview(dto, userId));
			
		}
		
		//UPDATE
		@PutMapping("/reviews/{reviewId}")
		public ResponseEntity<?> updateReview(@PathVariable("reviewId") Long reviewId, 
				@RequestBody ReviewReqDto dto){
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.updateReview(reviewId,dto));
		}
		
		
		//GET REVIEW BY USERID
		@GetMapping("/{userId}/reviews")
		public ResponseEntity<?> getReviewByUserId(@PathVariable("userId") Long userId){
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.getReviewById(userId));
		}
		
		
		//DELETE REVIEW
		@DeleteMapping("/reviews/{reviewId}")
		public ResponseEntity<?> deleteReview(@PathVariable("reviewId") Long reviewId){
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.deleteReview(reviewId));
		}
		
		
		//---------BOOKING-----------
		
		
		//MAKE BOOKING
		@PostMapping("/bookings")
		public ResponseEntity<?> makeBooking(@Valid @RequestBody BookingReqDto dto){
			return ResponseEntity.ok(userService.createBooking(dto));
		}
		
		//MAKE PAYMENT
		@PostMapping("/{bookingId}/payment")
	    public ResponseEntity<?> makePayment(
	            @PathVariable("bookingId") Long bookingId,
	            @Valid @RequestBody PaymentReqDto paymentDto) {
	        BookingRespDto resp = userService.makePayment(bookingId, paymentDto);
	        return ResponseEntity.ok(resp);
	    }
		
		//GET ALL BOOKINGS BY USERID
		@GetMapping("/bookings/users/{userId}")
	    public ResponseEntity<List<BookingRespDto>> getBookingsByUserId(@PathVariable("userId") Long userId) {
	        List<BookingRespDto> resp = userService.getBookingsByUserId(userId);
	        return ResponseEntity.ok(resp);
	    }
		
		//GET BOOKINGS BY BOOKINGID
			@GetMapping("/bookings/{bookingId}")
		    public ResponseEntity<?> getBookingsByBookingId(@PathVariable("bookingId") Long bookingId) {
		        return ResponseEntity.status(HttpStatus.OK)
		        		.body(userService.getBookingById(bookingId));
		    }

		//DELETE BY USERID
		@PutMapping("/bookings/cancel/{userId}/{bookingId}")
		public ResponseEntity<?> cancelBookingsByUserId(@PathVariable("userId") Long userId, @PathVariable("bookingId") Long bookingId) {
		    return ResponseEntity.status(HttpStatus.OK)
		    		.body(userService.cancelBooking(userId,bookingId));
		}
		
		@GetMapping("/bookings/update-status")
		public ResponseEntity<String> manuallyUpdateBookings() {
		    userService.updateCompletedBookingsAndRooms();
		    return ResponseEntity.ok("Bookings updated");
		}

		@GetMapping("/rooms")
		public ResponseEntity<?> getAllRooms()
		{
			return ResponseEntity
					.ok(userService.getAllRooms());
		}
		
		@GetMapping("/rooms/id/{roomId}")
		public ResponseEntity<?> getRoomById(@PathVariable("roomId") Long roomId)
		{
			return ResponseEntity.status(HttpStatus.OK)
					.body(userService.getRoomById(roomId));
		}
		
}