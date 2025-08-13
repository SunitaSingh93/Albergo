package com.hotel.exception_handler;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.hotel.custom_exception.ApiException;
import com.hotel.custom_exception.ResourceNotFoundException;
import com.hotel.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e){
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiResponse(e.getMessage()));
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
		Map<String, String> rejectedFields = e.getFieldErrors()
				.stream()
				.collect(Collectors.toMap(FieldError::getField,
						FieldError::getDefaultMessage));
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(rejectedFields);
	}
	
	@ExceptionHandler(ApiException.class)
	public ResponseEntity<?> handleApiException(ApiException e){
		return ResponseEntity
		        .status(HttpStatus.BAD_REQUEST)
		        .body(new ApiResponse(e.getMessage()));
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGeneralException(Exception e){
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("Something went wrong on the server"));
	}
}
