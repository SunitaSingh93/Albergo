package com.hotel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomReqDto {

    @NotBlank(message = "Please enter room number")
    private String roomNumber;

    @NotBlank(message = "Please enter occupacy")
    private String occupancy;

    @NotBlank(message = "Enter the category of the room")
    private String category; // keep as String, convert later

    @NotNull(message = "Enter the price of the room")
    @Min(value = 1, message = "Price must be greater than 0")
    private Double price; // use Double, not primitive double

    private String imagePath;
}