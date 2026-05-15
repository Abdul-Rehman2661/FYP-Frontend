import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";
import { PlayIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import axios from "axios";

function Compare() {
  const { id } = useParams();

  const [saveFile1, setSaveFile1] = useState(false);
  const [saveFile2, setSaveFile2] = useState(false);
  const [openFile1, setOpenFile1] = useState(false);
  const [openFile2, setOpenFile2] = useState(false);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");

  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);

  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingRun2, setLoadingRun2] = useState(false);

  // Register metadata for both programs
  const [registerMeta, setRegisterMeta] = useState([]);

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegisters();
  }, [id]);

  // Helper to get flag value from response
  const getFlagsFromResponse = (data) => {
    if (!data) return [0, 0, 0, 0];
    return [
      data.Flags?.[FLAG_INDICES.CARRY] ? 1 : 0,
      data.Flags?.[FLAG_INDICES.OVERFLOW] ? 1 : 0,
      data.Flags?.[FLAG_INDICES.SIGN] ? 1 : 0,
      data.Flags?.[FLAG_INDICES.ZERO] ? 1 : 0,
    ];
  };

  // Helper to get registers from response
  const getRegistersFromResponse = (data) => {
    if (!data || !data.Registers) return [];
    return data.Registers;
  };

  // Get output value (last affected register)
  const getOutputValue = (result, userCode) => {
    if (!result?.Registers || !registerMeta.length) return null;

    const generalRegisters = registerMeta.filter(
      (r) => r.IsFlagRegister === false,
    );

    // Try to get from last instruction if code is available
    if (userCode && userCode.length > 0) {
      const lastLine = userCode[userCode.length - 1];
      const parts = lastLine.trim().split(/\s+/);
      const operands = parts.slice(1).join(" ").split(",");
      const firstOperand = operands[0]?.trim();

      const destRegister = generalRegisters.find(
        (r) => r.Name === firstOperand,
      );
      if (destRegister) {
        const index = generalRegisters.findIndex(
          (r) => r.Name === firstOperand,
        );
        if (index !== -1 && result.Registers[index] !== undefined) {
          return {
            value: result.Registers[index],
            register: firstOperand,
            description: `${firstOperand} = ${result.Registers[index]}`,
          };
        }
      }
    }

    // Fallback: Get last non-zero register
    for (let i = result.Registers.length - 1; i >= 0; i--) {
      if (result.Registers[i] !== 0) {
        const registerName = generalRegisters[i]?.Name || `R${i + 1}`;
        return {
          value: result.Registers[i],
          register: registerName,
          description: `${registerName} = ${result.Registers[i]}`,
        };
      }
    }

    return null;
  };

  // Execute API
  const runProgram = async (code, setError, setResult, setLoading) => {
    try {
      setLoading(true);
      setError(null);

      const codeArray = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith(";"));

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/execution/execute/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(codeArray),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data)) {
          setError(data);
        } else if (data?.Errors) {
          setError(data.Errors);
        } else {
          setError("Execution failed");
        }
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Execution failed");
    } finally {
      setLoading(false);
    }
  };

  // Extract data for program 1
  const registers1 = getRegistersFromResponse(result1);
  const flags1 = getFlagsFromResponse(result1);
  const outputResult1 = getOutputValue(
    result1,
    code1.split("\n").filter((line) => line.trim() && !line.startsWith(";")),
  );

  // Extract data for program 2
  const registers2 = getRegistersFromResponse(result2);
  const flags2 = getFlagsFromResponse(result2);
  const outputResult2 = getOutputValue(
    result2,
    code2.split("\n").filter((line) => line.trim() && !line.startsWith(";")),
  );

  // Calculate clock cycles (based on number of instructions executed or step count)
  const getClockCycles = (result) => {
    if (!result) return 0;
    // If backend returns cycle count, use it; otherwise use instruction count
    return result.CycleCount || result.InstructionsExecuted || 0;
  };

  const cycleCount1 = getClockCycles(result1);
  const cycleCount2 = getClockCycles(result2);

  // Get flag style
  const getFlagStyle = (value) => {
    return value === 1
      ? "bg-blue-100 text-blue-700 border-blue-300 font-bold"
      : "bg-white text-gray-500 border-gray-200";
  };

  // Get register display for program 1
  const renderRegisters = (registers, programName) => {
    if (!registerMeta.length) return null;

    return (
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {programName} Registers
        </p>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-2">
            {registerMeta.map((reg, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-700 mb-1">{reg.Name}</p>
                <div className="border rounded-md py-2 bg-white text-black text-sm">
                  {registers[index] !== undefined ? registers[index] : 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Get flag display
  const renderFlags = (flags, programName) => {
    return (
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {programName} Flag Registers
        </p>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flagConfig.map((flag) => {
              const flagValue = flags[flag.index];
              return (
                <div key={flag.name} className="text-center">
                  <p className="text-xs text-gray-700 mb-1 font-medium">
                    {flag.name}
                  </p>
                  <div
                    className={`
                      border rounded-md py-2 text-sm font-mono transition-all duration-300
                      ${getFlagStyle(flagValue)}
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
    );
  };

  // Get output display
  const renderOutput = (outputResult, programName) => {
    if (!outputResult) return null;

    return (
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {programName} Output
        </p>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Result:</span>
            <span className="text-2xl font-bold text-blue-900">
              {outputResult.value}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Register:</span>{" "}
            {outputResult.register}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24">
        <h2 className="text-blue-900 font-bold text-center mb-1 text-2xl">
          Compare Editor
        </h2>

        <div className="min-h-screen bg-gray-100">
          <div className="w-full mb-8 rounded-xl p-5 space-y-4 lg:max-w-full lg:shadow">
            {/* Buttons for Program A and Program B */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-2">
              {/* Program A Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenFile1(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-white bg-blue-900 text-xs rounded hover:bg-blue-800 transition"
                  >
                    <FolderOpenIcon className="h-4 w-4" />
                    Open A
                  </button>
                  <button
                    onClick={() => runProgram(code1, setError1, setResult1, setLoadingRun)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                  >
                    {loadingRun ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                    Run A
                  </button>
                </div>
              </div>

              {/* Program B Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenFile2(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-white bg-blue-900 text-xs rounded hover:bg-blue-800 transition"
                  >
                    <FolderOpenIcon className="h-4 w-4" />
                    Open B
                  </button>
                  <button
                    onClick={() => runProgram(code2, setError2, setResult2, setLoadingRun2)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                  >
                    {loadingRun2 ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                    Run B
                  </button>
                </div>
              </div>
            </div>

            {/* Open File Modals */}
            {openFile1 && (
              <OpenFile
                architectureId={id}
                onSelect={(fileCode) => {
                  setCode1(fileCode);
                  setOpenFile1(false);
                }}
                onClose={() => setOpenFile1(false)}
              />
            )}
            {openFile2 && (
              <OpenFile
                architectureId={id}
                onSelect={(fileCode) => {
                  setCode2(fileCode);
                  setOpenFile2(false);
                }}
                onClose={() => setOpenFile2(false)}
              />
            )}

            {/* Save File Modals */}
            {saveFile1 && (
              <SaveFile
                code={code1}
                architectureId={id}
                onClose={() => setSaveFile1(false)}
              />
            )}
            {saveFile2 && (
              <SaveFile
                code={code2}
                architectureId={id}
                onClose={() => setSaveFile2(false)}
              />
            )}

            {/* Editors - side by side */}
            <div className="grid grid-cols-2 gap-2 border rounded-lg bg-gray-100 p-3 text-sm font-mono text-gray-500">
              <div>
                <p className="text-xs text-gray-600 mb-1 font-semibold">
                  Program A
                </p>
                <textarea
                  value={code1}
                  onChange={(e) => setCode1(e.target.value)}
                  className="p-3 rounded-xl bg-white w-full h-64 text-black font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="; Write Program A here"
                />
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1 font-semibold">
                  Program B
                </p>
                <textarea
                  value={code2}
                  onChange={(e) => setCode2(e.target.value)}
                  className="p-3 rounded-xl bg-white w-full h-64 text-black font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="; Write Program B here"
                />
              </div>
            </div>

            {/* Errors - side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Error Display - Program A
                </p>
                <div className="bg-white border rounded-md p-2 h-24 overflow-y-auto text-sm">
                  {error1 ? (
                    Array.isArray(error1) ? (
                      error1.map((e, i) => (
                        <p key={i} className="text-red-500">
                          ❌ {e}
                        </p>
                      ))
                    ) : (
                      <p className="text-red-500">❌ {error1}</p>
                    )
                  ) : (
                    <p className="text-green-500">✓ No Errors</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Error Display - Program B
                </p>
                <div className="bg-white border rounded-md p-2 h-24 overflow-y-auto text-sm">
                  {error2 ? (
                    Array.isArray(error2) ? (
                      error2.map((e, i) => (
                        <p key={i} className="text-red-500">
                          ❌ {e}
                        </p>
                      ))
                    ) : (
                      <p className="text-red-500">❌ {error2}</p>
                    )
                  ) : (
                    <p className="text-green-500">✓ No Errors</p>
                  )}
                </div>
              </div>
            </div>

            {/* Clock Cycles - side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="bg-white border flex justify-between rounded-md p-3 text-sm font-semibold">
                  <p className="text-black">Clock Cycles - Program A:</p>
                  <p className="text-blue-900 font-bold text-lg">
                    {cycleCount1}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="bg-white border flex justify-between rounded-md p-3 text-sm font-semibold">
                  <p className="text-black">Clock Cycles - Program B:</p>
                  <p className="text-blue-900 font-bold text-lg">
                    {cycleCount2}
                  </p>
                </div>
              </div>
            </div>

            {/* Registers Display - side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3 border">
                {renderRegisters(registers1, "Program A")}
              </div>
              <div className="bg-white rounded-lg p-3 border">
                {renderRegisters(registers2, "Program B")}
              </div>
            </div>

            {/* Flag Registers Display - side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3 border">
                {renderFlags(flags1, "Program A")}
              </div>
              <div className="bg-white rounded-lg p-3 border">
                {renderFlags(flags2, "Program B")}
              </div>
            </div>

            {/* Output/Result Display - side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3 border">
                {renderOutput(outputResult1, "Program A")}
                {!outputResult1 && result1 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">No output value</p>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-3 border">
                {renderOutput(outputResult2, "Program B")}
                {!outputResult2 && result2 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">No output value</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default Compare;