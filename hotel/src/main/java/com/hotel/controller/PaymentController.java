package com.hotel.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dto.BookingReqDto;
import com.hotel.dto.BookingRespDto;
import com.hotel.dto.PaymentReqDto;
import com.hotel.service.CustomerService;
import com.hotel.service.PaymentServiceImpl;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/payment")
@AllArgsConstructor
public class PaymentController {

	
	private PaymentServiceImpl razorpayService;

	private CustomerService userService;
	
	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody BookingReqDto dto) {
		return ResponseEntity.ok(razorpayService.processRazorpayOrder(dto));
	}
	
	@PostMapping("/make-payment/{bookingId}")
    public ResponseEntity<BookingRespDto> makePaymentForBooking(
            @PathVariable Long bookingId,
            @RequestBody PaymentReqDto paymentDto) {

        BookingRespDto bookingResp = userService.makePayment(bookingId, paymentDto);
        return ResponseEntity.ok(bookingResp);
    }
    
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> paymentData) {
        String orderId = paymentData.get("orderId");
        String paymentId = paymentData.get("paymentId");
        String signature = paymentData.get("signature");
        
        Map<String, Object> result = razorpayService.verifyDummyPayment(orderId, paymentId, signature);
        return ResponseEntity.ok(result);
    }
}
