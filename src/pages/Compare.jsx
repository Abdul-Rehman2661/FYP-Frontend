import { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";
import { PlayIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";

function Compare() {
  const { id } = useParams();

  const [displayModel, setDisplayModel] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");

  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);

  const [loadingRun, setLoadingRun] = useState(false);

  // Execute API
  const runProgram = async (code, setError, setResult) => {
    try {
      setLoadingRun(true);
      setError(null);

      const codeArray = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const res = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
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
      setLoadingRun(false);
    }
  };

  // Extract data
  const registers1 = result1?.Registers || [];
  const registers2 = result2?.Registers || [];

  const memory1 = result1?.MemorySummary || {};
  const memory2 = result2?.MemorySummary || {};

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24">
        <h2 className="text-blue-900 font-bold text-center mb-1 text-2xl">
          Compare Editor
        </h2>

        <div className="min-h-screen bg-gray-100">
          <div className="w-full mb-8 rounded-xl p-5 space-y-4 lg:max-w-full lg:shadow">
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-2">
              <button
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-white bg-blue-900 text-xs rounded hover:bg-blue-800 hover:text-white transition"
                onClick={() => setDisplayModel(true)}
              >
                <FolderOpenIcon className="h-4 w-4" />
                Open
              </button>

              <button
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-white bg-blue-900 text-xs rounded hover:bg-blue-800 hover:text-white transition"
                onClick={() => setShowModal(true)}
              >
                <FolderOpenIcon className="h-4 w-4" />
                Open
              </button>

              <button
                onClick={() => runProgram(code1, setError1, setResult1)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 hover:text-white transition"
              >
                {" "}
                {loadingRun ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                Run
              </button>

              <button
                onClick={() => runProgram(code2, setError2, setResult2)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 hover:text-white transition"
              >
                {" "}
                {loadingRun ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                Run
              </button>

              {displayModel && (
                <SaveFile onClose={() => setDisplayModel(false)} />
              )}
              {showModal && <OpenFile onClose={() => setShowModal(false)} />}
            </div>

            {/* Editors */}
            <div className="flex flex-col lg:flex-row gap-2 border rounded-lg bg-gray-100 p-3 text-sm font-mono text-gray-500">
              <textarea
                value={code1}
                onChange={(e) => setCode1(e.target.value)}
                className="p-5 lg:m-5 rounded-xl bg-white w-full h-64 text-black"
                placeholder="Write Program A"
              />

              <textarea
                value={code2}
                onChange={(e) => setCode2(e.target.value)}
                className="p-5 lg:m-5 rounded-xl bg-white w-full h-64 text-black"
                placeholder="Write Program B"
              />
            </div>

            {/* Errors */}
            <div className="p-4 flex flex-col lg:flex-row gap-2 lg:gap-5">
              <div className="bg-blue-100 rounded-lg p-3 w-full">
                <p className="text-sm text-black mb-1">Error Display</p>
                <div className="text-sm text-red-500">
                  {error1
                    ? Array.isArray(error1)
                      ? error1.map((e, i) => <p key={i}>{e}</p>)
                      : error1
                    : "No Errors"}
                </div>
              </div>

              <div className="bg-blue-100 rounded-lg p-3 w-full">
                <p className="text-sm text-black mb-1">Error Display</p>
                <div className="text-sm text-red-500">
                  {error2
                    ? Array.isArray(error2)
                      ? error2.map((e, i) => <p key={i}>{e}</p>)
                      : error2
                    : "No Errors"}
                </div>
              </div>
            </div>

            {/* Registers */}
            {/* <div className="p-4 flex flex-col lg:flex-row gap-2 lg:gap-5">
              <div className="bg-white border rounded-md p-2 w-full">
                <p className="text-black mb-2">Registers</p>
                {registers1.length > 0
                  ? registers1.map((val, i) => (
                      <p className="text-blue-900" key={i}>R{i + 1}: {val}</p>
                    ))
                  : <p className="text-blue-300">No Data</p>}
              </div>

              <div className="bg-white border rounded-md p-2 w-full">
                <p className="text-black mb-2">Registers</p>
                {registers2.length > 0
                  ? registers2.map((val, i) => (
                      <p className="text-blue-900" key={i}>R{i + 1}: {val}</p>
                    ))
                  : <p className="text-blue-300">No Data</p>}
              </div>
            </div> */}

            {/* Memory */}
            {/* <div className="p-4 flex flex-col lg:flex-row gap-2 lg:gap-5">
              <div className="bg-white border rounded-md p-2 w-full">
                <p className="text-black mb-2">Memory</p>
                {Object.keys(memory1).length > 0
                  ? Object.entries(memory1).map(([addr, val]) => (
                      <p className="text-blue-900" key={addr}>[{addr}] = {val}</p>
                    ))
                  : <p className="text-blue-300">No Memory Change</p>}
              </div>

              <div className="bg-white border rounded-md p-2 w-full">
                <p className="text-black mb-2">Memory</p>
                {Object.keys(memory2).length > 0
                  ? Object.entries(memory2).map(([addr, val]) => (
                      <p className="text-blue-900" key={addr}>[{addr}] = {val}</p>
                    ))
                  : <p className="text-blue-300">No Memory Change</p>}
              </div>
            </div> */}

            {/* Clock Cycle (placeholder) */}
            <div className="p-4 flex flex-col lg:flex-row gap-2 lg:gap-5">
              <div className="bg-blue-50 rounded-lg p-3 w-full">
                <div className="bg-white border flex justify-between rounded-md p-2 text-sm font-semibold">
                  <p className="text-black">Clock Cycle:</p>
                  <p className="text-blue-900">{registers1.length}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 w-full">
                <div className="bg-white border flex justify-between rounded-md p-2 text-sm font-semibold">
                  <p className="text-black">Clock Cycle:</p>
                  <p className="text-blue-900">N/A</p>
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

export default Compare;
