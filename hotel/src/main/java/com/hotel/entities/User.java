package com.hotel.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name="users")
@NoArgsConstructor
@Setter
@Getter
@ToString(callSuper = true, exclude = {"booking","reviews"})
@EqualsAndHashCode(of = "userId", callSuper = false)

public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;
	
	@Column(name = "first_name", length = 20, nullable = false)
	private String firstName;
	
	@Column(name = "last_name", length = 20, nullable = false)
	private String lastName;
	
	@Column(length = 100, unique = true, nullable = false)
	private String email;
	
	@Column(length = 200)
	private String password;
	
	@Column(length = 10, nullable = false)
	private String phone;
	
	@Column(length = 15, nullable = false)
	private String gender;
	
	@Column(name = "id_card", length = 12)
	private String idCard;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false)
	private Role role;
	
	@OneToMany(mappedBy = "user", orphanRemoval = true, fetch = FetchType.LAZY)
	private List<Booking> booking = new ArrayList<>();
	
	@OneToMany(mappedBy = "user", orphanRemoval = true, fetch = FetchType.LAZY)
	private List<Review> reviews = new ArrayList<>();
		

}