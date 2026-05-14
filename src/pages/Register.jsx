import React, { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext.jsx";
import { toast, Toaster } from "react-hot-toast";

function Register() {
  const [flagRegister, setFlagRegister] = useState("");
  const [flagAction, setFlagAction] = useState("");
  const [flagRegisterList, setFlagRegisterList] = useState([]);
  const [addressingMode, setAddressingMode] = useState("");
  const [addressingModeCode, setAddressingModeCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [addressingModeList, setAddressingModeList] = useState([]);
  const [gpRegister, setGpRegister] = useState("");
  const [gpRegisterList, setGpRegisterList] = useState([]);
  const { setRegisterData, setAddressingModesData, architectureData } =
    useContext(ArchitectureContext);

  const navigate = useNavigate();

  // Get the maximum number of registers from architecture data
  const maxRegisters = architectureData?.noOfRegisters || 0;
  const currentTotalRegisters = flagRegisterList.length + gpRegisterList.length;

  const handleAddedFR = () => {
    if (!flagRegister || !flagAction) return;
    
    // Check if adding this flag register would exceed the limit
    if (currentTotalRegisters + 1 > maxRegisters) {
      toast.error(`Cannot add more registers. Maximum limit is ${maxRegisters} registers (${currentTotalRegisters} already added).`);
      return;
    }
    
    const newRecord = {
      name: flagRegister,
      Action: flagAction,
      isFlagRegister: true,
    };
    setFlagRegisterList([...flagRegisterList, newRecord]);
    setFlagRegister("");
    setFlagAction("");
    toast.success(`Flag Register "${flagRegister}" added. (${currentTotalRegisters + 1}/${maxRegisters} registers used)`);
  };

  // Validation for General Purpose Register
  const handleGP = () => {
    if (!gpRegister.trim()) {
      toast.error("Please enter General Purpose Register name");
      return;
    }

    // Check if adding this GP register would exceed the limit
    if (currentTotalRegisters + 1 > maxRegisters) {
      toast.error(`Cannot add more registers. Maximum limit is ${maxRegisters} registers (${currentTotalRegisters} already added).`);
      return;
    }

    // Check for duplicate GP register
    const isDuplicate = gpRegisterList.some(
      (item) => item.name.toLowerCase() === gpRegister.trim().toLowerCase(),
    );

    if (isDuplicate) {
      toast.error(`General Purpose Register "${gpRegister}" already exists`);
      return;
    }

    const newRecord = {
      name: gpRegister,
      isFlagRegister: false,
    };
    setGpRegisterList([...gpRegisterList, newRecord]);
    setGpRegister("");
    toast.success(`General Purpose Register "${gpRegister}" added. (${currentTotalRegisters + 1}/${maxRegisters} registers used)`);
  };

  // Validation for Addressing Modes
  const handleModes = () => {
    if (!addressingMode) {
      toast.error("Please select Addressing Mode");
      return;
    }

    if (!addressingModeCode) {
      toast.error("Please select Addressing Mode Code");
      return;
    }

    if (!symbol.trim()) {
      toast.error("Please enter Symbol (e.g., #, @, etc.)");
      return;
    }

    // Check for duplicate addressing mode
    const isDuplicate = addressingModeList.some(
      (item) =>
        item.mode.toLowerCase() === addressingMode.toLowerCase() &&
        item.code === addressingModeCode,
    );

    if (isDuplicate) {
      toast.error(
        `Addressing Mode "${addressingMode}" with code "${addressingModeCode}" already exists`,
      );
      return;
    }

    const newRecord = {
      mode: addressingMode,
      code: addressingModeCode,
      sym: symbol,
    };
    setAddressingModeList([...addressingModeList, newRecord]);
    setAddressingMode("");
    setAddressingModeCode("");
    setSymbol("");
    toast.success(`Addressing Mode "${addressingMode}" added successfully`);
  };

  // Validation for Next button
  const handleNext = () => {
    // Check if at least one general purpose register is added
    if (gpRegisterList.length === 0) {
      toast.error("Please add at least one General Purpose Register");
      return;
    }

    // Check if at least one addressing mode is added
    if (addressingModeList.length === 0) {
      toast.error("Please add at least one Addressing Mode");
      return;
    }

    const registerPayload = {
      flagRegisters: flagRegisterList,
      generalPurposeRegisters: gpRegisterList,
      registers: [
        ...flagRegisterList.map((reg) => ({
          ...reg,
          isFlagRegister: true,
        })),
        ...gpRegisterList.map((reg) => ({
          ...reg,
          isFlagRegister: false,
          Action: "",
        })),
      ],
    };

    setRegisterData(registerPayload);
    setAddressingModesData(addressingModeList);

    console.log("Register Data:", registerPayload);
    console.log("Addressing Modes:", addressingModeList);

    toast.success("Proceeding to next step...");
    setTimeout(() => {
      navigate("/instruction");
    }, 500);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Header />
      <div className="pt-20 lg:pt-24 pb-16">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Register Design
        </h2>
        
        {/* Show Register Limit Info */}
        {maxRegisters > 0 && (
          <div className="mx-6 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Register Limit:</span> You can add up to {maxRegisters} registers total 
              (Flag + General Purpose). Currently added: <span className="font-semibold">{currentTotalRegisters}</span>/{maxRegisters}
            </p>
          </div>
        )}

        {/* Add Register Card */}
        <div className="m-6 p-6 shadow-md rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-black font-semibold">
            <span>Add Flag Registers</span>
          </div>

          <div>
            <span className="text-black">Flag Register</span>
            <input
              value={flagRegister}
              onChange={(e) => setFlagRegister(e.target.value)}
              className="mt-2 h-8 mb-4 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
              type="text"
              placeholder="Enter Flag Register Name"
            />

            <span className="text-black">Flag Register Action</span>
            <textarea
              value={flagAction}
              onChange={(e) => setFlagAction(e.target.value)}
              className="auto-textarea h-20 mt-2 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
              placeholder="//Write Java Code here for Logic of Flag Register"
            />

            {/* Display Flag Registers */}
            {flagRegisterList.length > 0 && (
              <div className="bg-gray-100 border mt-4 rounded-sm text-sm">
                <p className="font-semibold text-blue-900 m-2">
                  Added Flag Registers ({flagRegisterList.length})
                </p>

                {flagRegisterList.map((item, index) => (
                  <div key={index} className="text-black m-2">
                    <span className="flex ">
                      <p className="text-blue-900 mr-1">Name:</p>
                      <p>{item.name}</p>
                    </span>
                    <span className="flex mb-3">
                      <p className="text-blue-900 mr-1">Action:</p>
                      <p>{item.Action}</p>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAddedFR}
              className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold hover:bg-blue-800 transition"
            >
              ADD
            </button>
          </div>
        </div>

        {/* GP Register Card */}
        <div className="m-6 p-6 shadow-md rounded-xl bg-white border border-gray-200">
          <div>
            <span className="text-black">GP Register</span>
            <input
              value={gpRegister}
              onChange={(e) => setGpRegister(e.target.value)}
              className="mt-2 mb-4 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
              type="text"
              placeholder="Enter GP Register Name"
            />
            {/* Display GP */}
            {gpRegisterList.length > 0 && (
              <div className="bg-gray-100 m-2 border rounded-sm">
                <p className="text-black text-sm m-2 font-semibold text-blue-900">
                  Added General Purpose ({gpRegisterList.length})
                </p>
                {gpRegisterList.map((item, index) => (
                  <div key={index}>
                    <span className="flex m-2 mb-3">
                      <p className="mr-1 text-sm text-blue-900">Name:</p>
                      <p className="text-black text-sm ">{item.name}</p>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleGP}
              className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg text-center font-semibold hover:bg-blue-800 transition"
            >
              ADD
            </button>
          </div>
        </div>

        {/* Addressing Mode card */}
        <div className="m-6 p-6 shadow-md rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-black font-semibold">
            <span>Add Addressing Modes</span>
          </div>

          <div>
            <span className="text-black">Addressing Mode</span>
            <select
              onChange={(e) => setAddressingMode(e.target.value)}
              value={addressingMode}
              className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                      ${addressingMode === "" ? "text-gray-500" : "text-black"}`}
            >
              <option value="">Select Addressing Mode</option>
              <option value="Direct">Direct Addressing</option>
              <option value="Indirect">Indirect Addressing</option>
              <option value="Indexed">Indexed Addressing</option>
            </select>

            <span className="text-black">Addressing Mode Code</span>
            <select
              onChange={(e) => setAddressingModeCode(e.target.value)}
              value={addressingModeCode}
              className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                      ${addressingMode === "" ? "text-gray-500" : "text-black"}`}
            >
              <option value="">Select Addressing Mode Code</option>
              <option value="00">00</option>
              <option value="01">01</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>

            <span className="text-black">Symbol</span>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="auto-textarea mt-2 pl-2 h-8 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
              type="text"
              placeholder="Enter Symbol (e.g., #, @, etc.)"
            />
            {/* Display Adressing Modes */}
            {addressingModeList.length > 0 && (
              <div className="bg-gray-100 border mt-4 rounded-sm text-sm">
                <p className="font-semibold text-blue-900 m-2">
                  Added Addressing Modes ({addressingModeList.length})
                </p>

                {addressingModeList.map((item, index) => (
                  <div
                    key={index}
                    className="text-black m-2 border-t border-gray-300 pt-2"
                  >
                    <span className="flex ">
                      <p className="text-blue-900 mr-1">Mode:</p>
                      <p>{item.mode}</p>
                    </span>
                    <span className="flex ">
                      <p className="text-blue-900 mr-1">Code:</p>
                      <p>{item.code}</p>
                    </span>
                    <span className="flex mb-3">
                      <p className="text-blue-900 mr-1">Symbol:</p>
                      <p>{item.sym}</p>
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleModes}
              className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold hover:bg-blue-800 transition"
            >
              ADD
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            className="w-full h-10 text-white bg-blue-900 rounded-lg text-center font-semibold hover:bg-blue-800 transition"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Register;