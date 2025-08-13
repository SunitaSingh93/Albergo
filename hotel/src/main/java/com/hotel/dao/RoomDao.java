package com.hotel.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Category;
import com.hotel.entities.Room;


public interface RoomDao extends JpaRepository<Room, Long> {

	boolean existsByRoomNumber(String roomNo);
	
	List<Room> findByCategory(Category category);
	
	Optional<Room> findByRoomNumber(String roomNumber);
}
