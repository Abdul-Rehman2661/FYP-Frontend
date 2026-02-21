import { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/outline";

function Debugging() {
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
      <div className="p-4 pt-24 bg-gray-100 pb-16 min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow border p-6">
          <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
            Debugging
          </h2>

          <div className="flex gap-4">
            <button className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-900 hover:text-white rounded-lg border border-blue-900 text-xs rounded font-bold">
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-900 hover:text-white rounded-lg border border-blue-900 text-xs rounded font-bold">
              <ArrowRightIcon className="h-4 w-4" />
              Step
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-900 hover:text-white rounded-lg border border-blue-900 text-xs rounded font-bold">
              <PlayIcon className="h-4 w-4" />
              Run
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-900 hover:text-white rounded-lg border border-blue-900 text-xs rounded font-bold">
              <ArrowPathIcon className="h-4 w-4" />
              Reload
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <div className="mt-5">
              <p className="text-sm text-gray-700 mb-2">Program Display</p>
              <textarea
                className="p-4 rounded-xl bg-gray-100  w-full h-48 focus:ring-gray-300"
                placeholder={`LOAD R1, [0x13] 
LOAD R2, [0x0D]
ADD R1, R2
SUB R3, R1
STORE [0x00], R1
STORE [0x01], R3`}
              />
            </div>

            <div className="mt-5">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <div className="mt-5">
              <p className="text-sm text-gray-700 mb-2">Error Display</p>
              <div className="p-4 bg-red-100 rounded-xl bg-gray-100 w-full focus:ring-gray-300">
                <p className="text-red-500">No error Detected..</p>
              </div>
            </div>

            <div className="mt-4">
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
            <div className="border border-gray-300 rounded-lg h-24 w-full bg-gray-100 overflow-y-auto">
              <p className="text-gray-800 p-4 text-gray-400 font-mono">
                System Ready...
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Debugging;
