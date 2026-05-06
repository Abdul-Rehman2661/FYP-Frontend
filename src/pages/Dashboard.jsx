import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Debug from "../components/debug.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/solid";

function Dashboard() {
  const [architectures, setArchitectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage - NO FORCING
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("User data in Dashboard:", userData); // Debug log
    console.log("User role:", userData.role); // Debug log
    
    // REMOVE THIS FORCED ASSIGNMENT
    // if (!userData.role) {
    //   userData.role = "Admin";
    //   localStorage.setItem("user", JSON.stringify(userData));
    // }
    
    setIsAdmin(userData.role === "Admin");
    fetchArchitectures();
  }, []);

  const fetchArchitectures = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost/ComputerArchitectureToolkitAPI/api/architecture/all",
      );
      const data = await res.json();
      setArchitectures(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch architectures");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleManageUsers = () => {
    navigate("/admin/users");
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex justify-center pt-14 pb-20">
        <div className="w-full max-w-sm lg:max-w-7xl px-4 lg:px-10">
          <h2 className="text-xl text-blue-900 font-bold text-center mb-1 lg:text-2xl lg:mt-14">
            My Architectures
          </h2>

          <p className="text-center text-gray-600 mb-6 text-sm lg:text-base">
            Manage and explore your computer architecture designs
          </p>

          <div className="flex justify-between items-center p-4">
            {/* Show user role badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isAdmin ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
            }`}>
              Role: {isAdmin ? "Administrator" : "Regular User"}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="h-8 w-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : architectures.length === 0 ? (
            <p className="text-center text-red-500 mt-10">No Architecture</p>
          ) : (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
              {architectures.map((arch) => (
                <div
                  key={arch.ArchitectureID}
                  className="bg-white border rounded-xl shadow p-4 lg:p-6 lg:rounded-2xl lg:shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-900">
                      <CpuChipIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      {arch.Name}
                    </h3>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Memory:</span>{" "}
                      {arch.MemorySize}
                    </p>
                    <p>
                      <span className="font-medium">Bus:</span> {arch.BusSize}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/editor/${arch.ArchitectureID}`)}
                      className="flex-1 py-1.5 text-sm rounded bg-blue-900 text-white hover:bg-blue-800"
                    >
                      Use
                    </button>
                    
                    {/* Update Button - Disabled for Regular Users */}
                    <button
                      onClick={() => {
                        if (isAdmin) {
                          navigate(`/update/${arch.ArchitectureID}`);
                        }
                      }}
                      disabled={!isAdmin}
                      className={`flex-1 py-1.5 text-sm rounded transition ${
                        isAdmin 
                          ? "bg-blue-900 text-white hover:bg-blue-800 cursor-pointer" 
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      title={!isAdmin ? "Only Admin can update architectures" : "Update architecture"}
                    >
                      Update
                    </button>
                    
                    <button
                      onClick={() => navigate(`/detail/${arch.ArchitectureID}`)}
                      className="flex-1 py-1.5 text-sm rounded bg-blue-900 text-white hover:bg-blue-800"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Button - Only visible for Admin */}
      {isAdmin && (
        <button
          onClick={handleManageUsers}
          className="fixed bottom-24 right-6 bg-blue-900 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-50"
          title="Manage Users"
        >
          <UserGroupIcon className="h-6 w-6" />
        </button>
      )}

      <BottomNavigation />
    </>
  );
}

export default Dashboard;