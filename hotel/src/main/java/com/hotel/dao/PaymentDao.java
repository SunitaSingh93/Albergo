package com.hotel.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Payment;

public interface PaymentDao extends JpaRepository<Payment, Long> {

}
