import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/outline";
import { ArchitectureContext } from "../context/ArchitectureContext";

function Debugging() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setExecutionResult } = useContext(ArchitectureContext);

  const [registerMeta, setRegisterMeta] = useState([]);
  const [registers, setRegisters] = useState([]);

  // Flag state: [Carry, Overflow, Sign, Zero] - Matches backend indices
  const [flags, setFlags] = useState([0, 0, 0, 0]);

  // Track previous flags for highlighting changes
  const [prevFlags, setPrevFlags] = useState([0, 0, 0, 0]);

  const { executionResult, userCode } = useContext(ArchitectureContext);
  const [loadingStep, setLoadingStep] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  // Flag index mapping (matches backend C# constants)
  const FLAG_INDICES = {
    CARRY: 0,
    OVERFLOW: 1,
    SIGN: 2,
    ZERO: 3,
  };

  // Flag display names and descriptions
  const flagConfig = [
    {
      name: "Carry (CF)",
      description: "Set on unsigned overflow/borrow",
      index: FLAG_INDICES.CARRY,
    },
    {
      name: "Overflow (OF)",
      description: "Set on signed overflow",
      index: FLAG_INDICES.OVERFLOW,
    },
    {
      name: "Sign (SF)",
      description: "Set when result is negative",
      index: FLAG_INDICES.SIGN,
    },
    {
      name: "Zero (ZF)",
      description: "Set when result is zero",
      index: FLAG_INDICES.ZERO,
    },
  ];

  // Helper to check if a flag changed
  const isFlagChanged = (index) => {
    return prevFlags[index] !== flags[index];
  };

  // Get flag style based on value and change status
  const getFlagStyle = (value, hasChanged) => {
    if (hasChanged) {
      return "bg-green-100 text-green-700 border-green-500 font-bold";
    }
    return value === 1
      ? "bg-blue-100 text-blue-700 border-blue-300 font-bold"
      : "bg-white text-gray-500 border-gray-200";
  };

  // Fetch register metadata from API
  useEffect(() => {
    if (!id) return;
    const fetchRegisters = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/architecture/get-full/${id}`,
        );

        const allRegisters = res.data?.Registers || [];
        // Filter only general purpose registers (IsFlagRegister === false)
        const generalRegisters = allRegisters.filter(
          (r) => r.IsFlagRegister === false,
        );

        // Sort by RegisterID
        const sortedGeneral = [...generalRegisters].sort(
          (a, b) => a.RegisterID - b.RegisterID,
        );

        setRegisterMeta(sortedGeneral);

        // Initialize registers state with values from metadata
        setRegisters(
          sortedGeneral.map((reg) => ({
            name: reg.Name,
            value: 0,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegisters();
  }, [id]);

  // Get code from location state (passed from Editor)
  useEffect(() => {
    if (location.state?.code) {
      setCode(location.state.code);
    } else {
      setCode(`; Write your assembly code in Editor Screen`);
    }
  }, [location.state]);

  const getInstructions = () => {
    return code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith(";"));
  };

  // Update flags from backend response
  const updateFlagsFromResponse = (data) => {
    const newFlags = [
      data.Flags?.[FLAG_INDICES.CARRY] ? 1 : 0, // Carry
      data.Flags?.[FLAG_INDICES.OVERFLOW] ? 1 : 0, // Overflow
      data.Flags?.[FLAG_INDICES.SIGN] ? 1 : 0, // Sign
      data.Flags?.[FLAG_INDICES.ZERO] ? 1 : 0, // Zero
    ];

    // Save previous flags for highlighting
    setPrevFlags([...flags]);
    setFlags(newFlags);
  };

  const handleStep = async () => {
    const instructions = getInstructions();

    if (step >= instructions.length) return;

    const partial = instructions.slice(0, step + 1);

    try {
      setLoadingStep(true);
      const res = await axios.post(
        `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
        partial,
      );

      const data = res.data;

      // Update general purpose registers
      setRegisters((prev) =>
        prev.map((reg, index) => ({
          ...reg,
          value:
            data.Registers?.[index] !== undefined
              ? data.Registers[index]
              : reg.value,
        })),
      );

      // Update flags with highlighting support
      updateFlagsFromResponse(data);

      // UPDATE CONTEXT WITH EXECUTION RESULT
      setExecutionResult(data);

      setOutput(JSON.stringify(data, null, 2));
      setError("");
      setStep((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data || "Execution error");
    } finally {
      setLoadingStep(false);
    }
  };

  const handleBack = async () => {
    const instructions = getInstructions();

    if (step >= instructions.length) return;

    const partial = instructions.slice(0, step - 1);

    try {
      setLoadingStep(true);
      const res = await axios.post(
        `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
        partial,
      );

      const data = res.data;

      // Update general purpose registers
      setRegisters((prev) =>
        prev.map((reg, index) => ({
          ...reg,
          value:
            data.Registers?.[index] !== undefined
              ? data.Registers[index]
              : reg.value,
        })),
      );

      // Update flags with highlighting support
      updateFlagsFromResponse(data);

      // UPDATE CONTEXT WITH EXECUTION RESULT
      setExecutionResult(data);

      setOutput(JSON.stringify(data, null, 2));
      setError("");
      setStep((prev) => prev - 1);
    } catch (err) {
      setError(err.response?.data || "Execution error");
    } finally {
      setLoadingStep(false);
    }
  };

  const handleRun = async () => {
    const instructions = getInstructions();

    try {
      setLoadingRun(true);

      const res = await axios.post(
        `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
        instructions,
      );

      const data = res.data;

      // Update general purpose registers
      setRegisters((prev) =>
        prev.map((reg, index) => ({
          ...reg,
          value:
            data.Registers?.[index] !== undefined
              ? data.Registers[index]
              : reg.value,
        })),
      );

      // Update flags with highlighting support
      updateFlagsFromResponse(data);

      // UPDATE CONTEXT WITH EXECUTION RESULT
      setExecutionResult(data);

      setOutput(JSON.stringify(data, null, 2));
      setError("");
      setStep(instructions.length);
    } catch (err) {
      setError(err.response?.data || "Execution error");
    } finally {
      setLoadingRun(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setError("");
    setOutput("");

    // Reset context as well
    setExecutionResult(null);

    // Reset general purpose registers to 0
    setRegisters((prev) =>
      prev.map((reg) => ({
        ...reg,
        value: 0,
      })),
    );

    // Reset flags to 0
    setPrevFlags([0, 0, 0, 0]);
    setFlags([0, 0, 0, 0]);
  };

  const instructions = getInstructions();
  const codeLines = code.split("\n");

    const getOutputValue = () => {
    if (!executionResult?.Registers || !registerMeta.length) return null;
    
    const generalRegisters = registerMeta.filter(r => r.IsFlagRegister === false);
    
    // Method 1: Get destination register from last instruction (if userCode is available)
    if (userCode && userCode.length > 0) {
      const lastLine = userCode[userCode.length - 1];
      const parts = lastLine.trim().split(/\s+/);
      const operands = parts.slice(1).join(' ').split(',');
      const firstOperand = operands[0]?.trim();
      
      // Check if first operand is a register
      const destRegister = generalRegisters.find(r => r.Name === firstOperand);
      if (destRegister) {
        const index = generalRegisters.findIndex(r => r.Name === firstOperand);
        if (index !== -1 && executionResult.Registers[index] !== undefined) {
          return {
            value: executionResult.Registers[index],
            register: firstOperand,
            description: `${firstOperand} = ${executionResult.Registers[index]}`
          };
        }
      }
    }
    
    // Method 2: Fallback - Get last non-zero register
    for (let i = executionResult.Registers.length - 1; i >= 0; i--) {
      if (executionResult.Registers[i] !== 0) {
        const registerName = generalRegisters[i]?.Name || `R${i+1}`;
        return {
          value: executionResult.Registers[i],
          register: registerName,
          description: `${registerName} = ${executionResult.Registers[i]}`
        };
      }
    }
    
    // Method 3: Get first register with value
    for (let i = 0; i < executionResult.Registers.length; i++) {
      if (executionResult.Registers[i] !== 0) {
        const registerName = generalRegisters[i]?.Name || `R${i+1}`;
        return {
          value: executionResult.Registers[i],
          register: registerName,
          description: `${registerName} = ${executionResult.Registers[i]}`
        };
      }
    }
    
    return null;
  };

  const outputResult = getOutputValue();

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24">
        <h2 className="text-center text-xl font-bold text-blue-900">
          Debugging
        </h2>

        <div className="p-4 bg-gray-100 pb-16 min-h-screen p-6">
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex gap-4 sm:gap-2 ">
              <button
              onClick={handleBack}
                // onClick={() =>
                //   navigate(`/editor/${id}`, { state: { code: code } })
                // }
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </button>

              <button
                onClick={handleStep}
                disabled={loadingStep || step >= instructions.length}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold disabled:opacity-50"
              >
                {loadingStep ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRightIcon className="h-4 w-4" />
                )}
                Step Forward
              </button>

              <button
                onClick={handleRun}
                disabled={loadingRun}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold disabled:opacity-50"
              >
                {loadingRun ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                Run
              </button>

              <button
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reload
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <div className="mt-5">
                <p className="text-sm text-gray-700 mb-2">Program Display</p>

                {/* CODE DISPLAY WITH LINE HIGHLIGHTING */}
                <div className="rounded-xl bg-gray-100 text-black w-full h-48 overflow-auto font-mono text-sm p-4">
                  {codeLines.map((line, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 rounded ${
                        index === step ? "bg-yellow-300" : ""
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <span className="text-gray-500 mr-2">{index + 1}.</span>
                      <span className="text-blue-900">{line || " "}</span>
                    </div>
                  ))}
                </div>
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
              {/* <div className="mt-5">
                <p className="text-sm text-gray-700 mb-2">Error Display</p>
                <div className="p-4 bg-red-100 rounded-xl bg-gray-100 w-full focus:ring-gray-300">
                  <p className="text-red-500">
                    {error || "No error Detected.."}
                  </p>
                </div>
              </div> */}

              <div className="bg-blue-50 rounded-lg p-3 mt-5 lg:w-* w-full">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Error Display
                </p>
                <div className="bg-white border rounded-md p-2 h-20 text-sm overflow-y-auto">
                  {error ? (
                    Array.isArray(error) ? (
                      error.map((e, i) => (
                        <p key={i} className="text-red-500">
                          ❌ {e}
                        </p>
                      ))
                    ) : (
                      <p className="text-red-500">❌ {error}</p>
                    )
                  ) : (
                    <p className="text-green-500"></p>
                  )}
                </div>
              </div>

              {/* UPDATED FLAG REGISTERS SECTION */}
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Flag Registers</p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {flagConfig.map((flag) => {
                      const flagValue = flags[flag.index];
                      const hasChanged = isFlagChanged(flag.index);

                      return (
                        <div key={flag.name} className="text-center">
                          <p className="text-xs text-gray-700 mb-1 font-medium">
                            {flag.name}
                          </p>
                          <div
                            className={`
                              border rounded-md py-2 text-sm font-mono transition-all duration-300
                              ${getFlagStyle(flagValue, hasChanged)}
                            `}
                          >
                            {flagValue}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 hidden md:block">
                            {flag.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full mt-6">
              <p className="text-gray-800 mb-2 font-semibold">Output / Result</p>
              <div className="border border-gray-300 rounded-lg bg-gray-100 overflow-y-auto">
                <div className="p-4">
                  {outputResult ? (
                    <div className="">
                      <div className="mb-3">
                        {/* <span className="text-gray-500 text-sm font-mono">
                          Last Affected Register: <span className="font-bold text-blue-600">{outputResult.register}</span>
                        </span> */}
                      </div>
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <span className="text-3xl font-semibold text-black">
                          {outputResult.value}
                        </span>
                        {/* <p className="text-gray-600 font-mono text-sm mt-3">
                          {outputResult.description}
                        </p> */}
                      </div>
                      
                      {/* Show last instruction details if available */}
                      {/* {executionResult?.InstructionDetails && executionResult.InstructionDetails.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-mono">
                            Last Instruction: {executionResult.InstructionDetails[executionResult.InstructionDetails.length - 1]?.AssemblyCode || "N/A"}
                          </p>
                        </div>
                      )} */}
                    </div>
                  ) : (
                    <div className="flex h-32">
                      <span className="text-gray-400 font-mono">
                        No output to display.
                      </span>
                    </div>
                  )}
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

export default Debugging;
