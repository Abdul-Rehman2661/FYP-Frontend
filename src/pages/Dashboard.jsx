import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Debug from "./Debugging.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, XMarkIcon, TrashIcon, HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";

function Dashboard() {
  const [architectures, setArchitectures] = useState([]);
  const [filteredArchitectures, setFilteredArchitectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [architectureToDelete, setArchitectureToDelete] = useState(null);
  const [favouriteLoading, setFavouriteLoading] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Full user data from localStorage:", userData);
    
    // Use userID (lowercase d) as per your localStorage structure
    const userId = userData.userID; // Changed from UserID to userID
    
    console.log("Extracted UserID:", userId);
    console.log("User role:", userData.role);

    setIsAdmin(userData.role === "Admin");
    
    // Set current user with the correct ID
    const user = {
      ...userData,
      UserID: userId  // Store it as UserID for consistency in the component
    };
    
    setCurrentUser(user);
    
    if (userId) {
      fetchArchitectures(userId);
    } else {
      console.warn("No userID found in localStorage. Favourites feature disabled.");
      fetchArchitectures();
    }
  }, []);

  useEffect(() => {
    filterAndSortArchitectures();
  }, [searchQuery, architectures]);

  const fetchArchitectures = async (userId = null) => {
    try {
      setLoading(true);
      
      // Fetch all architectures
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/architecture/all`,
      );
      const allArchitectures = await res.json();
      
      // If user is logged in, fetch their favourites
      if (userId) {
        try {
          console.log("Fetching favourites for userId:", userId);
          const favRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/architecture/user/${userId}/favourites`
          );
          
          if (favRes.ok) {
            const favouriteArchitectures = await favRes.json();
            console.log("Favourite architectures:", favouriteArchitectures);
            
            // Mark favourite architectures
            const architecturesWithFavourites = allArchitectures.map(arch => ({
              ...arch,
              IsFavourite: favouriteArchitectures.some(fav => fav.ArchitectureID === arch.ArchitectureID)
            }));
            
            setArchitectures(architecturesWithFavourites);
          } else {
            console.error("Failed to fetch favourites:", favRes.status);
            setArchitectures(allArchitectures.map(arch => ({ ...arch, IsFavourite: false })));
          }
        } catch (err) {
          console.error("Error fetching favourites:", err);
          setArchitectures(allArchitectures.map(arch => ({ ...arch, IsFavourite: false })));
        }
      } else {
        setArchitectures(allArchitectures.map(arch => ({ ...arch, IsFavourite: false })));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch architectures");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArchitectures = () => {
    let filtered = [...architectures];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(arch => 
        arch.Name.toLowerCase().includes(query) ||
        arch.BusSize.toString().toLowerCase().includes(query) ||
        arch.MemorySize.toString().toLowerCase().includes(query)
      );
    }

    // Sort: Favourites first, then by name
    filtered.sort((a, b) => {
      if (a.IsFavourite && !b.IsFavourite) return -1;
      if (!a.IsFavourite && b.IsFavourite) return 1;
      return a.Name.localeCompare(b.Name);
    });

    setFilteredArchitectures(filtered);
  };

  const handleFavouriteToggle = async (architectureId, currentFavouriteStatus) => {
    // Check if user is logged in and has UserID
    if (!currentUser || !currentUser.UserID) {
      console.error("Cannot add favourite: No user logged in. Current user:", currentUser);
      alert("Please login to add favourites. Make sure you are logged in properly.");
      return;
    }

    console.log("Toggling favourite for:", {
      userId: currentUser.UserID,
      architectureId,
      currentStatus: currentFavouriteStatus,
      newStatus: !currentFavouriteStatus
    });

    setFavouriteLoading(architectureId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/architecture/${architectureId}/isfavourite`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserID: currentUser.UserID,
            IsFavourite: !currentFavouriteStatus
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Update local state
        setArchitectures(prevArchitectures =>
          prevArchitectures.map(arch =>
            arch.ArchitectureID === architectureId
              ? { ...arch, IsFavourite: !currentFavouriteStatus }
              : arch
          )
        );
        console.log("Favourite toggled successfully:", result.message);
      } else {
        console.error("Failed to toggle favourite:", result);
        alert(result.message || "Failed to update favourite");
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
      alert("An error occurred while updating favourites");
    } finally {
      setFavouriteLoading(null);
    }
  };

  const handleDeleteClick = (arch) => {
    setArchitectureToDelete(arch);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!architectureToDelete) return;
    
    setDeleteLoading(architectureToDelete.ArchitectureID);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/architecture/delete/${architectureToDelete.ArchitectureID}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const result = await response.json();

      if (response.ok) {
        setArchitectures(prevArchitectures => 
          prevArchitectures.filter(arch => arch.ArchitectureID !== architectureToDelete.ArchitectureID)
        );
        alert(result.message || "Architecture deleted successfully");
      } else {
        alert(result.message || "Failed to delete architecture");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the architecture");
    } finally {
      setDeleteLoading(null);
      setShowConfirmModal(false);
      setArchitectureToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setArchitectureToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleManageUsers = () => {
    navigate("/admin/users");
  };

  const clearSearch = () => {
    setSearchQuery("");
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
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
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

          {/* Show user info for debugging */}
          {/* {currentUser && currentUser.UserID && (
            <div className="text-xs text-gray-500 text-center mb-2">
              Logged in as User ID: {currentUser.UserID} ({currentUser.email})
            </div>
          )} */}

          {/* Single Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, bus size, or memory size..."
                className="block bg-white text-black w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {/* <p className="text-xs text-gray-500 mt-2">
              Try searching by: "Pentium", "32", "64MB", etc.
            </p> */}
          </div>

          {/* Results Count */}
          {/* {!loading && architectures.length > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              Found {filteredArchitectures.length} of {architectures.length} architectures
              {searchQuery && (
                <span className="ml-2 text-blue-600">
                  matching "{searchQuery}"
                </span>
              )}
              {filteredArchitectures.some(a => a.IsFavourite) && (
                <span className="ml-2 text-red-500">
                  ❤️ Favourites shown first
                </span>
              )}
            </div>
          )} */}

          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="h-8 w-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredArchitectures.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-red-500">No architectures match your search</p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
              {filteredArchitectures.map((arch) => (
                <div
                  key={arch.ArchitectureID}
                  className="bg-white border rounded-xl shadow p-4 lg:p-6 lg:rounded-2xl lg:shadow-sm relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-900">
                        <CpuChipIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900">
                        {arch.Name}
                      </h3>
                    </div>
                    
                    {/* Heart Icon for Favourites */}
                    <button
                      onClick={() => handleFavouriteToggle(arch.ArchitectureID, arch.IsFavourite)}
                      disabled={favouriteLoading === arch.ArchitectureID}
                      className="focus:outline-none transition-transform hover:scale-110"
                      title={arch.IsFavourite ? "Remove from favourites" : "Add to favourites"}
                    >
                      {favouriteLoading === arch.ArchitectureID ? (
                        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : arch.IsFavourite ? (
                        <SolidHeartIcon className="w-6 h-6 text-red-500" />
                      ) : (
                        <OutlineHeartIcon className="w-6 h-6 text-gray-400 hover:text-red-500" />
                      )}
                    </button>
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
                      title={
                        !isAdmin
                          ? "Only Admin can update architectures"
                          : "Update architecture"
                      }
                    >
                      Update
                    </button>

                    <button
                      onClick={() => navigate(`/detail/${arch.ArchitectureID}`)}
                      className="flex-1 py-1.5 text-sm rounded bg-blue-900 text-white hover:bg-blue-800"
                    >
                      Details
                    </button>

                    {/* Delete Icon Button - Only visible for Admin */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteClick(arch)}
                        disabled={deleteLoading === arch.ArchitectureID}
                        className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed"
                        title="Delete architecture"
                      >
                        {deleteLoading === arch.ArchitectureID ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {showConfirmModal && architectureToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete the architecture:
            </p>
            <p className="font-semibold text-blue-900 mb-4">
              "{architectureToDelete.Name}"?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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