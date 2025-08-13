import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoleLayout from "../../components/RoleLayout";
import { managerActions, executeManagerAction } from "../../components/ManagerActions";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management for manager operations
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!user || user.role !== "MANAGER") {
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

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (selectedAction) {
      executeAction(selectedAction.id, formData);
    }
  }, [selectedAction, formData]);

  // Handle cancel action
  const handleCancel = useCallback(() => {
    setSelectedAction(null);
    setFormData({});
    setError("");
    setResults(null);
    setValidationErrors({});
  }, []);

  // Execute manager actions with error handling and loading states
  const executeAction = useCallback(async (actionId, data) => {
    setLoading(true);
    setError("");
    setValidationErrors({});
    
    try {
      const result = await executeManagerAction(actionId, data);
      setResults(result);
      setLastUpdated(new Date().toLocaleString());
      
      // Clear form data for successful operations that modify data
      if (['addRoom', 'updateRoom', 'deleteRoom'].includes(actionId)) {
        setFormData({});
        setSelectedAction(null);
        
        // Auto-refresh rooms list after room operations
        setTimeout(() => {
          executeAction('getAllRooms', {});
        }, 1500);
      }
      
    } catch (err) {
      console.error('Manager action execution error:', err);
      setError(err.message || "An error occurred while processing your request");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Custom results renderer for manager-specific data
  const renderResults = useCallback((results) => {
    if (!results || results.length === 0) {
      return (
        <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-center">
          No data available
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

    // Handle rooms display
    if (results[0]?.roomId || results[0]?.roomNumber) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Rooms ({results.length})</h3>
            <button 
              onClick={() => executeAction('getAllRooms', {})}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((room, index) => (
              <div key={room.roomId || index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">Room {room.roomNumber}</h4>
                      <p className="text-sm text-gray-600">ID: {room.roomId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      room.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        room.category === 'SUITE' ? 'bg-purple-100 text-purple-800' :
                        room.category === 'DELUXE' ? 'bg-blue-100 text-blue-800' :
                        room.category === 'PREMIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {room.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-green-600">${room.price}/night</span>
                    </div>
                    {room.occupancy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Occupancy:</span>
                        <span className="font-medium">{room.occupancy} guests</span>
                      </div>
                    )}
                  </div>
                  
                  {room.description && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-xs">Description:</span>
                      <p className="text-gray-700 text-xs mt-1 bg-gray-50 p-2 rounded">{room.description}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t space-y-2">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedAction(managerActions.find(a => a.id === 'updateRoom'));
                          setFormData({ 
                            roomId: room.roomId,
                            roomNumber: room.roomNumber,
                            category: room.category,
                            price: room.price,
                            occupancy: room.occupancy,
                            imagePath: room.imagePath,
                            status: room.status,
                            description: room.description
                          });
                        }}
                        className="flex-1 text-xs bg-blue-50 text-blue-700 py-2 px-3 rounded hover:bg-blue-100 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
                            executeAction('deleteRoom', { roomId: room.roomId });
                          }
                        }}
                        className="flex-1 text-xs bg-red-50 text-red-700 py-2 px-3 rounded hover:bg-red-100 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
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
            <h3 className="text-lg font-semibold text-gray-800">Customer Reviews ({results.length})</h3>
            <button 
              onClick={() => executeAction('getAllReviews', {})}
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
                    <p className="text-sm text-gray-600">
                      by {review.user?.firstName} {review.user?.lastName} (ID: {review.userId})
                    </p>
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
  }, [lastUpdated, loading, executeAction, managerActions]);

  return (
    <RoleLayout 
      roleName="Manager"
      actions={managerActions}
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

