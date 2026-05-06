import React from "react";
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  CodeBracketIcon,
  EyeIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user role from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = userData.role === "Admin";

  const handleNavigation = (path, isDisabled) => {
    if (!isDisabled) {
      navigate(path);
    }
  };

  return (
    <footer
      className="fixed bottom-0 left-1/2 -translate-x-1/2
      w-full lg:max-w-full bg-white border-t border-blue-900 z-50"
    >
      <div className="flex justify-around py-2 text-[11px]">
        <NavItem
          icon={<ComputerDesktopIcon className="h-6 w-6" />}
          label="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={() => handleNavigation("/dashboard", false)}
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
          onClick={() => handleNavigation("/cpudesign", !isAdmin)}
          disabled={!isAdmin}
        />

        <NavItem
          icon={<CodeBracketIcon className="h-6 w-6" />}
          label="Editor"
          active={
            location.pathname === "/editor" ||
            location.pathname === "/compare"
          }
          onClick={() => handleNavigation("/editor", false)}
          disabled={false}
        />

        <NavItem
          icon={<EyeIcon className="h-6 w-6" />}
          label="Register Viz"
          active={
            location.pathname === "/registervis" ||
            location.pathname === "/debugging"
          }
          onClick={() => handleNavigation("/registervis", false)}
          disabled={false}
        />

        <NavItem
          icon={<CircleStackIcon className="h-6 w-6" />}
          label="Memory"
          active={location.pathname === "/memory"}
          onClick={() => handleNavigation("/memory", false)}
          disabled={false}
        />
      </div>
    </footer>
  );
}

const NavItem = ({ icon, label, active, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 transition ${
        disabled 
          ? "text-gray-300 cursor-not-allowed" 
          : active 
            ? "text-blue-900" 
            : "text-gray-400 hover:text-blue-600"
      }`}
      title={disabled ? "Only Admin can access CPU Design" : ""}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {disabled && (
        <span className="text-[8px] text-red-500 ml-1">(Locked)</span>
      )}
    </button>
  );
};

export default BottomNavigation;