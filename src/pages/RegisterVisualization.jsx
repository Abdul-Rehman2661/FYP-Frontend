import { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";

function RegisterVisualization() {

  const { executionResult } = useContext(ArchitectureContext);

  const registers = executionResult?.Registers || [];
  const flags = executionResult?.Flags || [];

  return (
    <>
      <Header />
      <div className="pt-20 lg:pt-24">
        <h2 className="text-center text-xl font-bold text-blue-900 ">
          Register Visualization
        </h2>
        <div className="p-4 bg-gray-100 pb-16  min-h-screen bg-gray-50 p-6">
          {/* Outer Card */}
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Register Display */}

              <div>
                <p className="text-sm text-gray-700 mb-2">Register Display</p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {registers.map((val, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-gray-700 mb-1">
                          R{index + 1}
                        </p>
                        <div className="border rounded-md py-2 bg-white text-black text-sm">
                          {val}
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
                    {flags.map((val, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-gray-700 mb-1">F{index}</p>
                        <div className="border rounded-md py-2 bg-white text-black text-sm">
                          {val ? 1 : 0}
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
                <p className="p-4 text-gray-400 font-mono">
                  No Output to display...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default RegisterVisualization;
