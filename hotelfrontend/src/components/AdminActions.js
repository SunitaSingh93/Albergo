import { 
  getAllUsers, 
  getUserById, 
  getUserByEmail, 
  getUserByRole, 
  addUser, 
  updateUserDetails, 
  deleteUser 
} from "../api/admin";

// Admin action configurations and logic
export const adminActions = [
  {
    id: "getAllUsers",
    label: "Get All Users",
    icon: "👥",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "Fetch all users in the system",
    action: async () => {
      const data = await getAllUsers();
      return Array.isArray(data) ? data : data.users || [];
    }
  },
  {
    id: "getUserById",
    label: "Get User by ID",
    icon: "🔍",
    color: "bg-green-500 hover:bg-green-600",
    description: "Search for a specific user by ID",
    hasInput: true,
    inputFields: [{ name: "userId", type: "text", placeholder: "Enter User ID" }],
    action: async (data) => {
      if (!data.userId) {
        throw new Error("Please enter a User ID");
      }
      const result = await getUserById(data.userId);
      return [result];
    }
  },
  {
    id: "getUserByEmail",
    label: "Get User by Email",
    icon: "📧",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Search for a user by email address",
    hasInput: true,
    inputFields: [{ name: "email", type: "email", placeholder: "Enter Email Address" }],
    action: async (data) => {
      if (!data.email) {
        throw new Error("Please enter an email address");
      }
      const result = await getUserByEmail(data.email);
      return [result];
    }
  },
  {
    id: "getUserByRole",
    label: "Get Users by Role",
    icon: "👤",
    color: "bg-yellow-500 hover:bg-yellow-600",
    description: "Filter users by their role",
    hasInput: true,
    inputFields: [{ 
      name: "role", 
      type: "select", 
      placeholder: "Select Role",
      options: ["ADMIN", "MANAGER", "RECEPTIONIST", "CUSTOMER"]
    }],
    action: async (data) => {
      if (!data.role) {
        throw new Error("Please select a role");
      }
      const result = await getUserByRole(data.role);
      return Array.isArray(result) ? result : [result];
    }
  },
  {
    id: "addUser",
    label: "Add New User",
    icon: "➕",
    color: "bg-indigo-500 hover:bg-indigo-600",
    description: "Create a new user account",
    hasInput: true,
    inputFields: [
      { name: "firstName", type: "text", placeholder: "First Name" },
      { name: "lastName", type: "text", placeholder: "Last Name" },
      { name: "email", type: "email", placeholder: "Email Address" },
      { name: "phone", type: "tel", placeholder: "Phone Number" },
      { 
        name: "gender", 
        type: "select", 
        placeholder: "Select Gender",
        options: ["MALE", "FEMALE"]
      },
      { name: "idCard", type: "text", placeholder: "ID Card Number" },
      { name: "password", type: "password", placeholder: "Password" },
      { 
        name: "role", 
        type: "select", 
        placeholder: "Select Role",
        options: ["ADMIN", "MANAGER", "RECEPTIONIST", "CUSTOMER"]
      }
    ],
    action: async (data) => {
      const requiredFields = ["firstName", "lastName", "email", "phone", "gender", "idCard", "password", "role"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }
      
      const result = await addUser(data);
      return [{ message: result.message || "User added successfully!" }];
    }
  },
  {
    id: "updateUserDetails",
    label: "Update User",
    icon: "✏️",
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Update existing user details",
    hasInput: true,
    inputFields: [
      { name: "userId", type: "text", placeholder: "User ID (required)" },
      { name: "firstName", type: "text", placeholder: "First Name" },
      { name: "lastName", type: "text", placeholder: "Last Name" },
      { name: "email", type: "email", placeholder: "Email Address" },
      { 
        name: "role", 
        type: "select", 
        placeholder: "Select Role",
        options: ["", "ADMIN", "MANAGER", "RECEPTIONIST", "CUSTOMER"]
      }
    ],
    action: async (data) => {
      if (!data.userId) {
        throw new Error("User ID is required for updating");
      }
      
      // Remove empty fields
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value && value.trim() !== "")
      );
      
      if (Object.keys(updateData).length <= 1) {
        throw new Error("Please provide at least one field to update");
      }
      
      const result = await updateUserDetails(updateData.userId, updateData);
      return [{ message: result.message || "User updated successfully!" }];
    }
  },
  {
    id: "deleteUser",
    label: "Delete User",
    icon: "🗑️",
    color: "bg-red-500 hover:bg-red-600",
    description: "Remove a user from the system",
    hasInput: true,
    inputFields: [{ name: "userId", type: "text", placeholder: "Enter User ID to Delete" }],
    action: async (data) => {
      if (!data.userId) {
        throw new Error("Please enter a User ID to delete");
      }
      
      const result = await deleteUser(data.userId);
      return [{ message: result.message || "User deleted successfully!" }];
    }
  }
];

// Execute an admin action by ID
export const executeAdminAction = async (actionId, formData = {}) => {
  const action = adminActions.find(a => a.id === actionId);
  if (!action) {
    throw new Error(`Action ${actionId} not found`);
  }
  
  return await action.action(formData);
};
