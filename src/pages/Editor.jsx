import { useState, useContext, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";
import {
  PlayIcon,
  ArrowPathIcon,
  FolderOpenIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { ArchitectureContext } from "../context/ArchitectureContext";
import CycleAnimationScreen from "./CycleAnimation.jsx";
import { calculateCountCycle } from "../utils/countCycle.js";
import { buildCycleAnimationTrace } from "../utils/cycleAnimationTrace.js";

function Editor() {
  const {
    setExecutionResult,
    setArchitectureData,
    architectureData,
    saveCodeForArchitecture,
    loadCodeForArchitecture,
    savedCode,
  } = useContext(ArchitectureContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [saveFile, setSaveFile] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [code, setCode] = useState();
  const [error, setError] = useState(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingArchitecture, setLoadingArchitecture] = useState(true);

  const [showAnimation, setShowAnimation] = useState(false);
  const [cycleTrace, setCycleTrace] = useState([]);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  // Count Cycle states
  const [loadingCycle, setLoadingCycle] = useState(false);
  const [cycleResult, setCycleResult] = useState(null);
  const [cycleError, setCycleError] = useState(null);
  const [showCycleResult, setShowCycleResult] = useState(false);

  useEffect(() => {
    if (id) {
      const savedCodeFromStorage = loadCodeForArchitecture(id);
      if (savedCodeFromStorage) {
        setCode(savedCodeFromStorage);
      } else {
        // Set default template code
        setCode();
      }
    }
  }, [id]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (id) {
      saveCodeForArchitecture(id, newCode);
    }
  };
  // Fetch architecture data when component mounts
  useEffect(() => {
    const fetchArchitecture = async () => {
      try {
        // Always fetch fresh data to ensure memory size is correct
        const response = await fetch(
          `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/get-full/${id}`,
        );
        const data = await response.json();

        // Set architecture data in context
        const archData = {
          memorySize: data?.Architecture?.MemorySize || 0,
          stackSize: data?.Architecture?.StackSize || 0,
          busSize: data?.Architecture?.BusSize || 0,
          name: data?.Architecture?.Name || "",
        };

        setArchitectureData(archData);
        setLoadingArchitecture(false);
      } catch (err) {
        console.error("Failed to fetch architecture:", err);
        setError(["Failed to load architecture data"]);
        setLoadingArchitecture(false);
      }
    };

    if (id) {
      fetchArchitecture();
    }
  }, [id, setArchitectureData]);

const handleRun = async () => {
  if (!code?.trim()) {
    setError(["Please enter some code to execute"]);
    return;
  }

  try {
    setLoadingRun(true);
    setError(null);

    const codeArray = code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith(";"));

    const res = await fetch(
      `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        setError(["Execution failed"]);
      }
      return;
    }

    setExecutionResult(data);
    saveCodeForArchitecture(id, code);

    // EXTRACT THE ACTUAL RESULT FROM REGISTER CHANGES
    let simpleOutput = "";
    
    // Parse the instruction to know which register to read
    const firstLine = codeArray[0];
    const parts = firstLine.split(/\s+/);
    const mnemonic = parts[0].toUpperCase();
    const destRegister = parts[1]?.replace(',', '');
    
    // Check if response contains updated register values
    if (data.registers && destRegister) {
      // Get the updated value of destination register
      const updatedValue = data.registers[destRegister];
      if (updatedValue !== undefined) {
        simpleOutput = String(updatedValue);
      }
    }
    // Check if response contains results array
    else if (data.results && Array.isArray(data.results)) {
      simpleOutput = data.results[0];
    }
    // Check if response contains direct result
    else if (data.result !== undefined) {
      simpleOutput = String(data.result);
    }
    // Check if response contains output
    else if (data.output) {
      simpleOutput = data.output;
    }
    // Fallback
    else {
      simpleOutput = "No result available";
    }

    navigate(`/regviz/${id}`, { 
      state: { 
        executionOutput: simpleOutput,
        code: code,
        registers: data.registers // Pass registers for visualization
      } 
    });
    
  } catch (err) {
    console.error(err);
    setError(["Execution failed: " + err.message]);
  } finally {
    setLoadingRun(false);
  }
};

  const handleCountCycle = async () => {
    setShowCycleResult(true);
    if (!code?.trim()) {
      setError(["Please enter some code to analyze"]);
      return;
    }

    try {
      setLoadingCycle(true);
      setCycleError(null);

      // Fetch instructions for this architecture
      const response = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/get-full/${id}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch architecture instructions");
      }

      // Prepare architecture object with instructions
      const selectedArchitecture = {
        ...architectureData,
        ArchitectureID: id,
        Instructions: data?.Instructions || data?.instructions || [],
      };

      // Calculate cycles
      const cycleResult = calculateCountCycle(code, selectedArchitecture);
      setCycleResult(cycleResult);
    } catch (err) {
      console.error("Cycle calculation error:", err);
      setCycleError(err.message || "Failed to calculate cycles");
    } finally {
      setLoadingCycle(false);
    }
  };

  const handleAnimation = async () => {
    if (!code?.trim()) {
      setError(["Please enter some code to animate"]);
      return;
    }

    try {
      setLoadingAnimation(true);
      setError(null);

      // First, parse the code into array format for execution
      const codeArray = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith(";"));

      // Step 1: Execute the program to get actual execution results with flags
      const executionResponse = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(codeArray),
        },
      );

      const executionData = await executionResponse.json();

      if (!executionResponse.ok) {
        if (Array.isArray(executionData)) {
          throw new Error(executionData.join("\n"));
        } else if (executionData?.Errors) {
          throw new Error(executionData.Errors.join("\n"));
        } else {
          throw new Error("Execution failed");
        }
      }

      // Step 2: Fetch architecture with instructions for cycle counting
      const archResponse = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/get-full/${id}`,
      );
      const archData = await archResponse.json();

      if (!archResponse.ok) {
        throw new Error("Failed to fetch architecture instructions");
      }

      // Step 3: Prepare architecture object
      const selectedArchitecture = {
        ...architectureData,
        ArchitectureID: id,
        Instructions: archData?.Instructions || archData?.instructions || [],
      };

      // Step 4: Calculate cycles first
      const countResult = calculateCountCycle(code, selectedArchitecture);

      // Step 5: Build animation trace with execution results
      const trace = buildCycleAnimationTrace({
        countResult,
        architecture: selectedArchitecture,
        executionResult: executionData, // Now executionData is defined!
      });

      setCycleTrace(trace);
      setShowAnimation(true);
    } catch (err) {
      console.error("Animation error:", err);
      setError([err.message || "Failed to build animation trace"]);
    } finally {
      setLoadingAnimation(false);
    }
  };

  const handleNavigateToDebugging = () => {
    saveCodeForArchitecture(id, code);
    navigate(`/debugging/${id}`, { state: { code: code } });
  };

  // ✅ Handle clear editor (optional)
  const handleClearEditor = () => {
    if (window.confirm("Are you sure you want to clear all code?")) {
      setCode("");
      saveCodeForArchitecture(id, "");
      setCycleResult(null);
      setCycleError(null);
    }
  };

  if (loadingArchitecture) {
    return (
      <>
        <Header />
        <div className="pt-20 lg:pt-24">
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Loading architecture configuration...
              </p>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24">
        <h2 className="text-blue-900 font-bold text-center mb-1 text-2xl">
          Program Editor
        </h2>

        <div className="min-h-screen bg-gray-100">
          <div className="w-full rounded-xl p-5 space-y-4 lg:max-w-full lg:shadow">
            <div className="flex items-center justify-center gap-2 bg-gray-100">
              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition disabled:opacity-50"
                onClick={handleRun}
                disabled={loadingRun}
              >
                {loadingRun ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                {loadingRun ? "Running..." : "Run"}
              </button>

              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                onClick={() =>
                  navigate(`/debugging/${id}`, { state: { code: code } })
                }
              >
                <ArrowPathIcon className="h-4 w-4" />
                Compile
              </button>

              <button
                type="button"
                onClick={() => setSaveFile(true)}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Save
              </button>

              {saveFile && (
                <SaveFile
                  code={code}
                  architectureId={id}
                  onClose={() => setSaveFile(false)}
                />
              )}

              <button
                type="button"
                onClick={() => setOpenFile(true)}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
              >
                <FolderOpenIcon className="h-4 w-4" />
                Open
              </button>

              {openFile && (
                <OpenFile
                  architectureId={id}
                  onSelect={(fileCode) => setCode(fileCode)}
                  onClose={() => setOpenFile(false)}
                />
              )}
            </div>

            <div className="flex justify-center gap-2 bg-gray-100">
              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                onClick={() => navigate(`/compare/${id}`)}
              >
                <ArrowPathIcon className="h-4 w-4" />
                Compare
              </button>

              {/* <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                onClick={handleCountCycle}
                disabled={loadingCycle}
              >
                {loadingCycle ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ChartBarIcon className="h-4 w-4" />
                )}
                {loadingCycle ? "Calculating..." : "Count Cycle"}
              </button> */}

              {/* New Animation Button */}
              {/* <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                onClick={handleAnimation}
                disabled={loadingAnimation}
              >
                {loadingAnimation ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FilmIcon className="h-4 w-4" />
                )}
                {loadingAnimation ? "Loading..." : "Animation"}
              </button> */}

              {/* <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-red-700 text-white text-xs rounded hover:bg-red-600 transition"
                onClick={handleClearEditor}
              >
                Clear
              </button> */}
            </div>

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 border rounded-lg bg-white p-3 text-sm font-mono text-gray-500">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="p-5 lg:m-5 rounded-xl bg-gray-100 w-full h-64 font-mono text-sm"
                placeholder="Write Assembly code here..."
              />

              <div className="bg-blue-50 rounded-lg p-3 h-60 mt-5 lg:w-* w-full">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Error Display
                </p>
                <div className="bg-white border rounded-md p-2 h-40 text-sm overflow-y-auto">
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
            </div>

            {/* Count Cycle Results Section */}
            {showCycleResult && (
              <div className="border rounded-lg bg-white p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-900" />
                  Count Cycle Results
                </h3>

                {loadingCycle && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mb-3"></div>
                    <p className="text-gray-600 text-sm">
                      Calculating cycles...
                    </p>
                  </div>
                )}

                {cycleError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 font-semibold text-sm">Error:</p>
                    <pre className="text-xs text-red-500 mt-2 whitespace-pre-wrap">
                      {cycleError}
                    </pre>
                  </div>
                )}

                {cycleResult && !loadingCycle && (
                  <div className="mb-20 space-y-4">
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>

                      <p className="text-gray-700 text-base mb-1">
                        Program Executed in
                      </p>

                      <p className="text-4xl font-bold text-blue-900 mb-2">
                        {cycleResult.totalCycles}
                      </p>

                      <p className="text-gray-500 text-sm">
                        cycle{cycleResult.totalCycles !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">
                        Total Instructions:
                        <span className="font-semibold text-gray-700">
                          {cycleResult.instructionCount}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CycleAnimationScreen
        isOpen={showAnimation}
        onClose={() => setShowAnimation(false)}
        cycleTrace={cycleTrace}
        architectureName={architectureData?.name || "Selected Architecture"}
      />

      <BottomNavigation />
    </>
  );
}

export default Editor;