package com.hotel.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Review;

public interface FeedbackDao extends JpaRepository<Review, Long>{

}
