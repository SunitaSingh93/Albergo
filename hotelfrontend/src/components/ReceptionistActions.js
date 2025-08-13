import { 
  getAllCustomers,
  getCustById,
  getCustomerByEmail,
  addCustomer,
  makeBooking,
  makePayment,
  cancelBooking
} from "../api/receptionist";

// Receptionist action configurations and logic
export const receptionistActions = [
  {
    id: "getAllCustomers",
    label: "All Customers",
    icon: "👥",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "View all registered customers",
    action: async () => {
      const result = await getAllCustomers();
      return Array.isArray(result) ? result : result.customers || [];
    }
  },
  {
    id: "getCustomerById",
    label: "Find Customer by ID",
    icon: "🔍",
    color: "bg-green-500 hover:bg-green-600",
    description: "Search for a customer by ID",
    hasInput: true,
    inputFields: [{ name: "customerId", type: "text", placeholder: "Enter Customer ID" }],
    action: async (data) => {
      if (!data.customerId) {
        throw new Error("Please enter a Customer ID");
      }
      const result = await getCustById(data.customerId);
      return [result];
    }
  },
  {
    id: "getCustomerByEmail",
    label: "Find Customer by Email",
    icon: "📧",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Search for a customer by email",
    hasInput: true,
    inputFields: [{ name: "email", type: "email", placeholder: "Enter Email Address" }],
    action: async (data) => {
      if (!data.email) {
        throw new Error("Please enter an email address");
      }
      const result = await getCustomerByEmail(data.email);
      return [result];
    }
  },
  {
    id: "addCustomer",
    label: "Register Customer",
    icon: "➕",
    color: "bg-indigo-500 hover:bg-indigo-600",
    description: "Register a new customer",
    hasInput: true,
    inputFields: [
      { name: "firstName", type: "text", placeholder: "First Name" },
      { name: "lastName", type: "text", placeholder: "Last Name" },
      { name: "email", type: "email", placeholder: "Email Address" },
      { name: "phone", type: "tel", placeholder: "Phone Number" },
      { name: "password", type: "password", placeholder: "Password" }
    ],
    action: async (data) => {
      const requiredFields = ["firstName", "lastName", "email", "phone", "password"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }
      
      const result = await addCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: "CUSTOMER"
      });
      return [{ message: result.message || "Customer registered successfully!" }];
    }
  },
  {
    id: "makeBooking",
    label: "Make Booking",
    icon: "🏨",
    color: "bg-yellow-500 hover:bg-yellow-600",
    description: "Create a new booking for a customer",
    hasInput: true,
    inputFields: [
      { name: "userId", type: "text", placeholder: "Customer ID" },
      { name: "roomId", type: "text", placeholder: "Room ID" },
      { name: "checkInDate", type: "date", placeholder: "Check-in Date" },
      { name: "checkOutDate", type: "date", placeholder: "Check-out Date" },
      { name: "numberOfGuests", type: "number", placeholder: "Number of Guests" }
    ],
    action: async (data) => {
      const requiredFields = ["userId", "roomId", "checkInDate", "checkOutDate", "numberOfGuests"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }
      
      const result = await makeBooking({
        userId: data.userId,
        roomId: data.roomId,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        numberOfGuests: parseInt(data.numberOfGuests)
      });
      return [{ message: result.message || "Booking created successfully!" }];
    }
  },
  {
    id: "makePayment",
    label: "Process Payment",
    icon: "💳",
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Process payment for a booking",
    hasInput: true,
    inputFields: [
      { name: "bookingId", type: "text", placeholder: "Booking ID" },
      { name: "amount", type: "number", placeholder: "Payment Amount" },
      { name: "paymentMethod", type: "select", placeholder: "Payment Method", options: ["CARD", "CASH", "UPI"] }
    ],
    action: async (data) => {
      const requiredFields = ["bookingId", "amount", "paymentMethod"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }
      
      const result = await makePayment(data.bookingId, {
        amount: parseFloat(data.amount),
        paymentMethod: data.paymentMethod
      });
      return [{ message: result.message || "Payment processed successfully!" }];
    }
  },
  {
    id: "cancelBooking",
    label: "Cancel Booking",
    icon: "❌",
    color: "bg-red-500 hover:bg-red-600",
    description: "Cancel a customer booking",
    hasInput: true,
    inputFields: [
      { name: "userId", type: "text", placeholder: "Customer ID" },
      { name: "bookingId", type: "text", placeholder: "Booking ID" }
    ],
    action: async (data) => {
      const requiredFields = ["userId", "bookingId"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }
      
      const result = await cancelBooking(data.userId, data.bookingId);
      return [{ message: result.message || "Booking cancelled successfully!" }];
    }
  }
];

// Execute a receptionist action by ID
export const executeReceptionistAction = async (actionId, formData = {}) => {
  const action = receptionistActions.find(a => a.id === actionId);
  if (!action) {
    throw new Error(`Action ${actionId} not found`);
  }
  
  return await action.action(formData);
};
