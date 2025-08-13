import { 
  getAllRooms,
  getRoomById,
  getRoomByRoomNumber,
  getRoomByCategory,
  addRoom,
  updateRoom,
  deleteRoom,
  getAllReviews,
  getReviewByUserId
} from "../api/manager";

// Manager action configurations and logic
export const managerActions = [
  {
    id: "getAllRooms",
    label: "All Rooms",
    icon: "🏨",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "View all rooms in the hotel",
    action: async () => {
      try {
        const result = await getAllRooms();
        return Array.isArray(result) ? result : result.rooms || [];
      } catch (error) {
        throw new Error(`Failed to fetch rooms: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getRoomById",
    label: "Find Room by ID",
    icon: "🔍",
    color: "bg-green-500 hover:bg-green-600",
    description: "Search for a room by ID",
    hasInput: true,
    inputFields: [{ name: "roomId", type: "text", placeholder: "Enter Room ID" }],
    action: async (data) => {
      try {
        if (!data.roomId || data.roomId.trim() === '') {
          throw new Error("Please enter a Room ID");
        }
        const result = await getRoomById(data.roomId.trim());
        return [result];
      } catch (error) {
        throw new Error(`Failed to fetch room: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getRoomByNumber",
    label: "Find Room by Number",
    icon: "🔢",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Search for a room by room number",
    hasInput: true,
    inputFields: [{ name: "roomNumber", type: "text", placeholder: "Enter Room Number" }],
    action: async (data) => {
      try {
        if (!data.roomNumber || data.roomNumber.trim() === '') {
          throw new Error("Please enter a Room Number");
        }
        const result = await getRoomByRoomNumber(data.roomNumber.trim());
        return [result];
      } catch (error) {
        throw new Error(`Failed to fetch room: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getRoomByCategory",
    label: "Rooms by Category",
    icon: "📋",
    color: "bg-yellow-500 hover:bg-yellow-600",
    description: "Filter rooms by category",
    hasInput: true,
    inputFields: [{ 
      name: "category", 
      type: "select", 
      placeholder: "Select Category",
      options: ["STANDARD", "DELUXE", "SUITE", "PREMIUM"]
    }],
    action: async (data) => {
      try {
        if (!data.category) {
          throw new Error("Please select a category");
        }
        const result = await getRoomByCategory(data.category);
        return Array.isArray(result) ? result : [result];
      } catch (error) {
        throw new Error(`Failed to fetch rooms by category: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "addRoom",
    label: "Add New Room",
    icon: "➕",
    color: "bg-indigo-500 hover:bg-indigo-600",
    description: "Add a new room to the hotel",
    hasInput: true,
    inputFields: [
      { name: "roomNumber", type: "text", placeholder: "Room Number", required: true },
      { 
        name: "category", 
        type: "select", 
        placeholder: "Select Category",
        options: ["STANDARD", "DELUXE", "SUITE", "PREMIUM"],
        required: true
      },
      { name: "price", type: "number", placeholder: "Price per night", required: true, min: 0 },
      { name: "occupancy", type: "number", placeholder: "Maximum Occupancy", required: true, min: 1, max: 10 },
      { name: "imagePath", type: "text", placeholder: "Image URL/Path", required: false },
      { 
        name: "status", 
        type: "select", 
        placeholder: "Room Status",
        options: ["AVAILABLE", "OCCUPIED", "MAINTENANCE"],
        required: true
      },
      { name: "description", type: "textarea", placeholder: "Room description (optional)", required: false }
    ],
    action: async (data) => {
      try {
        const requiredFields = ["roomNumber", "category", "price", "occupancy", "status"];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }
        
        // Validate price
        const price = parseFloat(data.price);
        if (isNaN(price) || price <= 0) {
          throw new Error("Please enter a valid price greater than 0");
        }
        
        // Validate occupancy
        const occupancy = parseInt(data.occupancy);
        if (isNaN(occupancy) || occupancy < 1 || occupancy > 10) {
          throw new Error("Occupancy must be between 1 and 10");
        }
        
        // Validate room number format
        if (!/^[a-zA-Z0-9\-]+$/.test(data.roomNumber.trim())) {
          throw new Error("Room number can only contain letters, numbers, and hyphens");
        }
        
        const roomData = {
          roomNumber: data.roomNumber.trim(),
          category: data.category,
          price: price,
          occupancy: occupancy,
          status: data.status
        };
        
        // Add optional fields if provided
        if (data.imagePath && data.imagePath.trim()) {
          const imagePath = data.imagePath.trim();
          
          // Validate image URL format
          if (imagePath) {
            const isValidUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(imagePath) ||
                              /^\/[^\/].+\.(jpg|jpeg|png|gif|webp)$/i.test(imagePath) ||
                              /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(imagePath);
            
            if (!isValidUrl) {
              throw new Error("Image path must be a valid URL (http/https), public path (/images/...), or base64 data URL");
            }
          }
          
          roomData.imagePath = imagePath;
        }
        
        if (data.description && data.description.trim()) {
          roomData.description = data.description.trim();
        }
        
        const result = await addRoom(roomData);
        return [{ message: result.message || "Room added successfully!" }];
      } catch (error) {
        throw new Error(`Failed to add room: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "updateRoom",
    label: "Update Room",
    icon: "✏️",
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Update existing room details",
    hasInput: true,
    inputFields: [
      { name: "roomId", type: "text", placeholder: "Room ID (required)", required: true },
      { name: "roomNumber", type: "text", placeholder: "Room Number", required: false },
      { 
        name: "category", 
        type: "select", 
        placeholder: "Select Category",
        options: ["", "STANDARD", "DELUXE", "SUITE", "PREMIUM"],
        required: false
      },
      { name: "price", type: "number", placeholder: "Price per night", required: false, min: 0 },
      { name: "occupancy", type: "number", placeholder: "Maximum Occupancy", required: false, min: 1, max: 10 },
      { name: "imagePath", type: "text", placeholder: "Image URL/Path", required: false },
      { 
        name: "status", 
        type: "select", 
        placeholder: "Room Status",
        options: ["", "AVAILABLE", "OCCUPIED", "MAINTENANCE"],
        required: false
      },
      { name: "description", type: "textarea", placeholder: "Room description", required: false }
    ],
    action: async (data) => {
      try {
        if (!data.roomId || data.roomId.trim() === '') {
          throw new Error("Room ID is required for updating");
        }
        
        // Remove empty fields
        const updateData = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => key !== "roomId" && value && value.toString().trim() !== "")
        );
        
        if (Object.keys(updateData).length === 0) {
          throw new Error("Please provide at least one field to update");
        }
        
        // Validate and convert numeric fields
        if (updateData.price) {
          const price = parseFloat(updateData.price);
          if (isNaN(price) || price <= 0) {
            throw new Error("Please enter a valid price greater than 0");
          }
          updateData.price = price;
        }
        
        if (updateData.occupancy) {
          const occupancy = parseInt(updateData.occupancy);
          if (isNaN(occupancy) || occupancy < 1 || occupancy > 10) {
            throw new Error("Occupancy must be between 1 and 10");
          }
          updateData.occupancy = occupancy;
        }
        
        // Validate room number format if provided
        if (updateData.roomNumber && !/^[a-zA-Z0-9\-]+$/.test(updateData.roomNumber.trim())) {
          throw new Error("Room number can only contain letters, numbers, and hyphens");
        }
        
        const result = await updateRoom(data.roomId.trim(), updateData);
        return [{ message: result.message || "Room updated successfully!" }];
      } catch (error) {
        throw new Error(`Failed to update room: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "deleteRoom",
    label: "Delete Room",
    icon: "🗑️",
    color: "bg-red-500 hover:bg-red-600",
    description: "Remove a room from the system",
    hasInput: true,
    inputFields: [{ name: "roomId", type: "text", placeholder: "Enter Room ID to Delete" }],
    action: async (data) => {
      try {
        if (!data.roomId || data.roomId.trim() === '') {
          throw new Error("Please enter a Room ID to delete");
        }
        
        const result = await deleteRoom(data.roomId.trim());
        return [{ message: result.message || "Room deleted successfully!" }];
      } catch (error) {
        throw new Error(`Failed to delete room: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getAllReviews",
    label: "All Reviews",
    icon: "⭐",
    color: "bg-pink-500 hover:bg-pink-600",
    description: "View all customer reviews",
    action: async () => {
      try {
        const result = await getAllReviews();
        return Array.isArray(result) ? result : result.reviews || [];
      } catch (error) {
        throw new Error(`Failed to fetch reviews: ${error.message || 'Unknown error'}`);
      }
    }
  },
  {
    id: "getReviewByUserId",
    label: "Reviews by User",
    icon: "👤",
    color: "bg-teal-500 hover:bg-teal-600",
    description: "View reviews by specific user",
    hasInput: true,
    inputFields: [{ name: "userId", type: "text", placeholder: "Enter User ID" }],
    action: async (data) => {
      try {
        if (!data.userId || data.userId.trim() === '') {
          throw new Error("Please enter a User ID");
        }
        const result = await getReviewByUserId(data.userId.trim());
        return Array.isArray(result) ? result : [result];
      } catch (error) {
        throw new Error(`Failed to fetch user reviews: ${error.message || 'Unknown error'}`);
      }
    }
  }
];

// Execute a manager action by ID
export const executeManagerAction = async (actionId, formData = {}) => {
  const action = managerActions.find(a => a.id === actionId);
  if (!action) {
    throw new Error(`Action ${actionId} not found`);
  }
  
  return await action.action(formData);
};
