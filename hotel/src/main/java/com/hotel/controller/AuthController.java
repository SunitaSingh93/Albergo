package com.hotel.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dao.UserDao;
import com.hotel.dto.JwtRequest;
import com.hotel.dto.JwtResponse;
import com.hotel.entities.User;
import com.hotel.security.CustomUserDetailsService;
import com.hotel.security.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	
	private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserDao userDao;
    

    @PostMapping("/login")
    public JwtResponse login(@RequestBody JwtRequest request) {
        // Authenticate the credentials
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));

        // Generate token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtService.generateToken(userDetails);

        User userData = userDao.findByEmail(request.getEmail())
        		.orElseThrow(()->new UsernameNotFoundException("Invalid user name"));
        String roles = userData.getRole().toString();
        
        // Fetch the actual domain user (User, Owner, or Admin)
        Object domainUser = userDetailsService.loadDomainUserByEmail(request.getEmail());
        Long id = null;
        String name = "";
        String role = "";

        if (domainUser instanceof User user) {
        	id = user.getUserId();
            name = user.getFirstName();
            role = roles;}
//        } else if (domainUser instanceof Owner owner) {
//        	id = owner.getOwnerId();
//            name = owner.getName();
//            role = "OWNER";
//        } else if (domainUser instanceof Admin admin) {
//        	 id = admin.getAdminId();
//            name = admin.getName();
//            role = "ADMIN";
//        }

        return new JwtResponse(id, token, request.getEmail(), name, role);
    }
}
