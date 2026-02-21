import React from "react";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import BackButton from "../components/BackButton.jsx";


const Header = () => {
  return (
    <header
      className="
    fixed top-0 left-1/2 -translate-x-1/2
    w-full lg:max-w-full
    bg-blue-900 px-4 py-3 lg:py-5
    flex items-center justify-center gap-2
    z-50
  "
    >
      <BackButton />
      <CpuChipIcon className="h-5 w-5 text-white" />

      <h3 className="text-white text-sm font-semibold lg:text-lg">
        Computer Architecture Tool Kit
      </h3>
    </header>

  );
};

export default Header;
