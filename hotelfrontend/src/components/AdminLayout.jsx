import React from "react";

const AdminLayout = ({ 
  actions, 
  selectedAction, 
  formData, 
  results, 
  error, 
  loading,
  onActionClick,
  onInputChange,
  onSubmit,
  onCancel,
  user
}) => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users and system settings</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onActionClick(action)}
              className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              disabled={loading}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <div className="text-lg font-semibold mb-2">{action.label}</div>
              <div className="text-sm opacity-90">{action.description}</div>
            </button>
          ))}
        </div>

        {/* Input Form */}
        {selectedAction && selectedAction.hasInput && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-3">{selectedAction.icon}</span>
              {selectedAction.label}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              {selectedAction.inputFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.placeholder}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => onInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => onInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Execute"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Processing your request...</p>
          </div>
        )}

        {/* Results Display */}
        {results && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Results</h3>
            {results[0].message ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {results[0].message}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((user, index) => (
                      <tr key={user.userId || index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{user.userId}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'RECEPTIONIST' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
