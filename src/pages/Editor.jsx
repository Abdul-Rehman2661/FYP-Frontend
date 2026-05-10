import { useState, useContext, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";
import CountCycleModal from "../components/CountCycleModal.jsx";
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
  const [showCountCycle, setShowCountCycle] = useState(false);
  const [code, setCode] = useState();
  const [error, setError] = useState(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingArchitecture, setLoadingArchitecture] = useState(true);

  const [showAnimation, setShowAnimation] = useState(false);
  const [cycleTrace, setCycleTrace] = useState([]);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

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

      // Set execution result and navigate
      setExecutionResult(data);

      saveCodeForArchitecture(id, code);

      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate(`/regviz/${id}`);
      }, 100);
    } catch (err) {
      console.error(err);
      setError(["Execution failed: " + err.message]);
    } finally {
      setLoadingRun(false);
    }
  };

  const handleCountCycle = () => {
    if (!code?.trim()) {
      setError(["Please enter some code to analyze"]);
      return;
    }
    setShowCountCycle(true);
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

              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition"
                onClick={handleCountCycle}
                disabled={loadingAnimation}
              >
                <ChartBarIcon className="h-4 w-4" />
                Count Cycle
              </button>

              {/* New Animation Button */}
              <button
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
              </button>

              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-red-700 text-white text-xs rounded hover:bg-red-600 transition"
                onClick={handleClearEditor}
              >
                Clear
              </button>
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
                    <p className="text-green-500">✓ No errors</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CountCycle Modal */}
      <CountCycleModal
        isOpen={showCountCycle}
        onClose={() => setShowCountCycle(false)}
        code={code}
        architectureId={id}
        architectureData={architectureData}
      />

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
