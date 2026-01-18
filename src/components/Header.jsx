import React from "react";

const Header = () => {
  return (
<header className="
  fixed top-0 left-1/2 -translate-x-1/2
  w-full max-w-[420px]
  bg-blue-900 px-4 py-3
  flex items-center justify-center gap-2
  z-50
">

      <img src="../public//vector.svg" alt="logo" className="w-5 h-5" />
      <h3 className="text-white text-sm font-semibold">
        Computer Architecture Tool Kit
      </h3>
    </header>
  );
};

export default Header;
