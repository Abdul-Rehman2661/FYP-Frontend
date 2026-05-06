import { useState, useEffect } from "react";
import React from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";
import { useParams } from "react-router-dom";

function Memory() {
  const { executionResult, architectureData, setArchitectureData } = useContext(ArchitectureContext);
  const { id } = useParams();
  
  const [localMemorySize, setLocalMemorySize] = useState(0);
  const [localExecutionResult, setLocalExecutionResult] = useState(null);
  const [loading, setLoading] = useState(true);

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
            `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/get-full/${id}`
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

  const memoryRows = Array.from(
    { length: ROWS },
    (_, i) => `0x${String(i).padStart(2, "0")}`
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
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-2">
                Memory Value (Memory Size: {localMemorySize} bytes = {localMemorySize * 8} bits)
              </p>

              <div className="border rounded-lg p-3 bg-gray-100 overflow-x-auto">
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
                              bit === 1 ? 'bg-blue-900 text-white font-bold' : 'bg-white text-gray-400'
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
                          <div className="w-20 h-8 border rounded bg-white flex items-center justify-center text-xs">
                            {value}
                          </div>

                          {index === spIndex && <span className="ml-2 text-xs font-medium text-blue-900 whitespace-nowrap">←SP</span>}
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