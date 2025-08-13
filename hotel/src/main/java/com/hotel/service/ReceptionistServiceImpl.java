package com.hotel.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exception.ApiException;
import com.hotel.custom_exception.ResourceNotFoundException;
import com.hotel.dao.BookingDao;
import com.hotel.dao.PaymentDao;
import com.hotel.dao.RoomDao;
import com.hotel.dao.UserDao;
import com.hotel.dto.AddBookingRespDto;
import com.hotel.dto.ApiResponse;
import com.hotel.dto.BookingReqDto;
import com.hotel.dto.BookingRespDto;
import com.hotel.dto.CustomerReqDto;
import com.hotel.dto.CustomerRespDto;
import com.hotel.dto.LoginReqDto;
import com.hotel.dto.PaymentReqDto;
import com.hotel.dto.UserRespDto;
import com.hotel.entities.Booking;
import com.hotel.entities.BookingStatus;
import com.hotel.entities.Method;
import com.hotel.entities.Payment;
import com.hotel.entities.PaymentStatus;
import com.hotel.entities.Role;
import com.hotel.entities.Room;
import com.hotel.entities.Status;
import com.hotel.entities.User;

import lombok.AllArgsConstructor;


@Service
@Transactional
@AllArgsConstructor
public class ReceptionistServiceImpl implements ReceptionistService {
	

	private final BCryptPasswordEncoder passwordEncoder;
	private final ModelMapper modelMapper;
	private final UserDao userDao;
	private final RoomDao roomDao;
	private final BookingDao bookingDao;
	private final PaymentDao paymentDao;
	
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
	public CustomerRespDto getCustomerById(Long id) {
		User user = userDao.findById(id)
				.orElseThrow(()->new ResourceNotFoundException("Invalid id"));
		return modelMapper.map(user, CustomerRespDto.class);
	}


	@Override
	public List<CustomerRespDto> getAllCustomer() {
		return userDao.findAll()
				.stream()
				.map(user -> modelMapper.map(user, CustomerRespDto.class))
				.collect(Collectors.toList());
	}


	@Override
	public CustomerRespDto getCustomerByEmail(String email) {
		User user = userDao.findByEmail(email)
				.orElseThrow(()->new ResourceNotFoundException("Invalid id"));
		return modelMapper.map(user, CustomerRespDto.class);
	}
	
	
	@Override
	public CustomerRespDto registerCustomer(CustomerReqDto custDto) {
		if(userDao.existsByEmail(custDto.getEmail()))
			throw new ApiException("Duplicate email");
		
		User user = modelMapper.map(custDto, User.class);
		Role role = Role.valueOf(custDto.getRole().toUpperCase());
		user.setRole(role);
		return modelMapper.map(userDao.save(user),CustomerRespDto.class);
	}


	
	//CREATE BOOKING
	@Override
	public AddBookingRespDto createBooking(BookingReqDto bookDto) {
		User user = userDao.findById(bookDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomDao.findById(bookDto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.setStatus(Status.NOT_AVAILABLE);

        
        LocalDate today = LocalDate.now();
        
        if (bookDto.getCheckInDate().isBefore(today)) {
            throw new ApiException("Check-in date cannot be in the past");
        }

        if (!bookDto.getCheckOutDate().isAfter(bookDto.getCheckInDate())) {
            throw new ApiException("Check-out date must be after check-in date");
        }

        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        BookingStatus status = BookingStatus.valueOf(bookDto.getBookingStatus().toUpperCase());
        booking.setBookingStatus(status);
       // booking.setBookingDate(LocalDate.now());
        booking.setCheckInDate(bookDto.getCheckInDate());
        booking.setCheckOutDate(bookDto.getCheckOutDate());

        Booking savedBooking = bookingDao.save(booking);

        roomDao.save(room);
        
        roomDao.saveAndFlush(room);
        
        // Map to response DTO
        
        AddBookingRespDto respDto = modelMapper.map(savedBooking, AddBookingRespDto.class);
        respDto.setRoomId(savedBooking.getRoom().getRoomId());
        respDto.setCategory(savedBooking.getRoom().getCategory());
        respDto.setUserId(savedBooking.getUser().getUserId());
        respDto.setUserName(savedBooking.getUser().getFirstName());
       
        return respDto;
	}


	//MAKE PAYMENT
	@Override
	public BookingRespDto makePayment(Long bookingId, PaymentReqDto paymentDto) {
		Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(booking.getPayment() != null) {
            throw new ApiException("Payment already exists for this booking");
        }
        
        //CHECK PRICE 
        Room room = booking.getRoom();
        double expectedAmount = room.getPrice();
        
        if(paymentDto.getAmount()!=expectedAmount) {
        	throw new ApiException("Invalid payment amount. Expected: " + expectedAmount);
        }
        
        Payment payment = new Payment();
        payment.setAmount(paymentDto.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        Method method = Method.valueOf(paymentDto.getMethod().toUpperCase());
        payment.setMethod(method);
        payment.setPaymentStatus(paymentDto.getPaymentStatus() != null ? paymentDto.getPaymentStatus() : PaymentStatus.SUCCESS);
        payment.setBooking(booking);
        
        
        
       // Payment payment = modelMapper.map(paymentDto, Payment.class);

        Payment savedPayment = paymentDao.save(payment);

        booking.setPayment(savedPayment);
        booking.setBookingStatus(BookingStatus.BOOKED);
        bookingDao.save(booking);

        //Map to BookingRespDTO including payment info
        BookingRespDto respDto = modelMapper.map(booking, BookingRespDto.class);
        respDto.setRoomId(booking.getRoom().getRoomId());
        respDto.setUserId(booking.getUser().getUserId());
        respDto.setUserName(booking.getUser().getFirstName());

        //Payment info
        respDto.setPaymentId(savedPayment.getPaymentId());
        respDto.setAmount(savedPayment.getAmount());
        respDto.setPaymentStatus(savedPayment.getPaymentStatus());
        respDto.setPaymentDate(savedPayment.getPaymentDate());

        return respDto;
	}
	
	//UPDATE BOOKING
	@Override
	@Scheduled(cron = "0 0 1 * * ?") // Runs daily at 1 AM
    public void updateCompletedBookingsAndRooms() {
        LocalDate today = LocalDate.now();

        // Step 1: Find bookings whose check-out date is before today and not completed
        List<Booking> expiredBookings = bookingDao
                .findByBookingStatusNotAndCheckOutDateBefore(BookingStatus.COMPLETED, today);

        // Step 2: Update booking status and collect room IDs
        Set<Long> roomIdsToUpdate = new HashSet<>();

        for (Booking booking : expiredBookings) {
            booking.setBookingStatus(BookingStatus.COMPLETED);
            if (booking.getRoom() != null) {
                roomIdsToUpdate.add(booking.getRoom().getRoomId());
            }
        }

        // Save updated bookings in batch
        bookingDao.saveAll(expiredBookings);

        // Step 3: Update room statuses to AVAILABLE
        if (!roomIdsToUpdate.isEmpty()) {
            List<Room> rooms = roomDao.findAllById(roomIdsToUpdate);

            for (Room room : rooms) {
                room.setStatus(Status.AVAILABLE);
            }

            roomDao.saveAll(rooms);
        }
    }
	
	
//	//UPDATE BOOKING
//	@Scheduled(cron = "0 0 1 * * ?") // Runs daily at 1 AM
//    public void updateCompletedBookings() {
//        LocalDate today = LocalDate.now();
//
//        // Step 1: Mark expired bookings as COMPLETED
//        List<Booking> bookingsToComplete = bookingDao.findBookingsToMarkCompleted(today);
//        for (Booking booking : bookingsToComplete) {
//            booking.setBookingStatus(BookingStatus.COMPLETED);
//            bookingDao.save(booking);
//        }
//
//        // Step 2: For all affected rooms, update their currentOccupancy based on today
//        Set<Room> affectedRooms = bookingsToComplete.stream()
//            .map(booking -> booking.getRoom())
//            .collect(Collectors.toSet());
//
//        for (Room room : affectedRooms) {
//            int currentOccupants = bookingDao.countCurrentOccupants(room, today, BookingStatus.BOOKED);
//            room.setCurrentOccupancy(currentOccupants);
//            if (currentOccupants == 0) {
//                room.setStatus(RoomStatus.AVAILABLE);
//            } else {
//                room.setStatus(RoomStatus.OCCUPIED);
//            }
//            roomDao.save(room);
//        }
//    }


	//GET ALL BOOKINGS BY USERID
	@Override
	public List<BookingRespDto> getBookingsByUserId(Long userId) {
		User user = userDao.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		
		List<Booking> bookings = bookingDao.findByUserUserId(userId);
		
		if(bookings.isEmpty()) {
			throw new ResourceNotFoundException("No bookings found for this user");
		}
		
		return bookings.stream().map(booking -> {
			BookingRespDto dto = modelMapper.map(booking, BookingRespDto.class);
			
			//SET ROOM AND PGPROPERTY
	        if (booking.getRoom() != null) {
	            dto.setRoomId(booking.getRoom().getRoomId());

//	            if (booking.getRoom().getPgproperty() != null) {
//	                dto.setPgPropertId(booking.getRoom().getPgproperty().getPgId());
//	                dto.setPgPropertyName(booking.getRoom().getPgproperty().getName());
//	            }
	        }
	        
	     //SET USER
	        if (booking.getUser() != null) {
	            dto.setUserId(booking.getUser().getUserId());
	            dto.setUserName(booking.getUser().getFirstName());
	        }

	        //SET PAYMENT
	        if (booking.getPayment() != null) {
	            dto.setPaymentId(booking.getPayment().getPaymentId());
	            dto.setAmount(booking.getPayment().getAmount());
	            dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
	            dto.setPaymentDate(booking.getPayment().getPaymentDate());
	        }
	        return dto;
	    }).collect(Collectors.toList());
	}


	//CANCEL BOOKING USING USERID AND BOOKINGID
	@Override
	public ApiResponse cancelBooking(Long userId, Long bookingId) {
		// Step 1: Fetch booking by bookingId
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        // Step 2: Check if booking belongs to user
        if (!booking.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Booking does not belong to the specified user");
        }

        // Step 3: Set booking status to CANCELLED
        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingDao.save(booking);

        // Step 4: Set room status to AVAILABLE
        Room room = booking.getRoom();
        if (room != null) {
            room.setStatus(com.hotel.entities.Status.AVAILABLE);
            roomDao.save(room);
        }

        return new ApiResponse("Booking with ID " + bookingId + " has been cancelled successfully.");
    }
	
	
	
//	@Override
//	public BookingRespDto cancelBookingsByUserId(Long userId, Long bookingId) {
//		User user = userDao.findById(userId)
//	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//	 
//	 Booking booking = bookingDao.findById(bookingId)
//	            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
//
//	    
//	  if(!booking.getUser().getUserId().equals(userId)) {
//		  throw new ResourceNotFoundException("Booking does not belong to this user");
//	  }
//	  
//	  if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
//	        throw new ApiException("Booking is already cancelled");
//	   }
//	  
//	  booking.setBookingStatus(BookingStatus.CANCELLED);
//	  
//	  Room room = booking.getRoom();
//	  if(room !=null) {
//		  room.setStatus(Status.AVAILABLE);	
//		  if(room.getCurrentOccupancy()>0) {
//			  room.setCurrentOccupancy(room.getCurrentOccupancy()-1);
//		  }
//		  roomDao.save(room);
//	 }
//	    
//	  bookingDao.save(booking);
//	  
//	  
//	  
//	  
//	  BookingRespDto dto = modelMapper.map(booking, BookingRespDto.class);
//	    dto.setUserId(user.getUserId());
//	    dto.setUserName(user.getFirstName());
//	    if (booking.getRoom() != null) {
//	        dto.setRoomId(booking.getRoom().getRoomId());
//	        if (booking.getRoom().getPgproperty() != null) {
//	            dto.setPgPropertId(booking.getRoom().getPgproperty().getPgId());
//	            dto.setPgPropertyName(booking.getRoom().getPgproperty().getName());
//	        }
//	    }
//	    if (booking.getPayment() != null) {
//	        dto.setPaymentId(booking.getPayment().getPaymentId());
//	        dto.setAmount(booking.getPayment().getAmount());
//	        dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
//	        dto.setPaymentDate(booking.getPayment().getPaymentDate());
//	    }
//
//	    return dto;
//	}

	// GET BOOKING BY BOOKING ID
	@Override
	public BookingRespDto getBookingById(Long bookingId) {
		Booking booking = bookingDao.findById(bookingId)
	            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

	    BookingRespDto dto = modelMapper.map(booking, BookingRespDto.class);

	    // Set Room and PGProperty
	    if (booking.getRoom() != null) {
	        dto.setRoomId(booking.getRoom().getRoomId());
	    }

	    // Set User
	    if (booking.getUser() != null) {
	        dto.setUserId(booking.getUser().getUserId());
	        dto.setUserName(booking.getUser().getFirstName());
	    }

	    // Set Payment
	    if (booking.getPayment() != null) {
	        dto.setPaymentId(booking.getPayment().getPaymentId());
	        dto.setAmount(booking.getPayment().getAmount());
	        dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
	        dto.setPaymentDate(booking.getPayment().getPaymentDate());
	    }

	    return dto;
	}	
}
