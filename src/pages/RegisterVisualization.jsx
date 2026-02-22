import { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";

function RegisterVisualization() {
  const registers = [
    { name: "R1", value: 0 },
    { name: "R2", value: 9 },
    { name: "R3", value: 5 },
    { name: "R4", value: 9 },
    { name: "R5", value: 0 },
    { name: "PC", value: 6 },
    { name: "SP", value: 0 },
    { name: "IR", value: 6 },
  ];

  const flags = [
    { name: "Carry", value: 0 },
    { name: "Overflow", value: 0 },
    { name: "Sign", value: 0 },
    { name: "Zero", value: 0 },
  ];

  return (
    <>
      <Header />
      <div className="p-4 pt-24 bg-gray-100 pb-16  min-h-screen bg-gray-50 p-6">
        {/* Outer Card */}
        <div className="bg-white rounded-xl shadow border p-6">
          {/* Title */}
          <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
            Register Visualization
          </h2>

          {/* Two Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Register Display */}
            <div>
              <p className="text-sm text-gray-700 mb-2">Register Display</p>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-4">
                  {registers.map((reg, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-gray-700 mb-1">{reg.name}</p>
                      <div className="border rounded-md py-2 bg-white text-black text-sm">
                        {reg.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flag Registers */}
            <div>
              <p className="text-sm text-gray-700 mb-2">Flag Registers</p>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-4">
                  {flags.map((flag, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-gray-700 mb-1">{flag.name}</p>
                      <div className="border rounded-md py-2 bg-white text-black text-sm">
                        {flag.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full">
            <p className="text-gray-800 pt-8 mb-2">Output</p>
            <div className="border border-gray-300 rounded-lg h-48 w-full bg-gray-100 overflow-y-auto">
              <p className="p-4 text-gray-400 font-mono">No Output to display...</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default RegisterVisualization;
