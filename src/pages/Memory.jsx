import { useState, useEffect } from "react";
import React from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";
import { useParams } from "react-router-dom";

function Memory() {
  const { executionResult, architectureData, setArchitectureData } =
    useContext(ArchitectureContext);
  const { id } = useParams();

  const [localMemorySize, setLocalMemorySize] = useState(0);
  const [localExecutionResult, setLocalExecutionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState("4"); // "4", "8", or "full"

  // Function to convert byte value to 8 bits
  const byteToBits = (byteValue) => {
    const bits = [];
    for (let i = 7; i >= 0; i--) {
      bits.push((byteValue >> i) & 1);
    }
    return bits;
  };

  // Fetch architecture data and listen for context updates
  useEffect(() => {
    const fetchData = async () => {
      // If architecture data is not in context, fetch it
      if (!architectureData || !architectureData.memorySize) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/architecture/get-full/${id}`,
          );
          const data = await response.json();

          const memorySz = data?.Architecture?.MemorySize || 0;
          setLocalMemorySize(memorySz);

          setArchitectureData({
            memorySize: memorySz,
            stackSize: data?.Architecture?.StackSize || 0,
            busSize: data?.Architecture?.BusSize || 0,
            name: data?.Architecture?.Name || "",
          });
        } catch (err) {
          console.error("Failed to fetch architecture:", err);
        }
      } else {
        setLocalMemorySize(architectureData.memorySize);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, architectureData, setArchitectureData]);

  // Update local execution result when context changes
  useEffect(() => {
    if (executionResult) {
      setLocalExecutionResult(executionResult);
    }
  }, [executionResult]);

  const memorySummary = localExecutionResult?.MemorySummary || {};
  const stackSummary = localExecutionResult?.StackSummary || {};
  const spIndex = localExecutionResult?.StackPointer || 0;

  const ROWS = Number(localMemorySize) || 0;
  const COLS = 8;

  // Get displayed rows based on display mode
  const getDisplayedRows = () => {
    if (displayMode === "4") {
      return Math.min(4, ROWS);
    } else if (displayMode === "8") {
      return Math.min(8, ROWS);
    } else {
      return ROWS;
    }
  };

  const displayedRowCount = getDisplayedRows();

  const memoryRows = Array.from(
    { length: displayedRowCount },
    (_, i) => `0x${String(i).padStart(2, "0")}`,
  );
  const stackRows = Array.from({ length: 16 }, (_, i) => i);

  // Show loading if data is not yet available
  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-20 lg:pt-24">
          <h2 className="text-center text-xl font-bold text-blue-900">
            Memory Visualization
          </h2>
          <div className="p-4 min-h-screen bg-gray-100 pb-16 flex justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading memory configuration...</p>
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
        <h2 className="text-center text-xl font-bold text-blue-900">
          Memory Visualization
        </h2>
        <div className="p-4 min-h-screen bg-gray-100 pb-16 flex justify-center">
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
            <div className="flex justify-end mb-4">
              <div className="flex gap-4 bg-gray-100 p-2 rounded-lg">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="4"
                    checked={displayMode === "4"}
                    onChange={(e) => setDisplayMode(e.target.value)}
                    className="w-4 h-4 accent-blue-900"
                  />
                  <span
                    className={
                      displayMode === "4"
                        ? "text-blue-900 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Top 4 Rows
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="8"
                    checked={displayMode === "8"}
                    onChange={(e) => setDisplayMode(e.target.value)}
                    className="w-4 h-4 accent-blue-900"
                  />
                  <span
                    className={
                      displayMode === "8"
                        ? "text-blue-900 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Top 8 Rows
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="full"
                    checked={displayMode === "full"}
                    onChange={(e) => setDisplayMode(e.target.value)}
                    className="w-4 h-4 accent-blue-900"
                  />
                  <span
                    className={
                      displayMode === "full"
                        ? "text-blue-900 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Full Memory
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-2">
                Memory Value (Memory Size: {localMemorySize} bytes ={" "}
                {localMemorySize * 8} bits)
                {displayMode !== "full" && (
                  <span className="ml-2 text-blue-900">
                    (Showing top {displayedRowCount} of {ROWS} rows)
                  </span>
                )}
              </p>

              <div className="border rounded-lg p-3 bg-gray-100 overflow-x-auto max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-[60px_repeat(8,minmax(60px,1fr))] gap-2">
                  {memoryRows.map((addr, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {/* Address label */}
                      <div className="text-xs text-gray-600 flex items-center">
                        {addr}
                      </div>

                      {/* 8 bits per row (each box = 1 bit) */}
                      {(() => {
                        const byteValue = memorySummary[rowIndex] ?? 0;
                        const bits = byteToBits(byteValue);
                        return bits.map((bit, colIndex) => (
                          <div
                            key={colIndex}
                            className={`h-8 border rounded flex items-center justify-center text-xs ${
                              bit === 1
                                ? "bg-blue-900 text-blue-900 font-bold"
                                : "bg-white text-white"
                            }`}
                            title={`Address ${addr}, Bit ${7 - colIndex}: ${bit} (Byte value: ${byteValue})`}
                          >
                            {bit}
                          </div>
                        ));
                      })()}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-700 mb-2">Stack Memory</p>

              <div className="border rounded-lg p-4 bg-gray-100 flex justify-center">
                <div className="flex">
                  {/* Stack numbers */}
                  <div className="flex flex-col-reverse justify-between mr-2">
                    {stackRows.map((num) => (
                      <div
                        key={num}
                        className="text-xs text-gray-600 h-8 flex items-center justify-end"
                      >
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Stack boxes */}
                  <div className="flex flex-col-reverse gap-1">
                    {stackRows.map((num, index) => {
                      const value = stackSummary[num] ?? 0;

                      return (
                        <div key={num} className="flex items-center">
                          <div className="w-20 h-8 border rounded bg-white text-white flex items-center justify-center text-xs">
                            {value}
                          </div>

                          {index === spIndex && (
                            <span className="ml-2 text-xs font-medium text-blue-900 whitespace-nowrap">
                              ←SP
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
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

export default Memory;
