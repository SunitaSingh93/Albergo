package com.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {

	 private Long id;
	 private String token;
	 private String email;
	 private String name; 
	 private String role;
}
