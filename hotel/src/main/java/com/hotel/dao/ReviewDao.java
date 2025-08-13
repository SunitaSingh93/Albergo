package com.hotel.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Review;
import com.hotel.entities.User;


public interface ReviewDao extends JpaRepository<Review, Long>{
	
	boolean existsByUser(User user);
	
	List<Review> findByUser(User user);

}
