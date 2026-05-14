import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";
import { toast, Toaster } from "react-hot-toast"; // Install: npm install react-hot-toast

export default function CpuDesign() {
  const navigate = useNavigate();

  // Form states
  const [archName, setArchName] = useState("");
  const [memorySize, setMemorySize] = useState("");
  const [busSize, setBusSize] = useState("");
  const [stackSize, setStackSize] = useState("");
  const [noOfRegisters, setNoOfRegisters] = useState("");
  const [noOfInstructions, setNoOfInstructions] = useState("");
  const { setArchitectureData } = useContext(ArchitectureContext);

  // Helper function to check if number is power of 2
  const isPowerOfTwo = (num) => {
    if (num <= 0) return false;
    return (num & (num - 1)) === 0;
  };

  // Helper function to get valid power of two numbers up to a limit
  const getValidPowerOfTwoOptions = (maxValue = 65536) => {
    const options = [];
    let value = 1;
    while (value <= maxValue) {
      options.push(value);
      value *= 2;
    }
    return options;
  };

  // Validation function
  const validateForm = () => {
    // Check Architecture Name
    if (!archName.trim()) {
      toast.error("Please enter Architecture Name");
      return false;
    }

    // Check Memory Size
    if (!memorySize) {
      toast.error("Please enter Memory Size");
      return false;
    }
    const memSize = parseInt(memorySize);
    if (isNaN(memSize) || memSize <= 0) {
      toast.error("Memory Size must be a positive number");
      return false;
    }
    if (!isPowerOfTwo(memSize)) {
      toast.error("Memory Size must be a power of 2 (2, 4, 8, 16, 32, 64, etc.)");
      return false;
    }

    // Check Bus Size
    if (!busSize) {
      toast.error("Please enter Bus Size");
      return false;
    }
    const busSizeNum = parseInt(busSize);
    if (isNaN(busSizeNum) || busSizeNum <= 0) {
      toast.error("Bus Size must be a positive number");
      return false;
    }
    if (!isPowerOfTwo(busSizeNum)) {
      toast.error("Bus Size must be a power of 2 (2, 4, 8, 16, 32, etc.)");
      return false;
    }

    // Check Stack Size
    if (!stackSize) {
      toast.error("Please enter Stack Size");
      return false;
    }
    const stackSizeNum = parseInt(stackSize);
    if (isNaN(stackSizeNum) || stackSizeNum <= 0) {
      toast.error("Stack Size must be a positive number");
      return false;
    }
    if (!isPowerOfTwo(stackSizeNum)) {
      toast.error("Stack Size must be a power of 2 (2, 4, 8, 16, 32, etc.)");
      return false;
    }

    // Check Number of Registers
    if (!noOfRegisters) {
      toast.error("Please enter Number of Registers");
      return false;
    }
    const registersNum = parseInt(noOfRegisters);
    if (isNaN(registersNum) || registersNum <= 0) {
      toast.error("Number of Registers must be a positive number");
      return false;
    }

    // Check Number of Instructions
    if (!noOfInstructions) {
      toast.error("Please enter Number of Instructions");
      return false;
    }
    const instructionsNum = parseInt(noOfInstructions);
    if (isNaN(instructionsNum) || instructionsNum <= 0) {
      toast.error("Number of Instructions must be a positive number");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      setArchitectureData({
        name: archName,
        memorySize: parseInt(memorySize),
        busSize: parseInt(busSize),
        stackSize: parseInt(stackSize),
        noOfRegisters: parseInt(noOfRegisters),
        noOfInstructions: parseInt(noOfInstructions),
      });
      navigate("/register");
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="pt-20 lg:pt-24">
        <h2 className="text-center text-xl font-bold text-blue-900 ">
          CPU Design
        </h2>
        <Header />
        <div className="p-4 bg-gray-100 mb-14 flex justify-center">
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
                    Memory Size 
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setMemorySize(e.target.value)}
                    placeholder="Enter memory size(byte)"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">
                    Must be a power of 2 (2, 4, 8, 16, 32, 64, 128...)
                  </p> */}
                </div>

                <div>
                  <label className="text-sm text-black">Bus Size</label>
                  <input
                    type="number"
                    onChange={(e) => setBusSize(e.target.value)}
                    placeholder="Enter bus size(bits)"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">
                    Must be a power of 2 (2, 4, 8, 16, 32, 64...)
                  </p> */}
                </div>

                <div>
                  <label className="text-sm text-black">
                    Stack Size
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setStackSize(e.target.value)}
                    placeholder="Enter stack size"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">
                    Must be a power of 2 (2, 4, 8, 16, 32, 64...)
                  </p> */}
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
                onClick={handleNext}
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