package com.hotel.entities;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "reviews")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = "user")
@EqualsAndHashCode(of = "reviewId", callSuper = false)
public class Review {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reviewId;
	
	private int rating;
	
	private String comment;
	
	private LocalDate date = LocalDate.now();
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

}
