package com.hotel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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

import com.hotel.dto.RoomReqDto;
import com.hotel.entities.Room;
import com.hotel.service.CustomerService;
import com.hotel.service.ManagerService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/manager")
@AllArgsConstructor
@Validated
public class ManagerController {
	
	private final ManagerService managerService;
	
	
	@PostMapping("/room")
	public ResponseEntity<?> addRoom(@RequestBody RoomReqDto roomDto)
	{
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(managerService.addRooms(roomDto));
	}
	
	@GetMapping("/rooms")
	public ResponseEntity<?> getAllRooms()
	{
		return ResponseEntity
				.ok(managerService.getAllRooms());
	}
	
	@GetMapping("/rooms/id/{roomId}")
	public ResponseEntity<?> getRoomById(@PathVariable("roomId") Long roomId)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.getRoomById(roomId));
	}
	
	@GetMapping("/rooms/no/{no}")
	public ResponseEntity<?> getRoomByRoomNumber(@PathVariable("no") String no)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.getRoomByRoomNumber(no));
	}

	@GetMapping("/rooms/category/{category}")
	public ResponseEntity<?> getRoomByCategory(@PathVariable("category") String category)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.getRoomByCategory(category));
	}
	
	@PutMapping("/rooms/{roomId}")
	public ResponseEntity<?> updateRoom(@PathVariable("roomId") Long roomId, @RequestBody Room room)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.updateRoom(roomId, room));
	}
	
	@PutMapping("/rooms/no/{no}")
	public ResponseEntity<?> updateByRoomNo(@PathVariable("no") String no, @RequestBody Room room)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.updateRoomByRoomNumber(no, room));
	}
	
	@DeleteMapping("/rooms/{roomId}")
	public ResponseEntity<?> deleteRoom(@PathVariable("roomId") Long roomid)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.deleteRoom(roomid));
		
	}
	
	@DeleteMapping("/rooms/no/{roomNo}")
	public ResponseEntity<?> deleteByRoomNo(@PathVariable("roomNo") Long roomNo)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.deleteRoom(roomNo));
		
	}
	
	//GET REVIEW BY USERID
	@GetMapping("/{userId}/reviews")
	public ResponseEntity<?> getReviewByUserId(@PathVariable("userId") Long userId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.getReviewById(userId));
	}
			
	@GetMapping("/all/reviews")
	public ResponseEntity<?> getAllReviews()
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.getAllReviews());
	}
		
	
}
