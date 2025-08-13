import { 
  getUserById,
  updateUser,
  getBookingsByUserId,
  getReviewByUserId,
  giveReview,
  makePayment,
  makeBooking,
  cancelBooking,
  getAllRooms
} from "../api/customer";
import { createRazorpayOrder, initiateDummyRazorpayPayment } from "../api/payment";

// Customer action configurations and logic
export const customerActions = [
  {
    id: "getProfile",
    label: "View Profile",
    icon: "👤",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "View your profile information",
    action: async (data, userId) => {
      try {
        const result = await getUserById(userId);
        return [result];
      } catch (error) {
        throw new Error(`Failed to fetch profile: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "updateProfile",
    label: "Update Profile",
    icon: "✏️",
    color: "bg-green-500 hover:bg-green-600",
    description: "Update your profile information",
    hasInput: true,
    inputFields: [
      { name: "firstName", type: "text", placeholder: "First Name", required: false },
      { name: "lastName", type: "text", placeholder: "Last Name", required: false },
      { name: "email", type: "email", placeholder: "Email Address", required: false },
      { name: "phone", type: "tel", placeholder: "Phone Number", required: false }
    ],
    action: async (data, userId) => {
      try {
        // Remove empty fields
        const updateData = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value && value.trim() !== "")
        );
        
        if (Object.keys(updateData).length === 0) {
          throw new Error("Please provide at least one field to update");
        }
        
        // Validate email format if provided
        if (updateData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
          throw new Error("Please provide a valid email address");
        }
        
        // Validate phone format if provided
        if (updateData.phone && !/^[\d\s\-\+\(\)]+$/.test(updateData.phone)) {
          throw new Error("Please provide a valid phone number");
        }
        
        const result = await updateUser(userId, updateData);
        return [{ message: result.message || "Profile updated successfully!" }];
      } catch (error) {
        throw new Error(`Failed to update profile: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getBookings",
    label: "My Bookings",
    icon: "🏨",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "View all your bookings",
    action: async (data, userId) => {
      try {
        const result = await getBookingsByUserId(userId);
        const bookings = Array.isArray(result) ? result : result.bookings || [];
        
        // Sort bookings by check-in date (most recent first)
        return bookings.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
      } catch (error) {
        throw new Error(`Failed to fetch bookings: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "viewAvailableRooms",
    label: "Browse Rooms",
    icon: "🏨",
    color: "bg-emerald-500 hover:bg-emerald-600",
    description: "View all available rooms",
    action: async (data, userId) => {
      try {
        console.log('Fetching rooms from API...');
        const result = await getAllRooms();
        console.log('API Response:', result);
        
        // Handle different response formats
        let rooms = [];
        if (Array.isArray(result)) {
          rooms = result;
        } else if (result && Array.isArray(result.rooms)) {
          rooms = result.rooms;
        } else if (result && Array.isArray(result.data)) {
          rooms = result.data;
        } else if (result && typeof result === 'object') {
          // If result is a single room object, wrap it in an array
          rooms = [result];
        }
        
        console.log('Processed rooms:', rooms);
        console.log('Total rooms found:', rooms.length);
        
        // Filter only available rooms
        const availableRooms = rooms.filter(room => {
          const status = room.status || room.availability || 'AVAILABLE';
          return status.toUpperCase() === 'AVAILABLE';
        });
        
        console.log('Available rooms after filtering:', availableRooms);
        console.log('Filtered out rooms:', rooms.length - availableRooms.length);
        
        return { type: 'roomSelection', rooms: availableRooms };
      } catch (error) {
        console.error('Error fetching rooms:', error);
        // Return more detailed error information
        return { 
          type: 'error', 
          message: `API Error: ${error.message || 'Unknown error'}`,
          details: error.toString()
        };
      }
    }
  },
  {
    id: "makeBooking",
    label: "Book Room",
    icon: "🏨",
    color: "bg-emerald-500 hover:bg-emerald-600",
    description: "Make a new room booking",
    hasInput: true,
    inputFields: [
      { name: "roomId", type: "hidden", required: true },
      { name: "checkInDate", type: "date", placeholder: "Check-in Date", required: true },
      { name: "checkOutDate", type: "date", placeholder: "Check-out Date", required: true },
      { name: "guests", type: "number", placeholder: "Number of Guests", required: true, min: 1, max: 10 },
      { name: "specialRequests", type: "textarea", placeholder: "Special requests (optional)", required: false }
    ],
    action: async (data, userId) => {
      try {
        const requiredFields = ["roomId", "checkInDate", "checkOutDate", "guests"];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }
        
        // Validate dates
        const checkIn = new Date(data.checkInDate);
        const checkOut = new Date(data.checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkIn < today) {
          throw new Error("Check-in date cannot be in the past");
        }
        
        if (checkOut <= checkIn) {
          throw new Error("Check-out date must be after check-in date");
        }
        
        // Validate guests
        const guests = parseInt(data.guests);
        if (isNaN(guests) || guests < 1 || guests > 10) {
          throw new Error("Number of guests must be between 1 and 10");
        }
        
        const bookingData = {
          roomId: String(data.roomId).trim(),
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
          guests: guests,
          userId: userId
        };
        
        if (data.specialRequests && data.specialRequests.trim()) {
          bookingData.specialRequests = data.specialRequests.trim();
        }
        
        // Create Razorpay order for payment instead of direct booking
        const orderData = await createRazorpayOrder({
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guestCount: bookingData.guests
        });

        // Return special result type for Razorpay payment with booking data
        return {
          type: 'razorpayPayment',
          orderData: orderData,
          bookingData: {
            roomId: bookingData.roomId,
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            guestCount: bookingData.guests,
            specialRequests: bookingData.specialRequests,
            userId: userId
          }
        };
      } catch (error) {
        throw new Error(`Failed to create booking: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "cancelBooking",
    label: "Cancel Booking",
    icon: "❌",
    color: "bg-red-500 hover:bg-red-600",
    description: "Cancel an existing booking",
    hasInput: true,
    inputFields: [
      { name: "bookingId", type: "text", placeholder: "Booking ID to Cancel", required: true }
    ],
    action: async (data, userId) => {
      try {
        const requiredFields = ["bookingId"];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }
        
        // Validate booking ID format
        if (!/^[a-zA-Z0-9]+$/.test(data.bookingId.trim())) {
          throw new Error("Please enter a valid booking ID");
        }
        
        const result = await cancelBooking(userId, data.bookingId.trim());
        return [{ message: result.message || "Booking cancelled successfully!" }];
      } catch (error) {
        throw new Error(`Failed to cancel booking: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getReviews",
    label: "My Reviews",
    icon: "⭐",
    color: "bg-yellow-500 hover:bg-yellow-600",
    description: "View all your reviews",
    action: async (data, userId) => {
      try {
        const result = await getReviewByUserId(userId);
        const reviews = Array.isArray(result) ? result : result.reviews || [];
        
        // Sort reviews by date (most recent first)
        return reviews.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      } catch (error) {
        throw new Error(`Failed to fetch reviews: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "giveReview",
    label: "Write Review",
    icon: "📝",
    color: "bg-indigo-500 hover:bg-indigo-600",
    description: "Write a review for your stay",
    hasInput: true,
    inputFields: [
      { 
        name: "rating", 
        type: "select", 
        placeholder: "Select Rating",
        options: ["1", "2", "3", "4", "5"],
        required: true
      },
      { 
        name: "comment", 
        type: "textarea", 
        placeholder: "Write your review...", 
        required: true,
        minLength: 10
      }
    ],
    action: async (data, userId) => {
      try {
        const requiredFields = ["rating", "comment"];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }
        
        // Validate rating
        const rating = parseInt(data.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          throw new Error("Please select a valid rating between 1 and 5");
        }
        
        // Validate comment length
        if (data.comment.trim().length < 10) {
          throw new Error("Please provide a comment with at least 10 characters");
        }
        
        const result = await giveReview(userId, {
          rating: rating,
          comment: data.comment.trim()
        });
        return [{ message: result.message || "Review submitted successfully!" }];
      } catch (error) {
        throw new Error(`Failed to submit review: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "makePayment",
    label: "Make Payment",
    icon: "💳",
    color: "bg-red-500 hover:bg-red-600",
    description: "Make payment for a booking",
    hasInput: true,
    inputFields: [
      { name: "bookingId", type: "text", placeholder: "Booking ID", required: true },
      { name: "amount", type: "number", placeholder: "Payment Amount", required: true, min: 0.01 },
      { name: "paymentMethod", type: "select", placeholder: "Payment Method", options: ["CARD", "CASH", "UPI"], required: true }
    ],
    action: async (data, userId) => {
      try {
        const requiredFields = ["bookingId", "amount", "paymentMethod"];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }
        
        // Validate amount
        const amount = parseFloat(data.amount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error("Please enter a valid payment amount greater than 0");
        }
        
        // Validate booking ID format (assuming it should be numeric or alphanumeric)
        if (!/^[a-zA-Z0-9]+$/.test(data.bookingId.trim())) {
          throw new Error("Please enter a valid booking ID");
        }
        
        const result = await makePayment(data.bookingId.trim(), {
          amount: amount,
          paymentMethod: data.paymentMethod
        });
        return [{ message: result.message || "Payment processed successfully!" }];
      } catch (error) {
        throw new Error(`Failed to process payment: ${error.message || 'Unknown error'}`);
      }
    }
  }
];

// Execute a customer action by ID
export const executeCustomerAction = async (actionId, formData = {}, userId) => {
  const action = customerActions.find(a => a.id === actionId);
  if (!action) {
    throw new Error(`Action ${actionId} not found`);
  }
  
  return await action.action(formData, userId);
};
