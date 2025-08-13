package com.hotel.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {

	private LocalDateTime timestamp;
	private String message;
	public ApiResponse(String message) {
		this.timestamp = LocalDateTime.now();
		this.message = message;
	}
	
}
