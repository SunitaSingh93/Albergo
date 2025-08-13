package com.hotel.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exception.ApiException;
import com.hotel.custom_exception.ResourceNotFoundException;
import com.hotel.dao.UserDao;
import com.hotel.dto.ApiResponse;
import com.hotel.dto.LoginReqDto;
import com.hotel.dto.UserReqDto;
import com.hotel.dto.UserRespDto;
import com.hotel.entities.Role;
import com.hotel.entities.User;

import lombok.AllArgsConstructor;


@Service
@Transactional
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {

	private final UserDao userDao;
	
	private final ModelMapper modelMapper;
	private final BCryptPasswordEncoder passwordEncoder;

	@Override
	public List<UserRespDto> getAllUser() {
		return userDao.findAll()
				.stream()
				.map(user -> modelMapper.map(user, UserRespDto.class))
				.collect(Collectors.toList());
	}
	
	@Override
	public UserRespDto loginUser(LoginReqDto loginDto) {
		User user = userDao.findByEmail(loginDto.getEmail())
				.orElseThrow(()->new ApiException("Invalid email or password"));
		if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
			throw new ApiException("Invalid email or password");
		}
		return modelMapper.map(user, UserRespDto.class);
	}


	@Override
	public UserRespDto addUser(UserReqDto userDto) {
		if(userDao.existsByEmail(userDto.getEmail()))
			throw new ApiException("Duplicate email");
		
		User entity = modelMapper.map(userDto, User.class);
		entity.setPassword(passwordEncoder.encode(userDto.getPassword()));
		Role role = Role.valueOf(userDto.getRole().toUpperCase());
		entity.setRole(role);
		return modelMapper.map(userDao.save(entity),UserRespDto.class);
	}

	@Override
	public UserRespDto getUserById(Long id) {
		User user = userDao.findById(id)
				.orElseThrow(()->new ResourceNotFoundException("Invalid id"));
		return modelMapper.map(user, UserRespDto.class);
	}

	@Override
	public User updateDetails(Long id, User user) {
		User user2 = userDao.findById(id)
				.orElseThrow(()->new ResourceNotFoundException("Invalid id"));
		return userDao.save(user2);
	}

	@Override
	public ApiResponse deleteUser(Long id) {
		User user = userDao.findById(id)
				.orElseThrow(()->new ResourceNotFoundException("Invalid id"));
		
		userDao.delete(user);
		return new ApiResponse("User deleted");
	}

	@Override
	public List<UserRespDto> getUserByRole(String role) {
		Role role1 = Role.valueOf(role.toUpperCase());
		List<User> users = userDao.findByRole(role1);
		return users
				.stream()
				.map(user -> modelMapper.map(user, UserRespDto.class))
				.collect(Collectors.toList());
	}

	@Override
	public UserRespDto getUserByEmail(String email) {
		User user = userDao.findByEmail(email)
				.orElseThrow(()->new ResourceNotFoundException("Invalid id"));
		return modelMapper.map(user, UserRespDto.class);
	}

	
}
