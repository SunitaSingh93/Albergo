package com.hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dto.BookingReqDto;
import com.hotel.dto.BookingRespDto;
import com.hotel.dto.CustomerReqDto;
import com.hotel.dto.PaymentReqDto;
import com.hotel.service.ReceptionistService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/receptionist")
@AllArgsConstructor
@Validated
public class RecptionistController {
	
	private final ReceptionistService receptionistService;
	
	@PostMapping("/guest/register")
	public ResponseEntity<?> addCustomer(@RequestBody CustomerReqDto custDto)
	{
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(receptionistService.registerCustomer(custDto));
	}
	
	@GetMapping("/guest/{custid}")
	public ResponseEntity<?>getCustById(@PathVariable("custid") Long custid)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(receptionistService.getCustomerById(custid));
	}
	
	@GetMapping("/guests")
	public ResponseEntity<?>getAllCustomers()
	{
		return ResponseEntity
				.ok(receptionistService.getAllCustomer());
	}
	
	@GetMapping("/guest/email/{email}")
	public ResponseEntity<?>getCustomerByEmail(@PathVariable("email") String email)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(receptionistService.getCustomerByEmail(email));
	}
	
	@PostMapping("/guest/bookings")
	public ResponseEntity<?> makeBooking(@Valid @RequestBody BookingReqDto dto){
		return ResponseEntity.ok(receptionistService.createBooking(dto));
	}
	
	//MAKE PAYMENT
	@PostMapping("/guest/{bookingId}/payment")
    public ResponseEntity<?> makePayment(
            @PathVariable("bookingId") Long bookingId,
            @Valid @RequestBody PaymentReqDto paymentDto) {
        BookingRespDto resp = receptionistService.makePayment(bookingId, paymentDto);
        return ResponseEntity.ok(resp);
    }
	
	//GET ALL BOOKINGS BY USERID
	@GetMapping("/guest/bookings/users/{userId}")
    public ResponseEntity<List<BookingRespDto>> getBookingsByUserId(@PathVariable("userId") Long userId) {
        List<BookingRespDto> resp = receptionistService.getBookingsByUserId(userId);
        return ResponseEntity.ok(resp);
    }
	
	//GET BOOKINGS BY BOOKINGID
		@GetMapping("/guest/bookings/{bookingId}")
	    public ResponseEntity<?> getBookingsByBookingId(@PathVariable("bookingId") Long bookingId) {
	        return ResponseEntity.status(HttpStatus.OK)
	        		.body(receptionistService.getBookingById(bookingId));
	    }

	//DELETE BY USERID
	@PutMapping("/guest/bookings/cancel/{userId}/{bookingId}")
	public ResponseEntity<?> cancelBookingsByUserId(@PathVariable("userId") Long userId, @PathVariable("bookingId") Long bookingId) {
	    return ResponseEntity.status(HttpStatus.OK)
	    		.body(receptionistService.cancelBooking(userId,  bookingId));
	}
	
	@GetMapping("/guest/bookings/update-status")
	public ResponseEntity<String> manuallyUpdateBookings() {
	    receptionistService.updateCompletedBookingsAndRooms();
	    return ResponseEntity.ok("Bookings updated");
	}


}
