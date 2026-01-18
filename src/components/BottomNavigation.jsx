import React from "react";
import {
  Squares2X2Icon,
  CpuChipIcon,
  CodeBracketIcon,
  EyeIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNavigation() {
   const navigate = useNavigate();
  const location = useLocation();
  return (
    <footer
      className="fixed bottom-0 left-1/2 -translate-x-1/2
      w-full max-w-[420px] bg-white border-t"
    >
      <div className="flex justify-around py-2 text-[11px]">

        <NavItem
          icon={<Squares2X2Icon className="h-6 w-6" />}
          label="Dashboard"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />

        <NavItem
          icon={<CpuChipIcon className="h-6 w-6" />}
          label="CPU Design"
          active={location.pathname === "/cpudesign"}
          onClick={() => navigate("/cpudesign")}
        />

        <NavItem
          icon={<CodeBracketIcon className="h-6 w-6" />}
          label="Editor"
          active={location.pathname === "/editor"}
          onClick={() => navigate("/editor")}
        />

        <NavItem
          icon={<EyeIcon className="h-6 w-6" />}
          label="Register Viz"
        />

        <NavItem
          icon={<CircleStackIcon className="h-6 w-6" />}
          label="Memory"
        />

      </div>
    </footer>
  );
}

const NavItem = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition ${
        active ? "text-blue-900" : "text-gray-400"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};


export default BottomNavigation;
