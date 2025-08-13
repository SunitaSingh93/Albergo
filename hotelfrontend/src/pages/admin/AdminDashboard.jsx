import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import { adminActions, executeAdminAction } from "../../components/AdminActions";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management for admin operations
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
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

  // Execute admin actions with error handling and loading states
  const executeAction = async (actionId, data) => {
    setLoading(true);
    setError("");
    
    try {
      const result = await executeAdminAction(actionId, data);
      setResults(result);
      
      // Update local users state if it's a get all users action
      if (actionId === 'getAllUsers') {
        setAllUsers(result);
      }
      
      // Clear form data for successful operations
      if (actionId === 'addUser' || actionId === 'updateUserDetails' || actionId === 'deleteUser') {
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

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AdminLayout 
      actions={adminActions}
      selectedAction={selectedAction}
      formData={formData}
      results={results}
      error={error}
      loading={loading}
      onActionClick={handleActionClick}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      user={user}
      logout={handleLogout}
      allUsers={allUsers}
    />
  );
}

