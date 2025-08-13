import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoleLayout from "../../components/RoleLayout";
import { receptionistActions, executeReceptionistAction } from "../../components/ReceptionistActions";

export default function ReceptionistDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management for receptionist operations
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "RECEPTIONIST") {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Handle action button clicks
  const handleActionClick = (action) => {
    setSelectedAction(action);
    setFormData({});
    setError("");
    setResults(null);
    
    // Execute immediately if no input is required
    if (!action.hasInput) {
      executeAction(action.id, {});
    }
  };

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAction) {
      executeAction(selectedAction.id, formData);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setSelectedAction(null);
    setFormData({});
    setError("");
    setResults(null);
  };

  // Execute receptionist actions with error handling and loading states
  const executeAction = async (actionId, data) => {
    setLoading(true);
    setError("");
    
    try {
      const result = await executeReceptionistAction(actionId, data);
      setResults(result);
      
      // Clear form data for successful operations that modify data
      if (['addCustomer', 'makeBooking', 'makePayment', 'cancelBooking'].includes(actionId)) {
        setFormData({});
        setSelectedAction(null);
      }
      
    } catch (err) {
      setError(err.message || "An error occurred while processing your request");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Custom results renderer for receptionist-specific data
  const renderResults = (results) => {
    if (results[0]?.message) {
      return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {results[0].message}
        </div>
      );
    }

    // Handle customers display
    if (results[0]?.userId || results[0]?.firstName) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Customer ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {results.map((customer, index) => (
                <tr key={customer.userId || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{customer.userId}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{customer.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {customer.role || 'CUSTOMER'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Default table rendering for other data types
    return null;
  };

  return (
    <RoleLayout 
      roleName="Receptionist"
      actions={receptionistActions}
      selectedAction={selectedAction}
      formData={formData}
      results={results}
      error={error}
      loading={loading}
      onActionClick={handleActionClick}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      renderResults={renderResults}
    />
  );
}

