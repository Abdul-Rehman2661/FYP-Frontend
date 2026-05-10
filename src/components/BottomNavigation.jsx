import React, { useState, useEffect } from "react";
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  CodeBracketIcon,
  EyeIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [targetPath, setTargetPath] = useState("");
  const [targetLabel, setTargetLabel] = useState("");
  
  // Get user role from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = userData.role === "Admin";

  // Get active architecture ID from URL or localStorage
  const getActiveArchitectureId = () => {
    // First check if current URL has architecture ID
    const urlMatch = location.pathname.match(/\/(editor|registervis|debugging|compare)\/(\d+)/);
    if (urlMatch) {
      return urlMatch[2];
    }
    
    // Then check localStorage for last used architecture
    const lastArchId = localStorage.getItem("last_architecture_id");
    if (lastArchId) {
      return lastArchId;
    }
    
    return null;
  };

  // Auto-hide modal after 5 seconds (optional)
  useEffect(() => {
    if (showWarningModal) {
      const timer = setTimeout(() => {
        setShowWarningModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWarningModal]);

  const handleNavigation = (path, label, requiresArchitecture = false, isDisabled = false) => {
    // Don't navigate if disabled
    if (isDisabled) return;
    
    // Check if this path requires architecture ID
    if (requiresArchitecture) {
      const archId = getActiveArchitectureId();
      
      if (!archId) {
        // Show warning modal instead of navigating
        setTargetPath(path);
        setTargetLabel(label);
        setShowWarningModal(true);
        return;
      }
      
      // Navigate with architecture ID
      navigate(`${path}/${archId}`);
    } else {
      navigate(path);
    }
  };

  // Close modal and optionally navigate to dashboard
  const handleGoToDashboard = () => {
    setShowWarningModal(false);
    navigate("/dashboard");
  };

  return (
    <>
      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-800">No Architecture Selected</h3>
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-3">
                You need to select an architecture before accessing the <strong className="text-blue-900">{targetLabel}</strong> screen.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Please go to Dashboard and select an architecture first, or create a new architecture.
              </p>
              
              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleGoToDashboard}
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Footer */}
      <footer
        className="fixed bottom-0 left-1/2 -translate-x-1/2
        w-full lg:max-w-full bg-white border-t border-blue-900 z-50"
      >
        <div className="flex justify-around py-2 text-[11px]">
          <NavItem
            icon={<ComputerDesktopIcon className="h-6 w-6" />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => handleNavigation("/dashboard", "Dashboard", false, false)}
            disabled={false}
          />

          {/* CPU Design - Disabled for Regular Users (not admin) */}
          <NavItem
            icon={<CpuChipIcon className="h-6 w-6" />}
            label="CPU Design"
            active={
              location.pathname === "/cpudesign" ||
              location.pathname === "/register" ||
              location.pathname === "/instruction"
            }
            onClick={() => handleNavigation("/cpudesign", "CPU Design", false, !isAdmin)}
            disabled={!isAdmin}
            lockMessage="Only Admin can access CPU Design"
          />

          <NavItem
            icon={<CodeBracketIcon className="h-6 w-6" />}
            label="Editor"
            active={
              location.pathname === "/editor" ||
              location.pathname.startsWith("/editor/") ||
              location.pathname === "/compare" ||
              location.pathname.startsWith("/compare/")
            }
            onClick={() => handleNavigation("/editor", "Editor", true, false)}
            disabled={false}
          />

          <NavItem
            icon={<EyeIcon className="h-6 w-6" />}
            label="Register Viz"
            active={
              location.pathname === "/registervis" ||
              location.pathname.startsWith("/registervis/") ||
              location.pathname === "/debugging" ||
              location.pathname.startsWith("/debugging/")
            }
            onClick={() => handleNavigation("/regviz", "Register Visualization", true, false)}
            disabled={false}
          />

          <NavItem
            icon={<CircleStackIcon className="h-6 w-6" />}
            label="Memory"
            active={location.pathname === "/memory"}
            onClick={() => handleNavigation("/memory", "Memory", false, false)}
            disabled={false}
          />
        </div>
      </footer>
    </>
  );
}

const NavItem = ({ icon, label, active, onClick, disabled, lockMessage = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 transition relative group ${
        disabled 
          ? "text-gray-300 cursor-not-allowed" 
          : active 
            ? "text-blue-900" 
            : "text-gray-400 hover:text-blue-600"
      }`}
      title={disabled ? lockMessage : ""}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {disabled && (
        <span className="text-[8px] text-red-500">(Locked)</span>
      )}
      
      {/* Tooltip for disabled state */}
      {disabled && lockMessage && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
          {lockMessage}
        </div>
      )}
    </button>
  );
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default BottomNavigation;