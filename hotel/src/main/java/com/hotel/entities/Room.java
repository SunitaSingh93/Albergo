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
@Table(name = "rooms")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = "booking")
@EqualsAndHashCode(of = "roomId",callSuper = false)
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long roomId;
	
	@Column(nullable = false,unique = true)
	private String roomNumber;
	
	@Column(nullable = false)
	private String occupancy;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Category category;
	
	@Column(nullable = false)
	private double price;
	
	@Column(length = 255)
	private String imagePath; 
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.AVAILABLE;
	
	@OneToMany(mappedBy = "room", orphanRemoval = true ,fetch = FetchType.LAZY)
	private List<Booking> booking = new ArrayList<>();
	
}
