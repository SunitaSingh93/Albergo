package com.hotel.dto;

import com.hotel.entities.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class UserRespDto {
	private Long userId;
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String phone;
	private String gender;
	private String idCard;
	private Role role;
}