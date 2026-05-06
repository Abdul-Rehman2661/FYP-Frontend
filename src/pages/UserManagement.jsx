import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  ShieldCheckIcon,
  TrashIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/Header.jsx";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/ComputerArchitectureToolkitAPI/api/auth/users",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched users:", data); // Debug log
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm("Are you sure you want to make this user an admin?")) {
      return;
    }

    setProcessingId(userId);
    setError("");
    setSuccessMessage("");

    try {
      console.log(`Making user ${userId} admin...`); // Debug log
      
      const response = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/auth/make-admin/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response status:", response.status); // Debug log
      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (response.ok) {
        setSuccessMessage(data.message || "User role updated successfully!");
        // Wait a bit before refreshing to let backend process
        setTimeout(() => {
          fetchUsers();
        }, 500);
      } else {
        setError(data.message || `Failed to update user role. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error making admin:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone!",
      )
    ) {
      return;
    }

    setProcessingId(userId);
    setError("");
    setSuccessMessage("");

    try {
      console.log(`Deleting user ${userId}...`); // Debug log
      
      const response = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/auth/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response status:", response.status); // Debug log
      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (response.ok) {
        setSuccessMessage(data.message || "User deleted successfully!");
        // Wait a bit before refreshing to let backend process
        setTimeout(() => {
          fetchUsers();
        }, 500);
      } else {
        setError(data.message || `Failed to delete user. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mt-20 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-900">
                <UserGroupIcon className="h-7 w-7" />
                User Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage all users in the system
              </p>
            </div>
            <div className="bg-blue-900 text-center px-4 w-40 py-2 rounded-lg">
              <span className="text-sm text-white">Total Users: {users.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Users List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.userID || user.UserID} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {user.email || user.Email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              (user.role || user.Role) === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role || user.Role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(user.createdOn || user.CreatedOn)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {(user.role || user.Role) !== "Admin" && (
                              <button
                                onClick={() => handleMakeAdmin(user.userID || user.UserID)}
                                disabled={processingId === (user.userID || user.UserID)}
                                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                <ShieldCheckIcon className="h-4 w-4" />
                                {processingId === (user.userID || user.UserID) ? "Processing..." : "Make Admin"}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.userID || user.UserID)}
                              disabled={processingId === (user.userID || user.UserID)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              <TrashIcon className="h-4 w-4" />
                              {processingId === (user.userID || user.UserID) ? "Processing..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}