import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  ShieldCheckIcon,
  TrashIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/Header.jsx";
import { toast, Toaster } from "react-hot-toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId) => {
    setProcessingId(userId);

    try {
      console.log(`Making user ${userId} admin...`);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/make-admin/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        toast.success(data.message || "User role updated to Admin successfully!");
        setTimeout(() => {
          fetchUsers();
        }, 500);
      } else {
        toast.error(data.message || `Failed to update user role. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error making admin:", err);
      toast.error("Network error. Please check if the server is running.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleMakeUser = async (userId) => {
    setProcessingId(userId);

    try {
      console.log(`Making user ${userId} regular user...`);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/make-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        toast.success(data.message || "Admin role updated to User successfully!");
        setTimeout(() => {
          fetchUsers();
        }, 500);
      } else {
        toast.error(data.message || `Failed to update user role. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error making user:", err);
      toast.error("Network error. Please check if the server is running.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm">Are you sure you want to delete this user? This action cannot be undone!</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDeleteUser(userId);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
  };

  const confirmDeleteUser = async (userId) => {
    setProcessingId(userId);

    try {
      console.log(`Deleting user ${userId}...`);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        toast.success(data.message || "User deleted successfully!");
        setTimeout(() => {
          fetchUsers();
        }, 500);
      } else {
        toast.error(data.message || `Failed to delete user. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Network error. Please check if the server is running.");
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
                            {(user.role || user.Role) === "Admin" ? (
                              <button
                                onClick={() => handleMakeUser(user.userID || user.UserID)}
                                disabled={processingId === (user.userID || user.UserID)}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                <UserIcon className="h-4 w-4" />
                                {processingId === (user.userID || user.UserID) ? "Processing..." : "Make User"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMakeAdmin(user.userID || user.UserID)}
                                disabled={processingId === (user.userID || user.UserID)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-900 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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