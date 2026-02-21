import { useState, useEffect } from "react";
import React from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import AddRegister from "../components/AddRegister.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function Memory() {
  const memoryRows = Array.from({ length: 16 }, (_, i) => `add${i + 1}`);
  const stackRows = Array.from({ length: 16 }, (_, i) => i - 1);

  return (
    <>
      <Header />
      <div className="p-4 pt-20 min-h-screen bg-gray-100 pb-16 flex justify-center">
        <div
          className="
            w-full
            bg-white
            rounded-xl
            p-4
            mt-4
            space-y-4
            lg:max-w-full
            lg:p-8
            lg:shadow
          "
        >
          <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
            Memory Visualization
          </h2>

          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-2">Memory Value</p>

            <div className="border rounded-lg p-3 bg-gray-100 overflow-x-auto">
              <div className="grid grid-cols-[60px_repeat(8,minmax(60px,1fr))] gap-2">
                {memoryRows.map((addr, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {/* Address label */}
                    <div className="text-xs text-gray-600 flex items-center">
                      {addr}
                    </div>

                    {/* 8 memory cells per row */}
                    {Array.from({ length: 8 }).map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="h-8 border rounded bg-white"
                      ></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Stack Memory Section */}
<div>
  <p className="text-sm text-gray-700 mb-2">Stack Memory</p>

  <div className="border rounded-lg p-4 bg-gray-100 flex justify-center">
    <div className="flex">
      
      {/* Stack numbers */}
      <div className="flex flex-col-reverse justify-between mr-2">
        {stackRows.map((num) => (
          <div
            key={num}
            className="text-xs text-gray-600 h-8 flex items-center justify-end"
          >
            {num}
          </div>
        ))}
      </div>

      {/* Stack boxes */}
      <div className="flex flex-col-reverse gap-1">
        {stackRows.map((num) => (
          <div
            key={num}
            className="w-20 h-8 border rounded bg-white"
          ></div>
        ))}
      </div>

    </div>
  </div>
</div>


        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default Memory;
