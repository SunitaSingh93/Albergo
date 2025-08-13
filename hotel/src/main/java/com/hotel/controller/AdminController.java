package com.hotel.controller;

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

import com.hotel.dto.UserReqDto;
import com.hotel.entities.User;
import com.hotel.service.AdminService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;



@RestController
@RequestMapping("/admin")
@AllArgsConstructor
@Validated
public class AdminController {
	
	private final AdminService adminService;
	
	
	//ADD USER (MANGER / RECEPTIONIST)
	@PostMapping("/user/register")
	public ResponseEntity<?>addUser(@RequestBody @Valid UserReqDto dto) 
	{
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(adminService.addUser(dto));
	}

	//GET ALL USERS
	@GetMapping("/users")
	public ResponseEntity<?>getAllUsers()
	{
		return ResponseEntity
				.ok(adminService.getAllUser());
	}
	
	//GET USER BY ID
	@GetMapping("/users/{userid}")
	public ResponseEntity<?>getUserById(@PathVariable("userid") Long userid)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getUserById(userid));
	}
	
	//GET USER BY EMAIL
	@GetMapping("/users/email/{email}")
	public ResponseEntity<?>getUserByEmail(@PathVariable("email") String email)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getUserByEmail(email));
	}
	
	//UPDATE USER DETAILS
	@PutMapping("/user/{userid}")
	public ResponseEntity<?>updateUserDetails(@PathVariable("userid") Long userid,@RequestBody User user)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.updateDetails(userid, user));
	}

	//DELETE USER
	@DeleteMapping("/user/{userid}")
	public ResponseEntity<?>deleteUser(@PathVariable("userid") Long userid)
	{
		return ResponseEntity
				.ok(adminService.deleteUser(userid));
	}
	
	//GET USER BY ROLE
	@GetMapping("/user/role/{role}")
	public ResponseEntity<?> getUserByRole(@PathVariable("role") String role) {
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getUserByRole(role));
	}
	
	
}
