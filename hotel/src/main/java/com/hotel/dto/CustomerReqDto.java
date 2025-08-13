package com.hotel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class CustomerReqDto {

	@NotBlank(message = "please enter first name")
	private String firstName;
	
	@NotBlank(message = "please enter last name")
	private String lastName;
	
	@Email
	@NotBlank(message = "please enter email")
	private String email;
	
	@NotBlank(message = "please enter your phone number")
	private String phone;
	
	@NotBlank(message = "gender cannot be blank")
	private String gender;
	
	private String idCard;

	private String role;
}
