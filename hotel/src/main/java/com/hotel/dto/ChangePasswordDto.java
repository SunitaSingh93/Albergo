package com.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChangePasswordDto {

	@NotBlank
	private String email;
	@NotBlank
	private String oldPassword;
	@NotBlank
	private String newPassword;
	
}
