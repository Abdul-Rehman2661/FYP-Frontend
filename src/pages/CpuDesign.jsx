import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function CpuDesign() {
  const navigate = useNavigate();

  // Form states
  const [archName, setArchName] = useState("");
  const [memorySize, setMemorySize] = useState("");
  const [busSize, setBusSize] = useState("");
  const [stackSize, setStackSize] = useState("");
  const [noOfRegisters, setNoOfRegisters] = useState("");
  const [noOfInstructions, setNoOfInstructions] = useState("");

  return (
    <>
      <div className="pt-20 lg:pt-24">
        <h2 className="text-center text-xl font-bold text-blue-900 ">
          CPU Design
        </h2>
        <Header />
        <div className="p-4  bg-gray-100 mb-14 flex justify-center">
          <div
            className="
            w-full
            bg-white
            rounded-xl
            p-4
            space-y-4
            lg:max-w-full
            lg:p-8
            lg:shadow
          "
          >
            <form
              className="space-y-4 lg:space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="text-sm text-black">Architecture Name</label>
                <input
                  type="text"
                  onChange={(e) => setArchName(e.target.value)}
                  placeholder="Enter architecture name"
                  className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                    focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                <div>
                  <label className="text-sm text-black">
                    Memory Size (bytes)
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setMemorySize(e.target.value)}
                    placeholder="Enter memory size"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-black">Bus Size (bits)</label>
                  <input
                    type="number"
                    onChange={(e) => setBusSize(e.target.value)}
                    placeholder="Enter bus size"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-black">
                    Stack Size (bytes)
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setStackSize(e.target.value)}
                    placeholder="Enter stack size"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-black">No of Registers</label>
                  <input
                    type="number"
                    onChange={(e) => setNoOfRegisters(e.target.value)}
                    placeholder="Enter no of Registers"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-black">
                    No of Instructions
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setNoOfInstructions(e.target.value)}
                    placeholder="Enter no of Instruction"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full mt-6 bg-blue-900 text-white py-2 rounded-md
                text-sm font-semibold hover:bg-blue-800 transition"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
