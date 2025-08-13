import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoleLayout from "../../components/RoleLayout";
import { customerActions, executeCustomerAction } from "../../components/CustomerActions";
import { initiateDummyRazorpayPayment } from "../../api/payment";
import { makeBooking } from "../../api/customer";
import { generateBookingReceipt, downloadReceipt, printReceipt } from "../../utils/receiptGenerator";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management for customer operations
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Handle action button clicks
  const handleActionClick = useCallback((action) => {
    setSelectedAction(action);
    setFormData({});
    setError("");
    setResults(null);
    setValidationErrors({});
    
    // Execute immediately if no input is required
    if (!action.hasInput) {
      executeAction(action.id, {});
    }
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [validationErrors]);

  // Validate form data
  const validateForm = useCallback((action, data) => {
    const errors = {};
    
    if (action.inputFields) {
      action.inputFields.forEach(field => {
        if (field.required !== false && (!data[field.name] || data[field.name].toString().trim() === '')) {
          errors[field.name] = `${field.placeholder || field.name} is required`;
        }
        
        // Specific validation rules
        if (data[field.name]) {
          if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field.name])) {
            errors[field.name] = 'Please enter a valid email address';
          }
          if (field.type === 'tel' && !/^[\d\s\-\+\(\)]+$/.test(data[field.name])) {
            errors[field.name] = 'Please enter a valid phone number';
          }
          if (field.type === 'number' && isNaN(data[field.name])) {
            errors[field.name] = 'Please enter a valid number';
          }
        }
      });
    }
    
    return errors;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (selectedAction) {
      const errors = validateForm(selectedAction, formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      executeAction(selectedAction.id, formData);
    }
  }, [selectedAction, formData, validateForm]);

  // Handle cancel action
  const handleCancel = useCallback(() => {
    setSelectedAction(null);
    setFormData({});
    setError("");
    setResults(null);
    setValidationErrors({});
  }, []);

  // Execute customer actions with error handling and loading states
  const executeAction = useCallback(async (actionId, data) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }
    
    setLoading(true);
    setError("");
    setValidationErrors({});
    
    try {
      const result = await executeCustomerAction(actionId, data, user.id || user.userId);
      console.log('executeAction result:', result);
      
      // Handle special Razorpay payment result type
      if (result && result.type === 'razorpayPayment') {
        handleRazorpayPayment(result.orderData, result.bookingData);
        return;
      }
      
      setResults(result);
      console.log('Results state set to:', result);
      setLastUpdated(new Date().toLocaleString());
      
      // Clear form data for successful operations that modify data
      if (['updateProfile', 'giveReview', 'makePayment', 'makeBooking', 'cancelBooking'].includes(actionId)) {
        setFormData({});
        setSelectedAction(null);
        
        // Show success message for a few seconds
        setTimeout(() => {
          if (actionId === 'updateProfile') {
            // Auto-refresh profile after update
            executeAction('getProfile', {});
          } else if (actionId === 'makeBooking' || actionId === 'cancelBooking') {
            // Auto-refresh bookings after booking operations
            executeAction('getBookings', {});
            // Also refresh available rooms to update availability
            executeAction('viewAvailableRooms', {});
          }
        }, 1500);
      }
      
    } catch (err) {
      console.error('Action execution error:', err);
      setError(err.message || "An error occurred while processing your request");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.userId]);

  // Handle Razorpay payment flow
  const handleRazorpayPayment = useCallback((orderData, bookingData) => {
    console.log('Initiating Razorpay payment with order data:', orderData);
    
    const onPaymentSuccess = async (paymentResponse) => {
      console.log('Payment successful:', paymentResponse);
      setLoading(true);
      
      try {
        // Create booking after successful payment
        const bookingResult = await makeBooking({
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guests: bookingData.guestCount,
          specialRequests: bookingData.specialRequests,
          userId: bookingData.userId,
          paymentId: paymentResponse.paymentId,
          orderId: paymentResponse.orderId
        });
        
        // Generate receipt data
        const { receiptHTML, receiptData } = generateBookingReceipt(
          paymentResponse,
          bookingResult,
          orderData,
          user // customer info
        );

        setResults([{
          type: 'paymentSuccess',
          message: 'Payment completed and booking confirmed successfully!',
          paymentDetails: paymentResponse,
          bookingDetails: bookingResult,
          orderData: orderData,
          receiptHTML: receiptHTML,
          receiptData: receiptData
        }]);
        
        setSelectedAction(null);
        setFormData({});
        setLastUpdated(new Date().toLocaleString());
        
        // Don't auto-refresh for payment success - let user view receipt and manually navigate
        
      } catch (error) {
        console.error('Booking creation failed after payment:', error);
        setError(`Payment successful but booking failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    const onPaymentFailure = (errorMessage) => {
      console.error('Payment failed:', errorMessage);
      setError(`Payment failed: ${errorMessage}`);
      setLoading(false);
    };
    
    // Initiate Razorpay payment
    initiateDummyRazorpayPayment(orderData, onPaymentSuccess, onPaymentFailure);
  }, [executeAction]);

  // Custom results renderer for customer-specific data
  const renderResults = useCallback((results) => {
    console.log('renderResults called with:', results);
    
    if (!results) {
      console.log('No results provided');
      return (
        <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-center">
          No data available
        </div>
      );
    }
    
    if (Array.isArray(results) && results.length === 0) {
      console.log('Empty results array');
      return (
        <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-center">
          No data available
        </div>
      );
    }

    // Handle payment success display
    if (results[0]?.type === 'paymentSuccess') {
      const paymentResult = results[0];
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <div className="flex items-center mb-4">
            <span className="text-3xl text-green-500 mr-3">🎉</span>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
              <p className="text-green-600">{paymentResult.message}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-gray-800 mb-2">💳 Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Payment ID:</strong> {paymentResult.paymentDetails?.paymentId}</div>
                <div><strong>Order ID:</strong> {paymentResult.paymentDetails?.orderId}</div>
                <div><strong>Amount:</strong> ₹{(paymentResult.orderData?.amount / 100).toFixed(2)}</div>
                <div><strong>Status:</strong> <span className="text-green-600 font-medium">Completed</span></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-gray-800 mb-2">🏨 Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Room ID:</strong> {paymentResult.orderData?.roomId}</div>
                <div><strong>Room Price:</strong> ₹{paymentResult.orderData?.roomPrice}</div>
                <div><strong>Booking Status:</strong> <span className="text-blue-600 font-medium">Confirmed</span></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Next Steps:</strong> Your booking has been confirmed! You can view all your bookings by clicking "My Bookings" above.
            </p>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => downloadReceipt(paymentResult.receiptHTML, paymentResult.receiptData)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                📄 Download Receipt
              </button>
              <button
                onClick={() => printReceipt(paymentResult.receiptHTML)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                🖨️ Print Receipt
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => executeAction('getBookings', {})}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                🏨 View My Bookings
              </button>
              <button
                onClick={() => executeAction('viewAvailableRooms', {})}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                🛏️ Browse More Rooms
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-green-200">
              Transaction completed: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    if (results[0]?.message) {
      return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            {results[0].message}
          </div>
          {lastUpdated && (
            <div className="text-xs text-green-600 mt-1">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Handle profile display
    if (results[0]?.firstName || results[0]?.email || results[0]?.userId) {
      const profile = results[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl text-blue-600">👤</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-gray-600">Customer ID: {profile.userId}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {profile.role || 'CUSTOMER'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Handle bookings display
    if (results[0]?.bookingId) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">My Bookings ({results.length})</h3>
            <button 
              onClick={() => executeAction('getBookings', {})}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((booking, index) => (
              <div key={booking.bookingId || index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Booking #{booking.bookingId}</h4>
                    <p className="text-sm text-gray-600">Room {booking.roomId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  {booking.guests && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{booking.guests}</span>
                    </div>
                  )}
                  {booking.totalAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-green-600">${booking.totalAmount}</span>
                    </div>
                  )}
                  {booking.specialRequests && (
                    <div className="mt-2">
                      <span className="text-gray-600 text-xs">Special Requests:</span>
                      <p className="text-gray-700 text-xs mt-1 bg-gray-50 p-2 rounded">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
                
                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    {booking.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => {
                          setSelectedAction(customerActions.find(a => a.id === 'makePayment'));
                          setFormData({ bookingId: booking.bookingId });
                        }}
                        className="w-full text-xs bg-blue-50 text-blue-700 py-2 px-3 rounded hover:bg-blue-100 transition-colors"
                      >
                        💳 Make Payment
                      </button>
                    )}
                    {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel booking #${booking.bookingId}?`)) {
                            setSelectedAction(customerActions.find(a => a.id === 'cancelBooking'));
                            setFormData({ bookingId: booking.bookingId });
                            executeAction('cancelBooking', { bookingId: booking.bookingId });
                          }
                        }}
                        className="w-full text-xs bg-red-50 text-red-700 py-2 px-3 rounded hover:bg-red-100 transition-colors"
                      >
                        ❌ Cancel Booking
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Handle reviews display
    if (results[0]?.reviewId || results[0]?.rating) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">My Reviews ({results.length})</h3>
            <button 
              onClick={() => executeAction('getReviews', {})}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div className="grid gap-4">
            {results.map((review, index) => (
              <div key={review.reviewId || index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Review #{review.reviewId}</h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}>
                          ⭐
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment || 'No comment provided'}
                  </p>
                </div>
                
                {review.bookingId && (
                  <div className="mt-2 text-xs text-gray-500">
                    Related to Booking #{review.bookingId}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Handle API error display
    if (results?.type === 'error') {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">❌</span>
            <div>
              <strong>Error:</strong> {results.message}
              {results.details && (
                <div className="text-sm mt-1 text-red-600">
                  Details: {results.details}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Handle room selection display
    if (results?.type === 'roomSelection' && results?.rooms) {
      console.log('Rendering room selection with rooms:', results.rooms);
      
      const handleBookRoom = (room) => {
        console.log('Book This Room clicked for room:', room);
        console.log('Room properties:', Object.keys(room));
        const roomIdentifier = room.roomId || room.id || room.roomNumber;
        console.log('Using room identifier:', roomIdentifier);
        const bookingAction = customerActions.find(a => a.id === 'makeBooking');
        console.log('Found booking action:', bookingAction);
        console.log('Setting selected action and form data...');
        setSelectedAction(bookingAction);
        setFormData({ roomId: roomIdentifier });
        setError("");
        setResults(null);
        console.log('Form should now be visible');
      };
      
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Available Rooms ({results.rooms.length})</h3>
            <button 
              onClick={() => handleActionClick(customerActions.find(a => a.id === 'viewAvailableRooms'))}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
          
          {results.rooms.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center">
              No available rooms found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.rooms.map((room, index) => (
                <div key={room.roomId || `room-${index}`} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Room Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {room.imagePath ? (
                      <img 
                        src={room.imagePath} 
                        alt={`Room ${room.roomNumber}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center" style={{display: room.imagePath ? 'none' : 'flex'}}>
                      <span className="text-4xl text-gray-400">🏨</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Available
                      </span>
                    </div>
                  </div>
                  
                  {/* Room Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg text-gray-800">Room {room.roomNumber}</h4>
                      <span className="text-lg font-bold text-green-600">${room.price}/night</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          room.category === 'DELUXE' ? 'bg-purple-100 text-purple-800' :
                          room.category === 'SUITE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {room.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Max Guests:</span>
                        <span className="font-medium text-gray-800">{room.occupancy || 'N/A'}</span>
                      </div>
                    </div>
                     
                    {room.description && (
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{room.description}</p>
                      </div>
                    )}
                    
                    {/* Book Room Button */}
                    <button 
                      onClick={() => handleBookRoom(room)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      📅 Book This Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center mt-4">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Handle general data display
    if (Array.isArray(results) && results.length > 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
          <div className="space-y-3">
            {results.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Default rendering for other data types
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(results, null, 2)}
        </pre>
        {lastUpdated && (
          <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
    );
  }, [lastUpdated, loading, handleActionClick]);

  return (
    <RoleLayout 
      roleName="Customer"
      actions={customerActions}
      selectedAction={selectedAction}
      formData={formData}
      results={results}
      error={error}
      loading={loading}
      validationErrors={validationErrors}
      onActionClick={handleActionClick}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      renderResults={renderResults}
    />
  );
}

