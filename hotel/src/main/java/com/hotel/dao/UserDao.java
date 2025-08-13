package com.hotel.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Role;
import com.hotel.entities.User;


public interface UserDao extends JpaRepository<User, Long> {
	
	boolean existsByEmail(String email);

	List<User> findByRole(Role role);
	
	Optional<User> findByEmail(String email);

}