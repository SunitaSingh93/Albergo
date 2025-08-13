package com.hotel.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class ReviewRespDto {

	private int rating;
	private String comment;
	private LocalDate reviewDate;
	private Long userId;;
	private String userName;
}
