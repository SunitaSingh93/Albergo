package com.hotel.dto;

import com.hotel.entities.Role;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CustomerRespDto {

	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	private String gender;
	private String idCard;
	private Role role;

}
