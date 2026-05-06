import { useState, useEffect } from 'react';

export default function DebugPanel() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkStorage();
  }, []);

  const checkStorage = () => {
    const user = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    console.log("=== LocalStorage Debug ===");
    console.log("Raw user string:", user);
    console.log("isLoggedIn:", isLoggedIn);
    
    if (user) {
      const parsed = JSON.parse(user);
      console.log("Parsed user:", parsed);
      setUserData(parsed);
    } else {
      console.log("No user data found");
      setUserData(null);
    }
  };

  const updateUserRole = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      parsed.role = "Admin";
      localStorage.setItem("user", JSON.stringify(parsed));
      setUserData(parsed);
      alert("User role updated to Admin! Refresh the page.");
      checkStorage();
    } else {
      alert("No user data found. Please login first.");
    }
  };

  const fixUserData = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      // Ensure all required fields exist
      const fixedUser = {
        userID: parsed.userID || parsed.UserID || 1,
        email: parsed.email || parsed.Email || "user@example.com",
        role: parsed.role || parsed.Role || "User"
      };
      localStorage.setItem("user", JSON.stringify(fixedUser));
      setUserData(fixedUser);
      alert("User data fixed! Role set to: " + fixedUser.role);
      checkStorage();
    } else {
      alert("No user data found. Please login first.");
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 text-xs max-w-md">
      <h3 className="font-bold mb-2">Debug Panel</h3>
      <div className="space-y-2">
        <div>
          <strong>User Data:</strong>
          <pre className="mt-1 bg-gray-800 p-2 rounded overflow-x-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
        <div className="flex gap-2">
          <button
            onClick={updateUserRole}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Set as Admin
          </button>
          <button
            onClick={fixUserData}
            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
          >
            Fix User Data
          </button>
          <button
            onClick={checkStorage}
            className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
        <div className="text-yellow-400 text-xs">
          Tip: Click "Set as Admin" to see the floating button
        </div>
      </div>
    </div>
  );
}