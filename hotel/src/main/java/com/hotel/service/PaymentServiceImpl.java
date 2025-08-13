package com.hotel.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hotel.custom_exception.ApiException;
import com.hotel.custom_exception.ResourceNotFoundException;
import com.hotel.dao.BookingDao;
import com.hotel.dao.RoomDao;
import com.hotel.dto.BookingReqDto;
import com.hotel.entities.Room;

@Service
public class PaymentServiceImpl {

	@Autowired
	private BookingDao bookingDao;
	
	// Dummy Razorpay credentials for testing
	@Value("${razorpay.key_id:rzp_test_dummy_key}")
	private String RAZORPAY_KEY;
	
	@Value("${razorpay.key_secret:dummy_secret}")
	private String RAZORPAY_SECRET;
	
	@Autowired
	private  RoomDao roomDao;
	
	
	public Map<String, Object> processRazorpayOrder(BookingReqDto dto) {
	    try {
	        Room room = roomDao.findById(dto.getRoomId())
	                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

	        double expectedAmount = room.getPrice();
	        expectedAmount = Math.round(expectedAmount * 100.0) / 100.0;

	        // Convert to paise (integer) for Razorpay
	        int amountInPaise = (int) Math.round(expectedAmount * 100);
	        
	        // Create dummy Razorpay order (no actual API call)
	        Map<String, Object> dummyOrder = createDummyRazorpayOrder(amountInPaise);

	        // Prepare response with dummy data
	        Map<String, Object> response = new HashMap<>();
	        response.put("orderId", dummyOrder.get("id"));
	        response.put("amount", dummyOrder.get("amount"));
	        response.put("currency", dummyOrder.get("currency"));
	        response.put("key", RAZORPAY_KEY);
	        response.put("roomId", dto.getRoomId());
	        response.put("roomPrice", expectedAmount);

	        return response;

	    } catch (Exception e) {
	        throw new ApiException("Failed to create dummy Razorpay order. Please try again.");
	    }
	}
	
	// Dummy method to simulate Razorpay order creation
	private Map<String, Object> createDummyRazorpayOrder(int amountInPaise) {
		Map<String, Object> dummyOrder = new HashMap<>();
		
		// Generate dummy order ID
		String orderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
		
		dummyOrder.put("id", orderId);
		dummyOrder.put("amount", amountInPaise);
		dummyOrder.put("currency", "INR");
		dummyOrder.put("receipt", "txn_" + System.currentTimeMillis());
		dummyOrder.put("status", "created");
		dummyOrder.put("created_at", System.currentTimeMillis() / 1000);
		
		return dummyOrder;
	}
	
	// Dummy method to verify payment (simulates success/failure)
	public Map<String, Object> verifyDummyPayment(String orderId, String paymentId, String signature) {
		Map<String, Object> result = new HashMap<>();
		
		// Simulate 90% success rate for demo purposes
		boolean isSuccess = Math.random() > 0.1;
		
		if (isSuccess) {
			result.put("status", "success");
			result.put("paymentId", paymentId != null ? paymentId : "pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14));
			result.put("orderId", orderId);
			result.put("signature", signature != null ? signature : "dummy_signature_" + System.currentTimeMillis());
			result.put("message", "Payment verified successfully");
		} else {
			result.put("status", "failed");
			result.put("message", "Payment verification failed");
			result.put("error", "Dummy payment failure for testing");
		}
		
		return result;
	}

}
