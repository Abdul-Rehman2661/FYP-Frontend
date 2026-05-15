import { useState, useEffect } from "react";
import React from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";
import { useParams } from "react-router-dom";

// Constants
const CODE_SEGMENT_LIMIT = 50;
const WORD_SIZE = 16; // 1 Word = 16 bits

function Memory() {
  const { executionResult, architectureData, setArchitectureData } =
    useContext(ArchitectureContext);

  const { id } = useParams();

  const [localMemorySize, setLocalMemorySize] = useState(0);
  const [localStackSize, setLocalStackSize] = useState(0);
  const [localExecutionResult, setLocalExecutionResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // View options matching React Native
  const [viewOptions, setViewOptions] = useState({
    bitsPerRow: WORD_SIZE,
    rowsMode: "full",
  });

  const bitsPerRow = viewOptions.bitsPerRow;
  const rowsMode = viewOptions.rowsMode;

  // Convert number to 16-bit binary array
  const numberToBitArray = (value) => {
    const num = Number(value) || 0;
    const maxValue = Math.pow(2, WORD_SIZE);

    const wordValue =
      num >= 0
        ? num % maxValue
        : ((num % maxValue) + maxValue) % maxValue;

    return Array.from({ length: WORD_SIZE }, (_, index) => {
      const bitPosition = WORD_SIZE - 1 - index;
      return (wordValue >> bitPosition) & 1;
    });
  };

  // Enhanced version that respects the bitsPerRow setting
  const renderFullWidthMemoryRow = (address, isCodeSegment) => {
    const rowBits = getMemoryRowBits(address, memorySummary);
    
    // Split bits into groups based on bitsPerRow
    const groups = [];
    for (let i = 0; i < rowBits.length; i += bitsPerRow) {
      groups.push(rowBits.slice(i, i + bitsPerRow));
    }
    
    return (
      <div className="flex flex-col gap-2">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-1 flex-wrap">
            {group.map((bit, index) => {
              const globalIndex = groupIndex * bitsPerRow + index;
              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-mono font-bold transition-all cursor-help
                    ${bit === 1 
                      ? 'bg-blue-900 text-white border-blue-900 shadow-md' 
                      : 'bg-white text-blue-900 border-blue-300 hover:border-blue-500'
                    }
                    hover:scale-105 hover:shadow-lg`}
                  title={`Bit ${WORD_SIZE - 1 - globalIndex}: ${bit === 1 ? '1' : '0'}`}
                >
                  {bit}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Normalize bits to WORD_SIZE (16 bits)
  const normalizeBitsToWord = (bits = []) => {
    if (!Array.isArray(bits)) {
      return Array.from({ length: WORD_SIZE }, () => 0);
    }

    const cleanedBits = bits.map((bit) =>
      Number(bit) === 1 ? 1 : 0,
    );

    if (cleanedBits.length === WORD_SIZE) {
      return cleanedBits;
    }

    if (cleanedBits.length < WORD_SIZE) {
      return [
        ...Array.from(
          { length: WORD_SIZE - cleanedBits.length },
          () => 0,
        ),
        ...cleanedBits,
      ];
    }

    return cleanedBits.slice(
      cleanedBits.length - WORD_SIZE,
    );
  };

  // Get memory row bits for a specific address
  const getMemoryRowBits = (address, memorySummary) => {
    if (
      address >= CODE_SEGMENT_LIMIT &&
      memorySummary[address] !== undefined
    ) {
      return numberToBitArray(memorySummary[address]);
    }

    if (
      address >= CODE_SEGMENT_LIMIT &&
      memorySummary[String(address)] !== undefined
    ) {
      return numberToBitArray(
        memorySummary[String(address)],
      );
    }

    // Default empty row
    return Array.from({ length: WORD_SIZE }, () => 0);
  };

  // Chunk bits into groups
  const chunkBits = (bits, chunkSize) => {
    const chunks = [];

    for (let i = 0; i < bits.length; i += chunkSize) {
      chunks.push(bits.slice(i, i + chunkSize));
    }

    return chunks;
  };

  // Fetch architecture data
  useEffect(() => {
    const fetchData = async () => {
      if (!architectureData || !architectureData.memorySize) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/architecture/get-full/${id}`,
          );

          const data = await response.json();

          const memorySz =
            data?.Architecture?.MemorySize || 0;

          const stackSz =
            data?.Architecture?.StackSize || 0;

          setLocalMemorySize(memorySz);
          setLocalStackSize(stackSz);

          setArchitectureData({
            memorySize: memorySz,
            stackSize: stackSz,
            busSize:
              data?.Architecture?.BusSize || 0,
            name: data?.Architecture?.Name || "",
          });
        } catch (err) {
          console.error(
            "Failed to fetch architecture:",
            err,
          );
        }
      } else {
        setLocalMemorySize(
          architectureData.memorySize,
        );

        setLocalStackSize(
          architectureData.stackSize,
        );
      }

      setLoading(false);
    };

    fetchData();
  }, [id, architectureData, setArchitectureData]);

  // Update local execution result when context changes
  useEffect(() => {
    if (executionResult) {
      console.log("=== Execution Result Received ===");
      console.log("Full Result:", executionResult);
      console.log("Stack Pointer:", executionResult.StackPointer);
      console.log("Stack Summary:", executionResult.StackSummary);
      console.log("Memory Summary Keys:", Object.keys(executionResult.MemorySummary || {}));
      setLocalExecutionResult(executionResult);
    }
  }, [executionResult]);

  const memorySummary =
    localExecutionResult?.MemorySummary || {};

  // FIXED: Properly handle stack data with multiple possible property names
  const stackSummary = localExecutionResult?.StackSummary || 
                       localExecutionResult?.stackSummary || 
                       localExecutionResult?.Stack || 
                       {};
  
  // Try multiple possible property names for StackPointer
// NEW CODE - Add this to calculate SP from StackSummary
let stackPointer = 0;

// Calculate SP from StackSummary (SP = number of items in stack)
if (localExecutionResult?.StackSummary) {
    const stackKeys = Object.keys(localExecutionResult.StackSummary);
    if (stackKeys.length > 0) {
        // SP should point to next available location = number of items
        stackPointer = stackKeys.length;
        console.log("Calculated SP from StackSummary:", stackPointer, "Items:", stackKeys);
    }
}

// Also try other possible property names as fallback
if (stackPointer === 0) {
    stackPointer = localExecutionResult?.StackPointer || 
                   localExecutionResult?.stackPointer || 
                   localExecutionResult?.SP || 
                   localExecutionResult?.sp || 0;
}
  
  // Ensure stack pointer is a number and within bounds
  stackPointer = Number(stackPointer) || 0;
  
  // For debugging - log what we found
  console.log("Final Stack Pointer value:", stackPointer);
  console.log("Stack Summary entries:", stackSummary);

  const totalMemorySize =
    Number(localMemorySize) || 0;

  const totalStackSize =
    Number(localStackSize) || 16;

  const totalWords =
    totalMemorySize > 0
      ? Math.ceil(totalMemorySize / 2)
      : 0;

  // Generate code segment rows
  const allCodeRows = Array.from(
    { length: Math.min(CODE_SEGMENT_LIMIT, totalMemorySize) },
    (_, index) => index,
  );

  // Get data addresses
  const dataAddressesFromSummary = Object.keys(
    memorySummary,
  )
    .map((address) => Number(address))
    .filter(
      (address) =>
        !Number.isNaN(address) &&
        address >= CODE_SEGMENT_LIMIT,
    )
    .sort((a, b) => a - b);

  // Generate data rows (with limit for performance)
  const maxDataRowsToShow = rowsMode === "full" ? 200 : Number(rowsMode) * 10;
  
  const dataRowsFromMemorySize =
    totalMemorySize > CODE_SEGMENT_LIMIT
      ? Array.from(
          {
            length: Math.min(
              totalMemorySize - CODE_SEGMENT_LIMIT,
              maxDataRowsToShow
            ),
          },
          (_, index) =>
            CODE_SEGMENT_LIMIT + index,
        )
      : [];

  const allDataRows = Array.from(
    new Set([
      ...dataRowsFromMemorySize,
      ...dataAddressesFromSummary,
    ]),
  ).sort((a, b) => a - b).slice(0, maxDataRowsToShow);

  // Get visible rows
  const getVisibleRows = (rows) => {
    if (rowsMode === "full") {
      // Limit to 200 rows for performance when showing full
      return rows.slice(0, 200);
    }
    
    const limit = Number(rowsMode) * 10;
    return rows.slice(0, limit);
  };

  const codeRows = getVisibleRows(allCodeRows);
  const dataRows = getVisibleRows(allDataRows);

  // Format address label
  const getAddressLabel = (address) => {
    return `0x${address
      .toString(16)
      .toUpperCase()
      .padStart(2, "0")}`;
  };

  // Render bit
  const renderBitCircle = (
    bit,
    key,
    isSmall = false,
  ) => {
    const bitValue = Number(bit) === 1 ? 1 : 0;

    const isOne = bitValue === 1;

    return (
      <div
        key={key}
        className={`rounded-full border border-blue-900 flex items-center justify-center transition-all cursor-help flex-shrink-0
          ${
            isSmall
              ? "w-4 h-4 text-[9px] sm:w-5 sm:h-5 sm:text-[10px] md:w-6 md:h-6 md:text-xs"
              : "w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm"
          } 
          ${
            isOne
              ? "bg-blue-900 text-white"
              : "bg-white text-blue-900"
          }
          hover:scale-110 hover:shadow-md`}
        title={
          bitValue === 1 ? "Bit = 1" : "Bit = 0"
        }
      >
        {bitValue}
      </div>
    );
  };

  // Render memory row
  const renderMemoryAddressRow = (
    address,
    isCodeSegment,
  ) => {
    const rowBits = getMemoryRowBits(
      address,
      memorySummary,
    );

    const bitRows = chunkBits(
      rowBits,
      bitsPerRow,
    );

    return (
      <div key={address} className="mb-2 lg:mb-3 hover:bg-gray-50 rounded-lg transition-colors">
        {bitRows.map((bitRow, rowIndex) => (
          <div
            key={`${address}-${rowIndex}`}
            className="flex items-start lg:items-center mb-1"
          >
            <div
              className={`text-[10px] sm:text-xs font-mono font-semibold w-12 sm:w-14 lg:w-16 flex-shrink-0 ${
                isCodeSegment
                  ? "text-blue-900 font-bold"
                  : "text-gray-600"
              }`}
            >
              {rowIndex === 0
                ? getAddressLabel(address)
                : ""}
            </div>

            <div className="flex flex-wrap max-w-full gap-1">
              {bitRow.map((bit, bitIndex) =>
                renderBitCircle(
                  bit,
                  `${address}-${rowIndex}-${bitIndex}`,
                  true,
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // FIXED: Render stack memory - proper visualization for Push/Pop operations
  const renderStack = () => {
    // Create array of stack indices from bottom (0) to top (totalStackSize - 1)
    const stackIndices = Array.from(
      { length: Math.min(totalStackSize, 100) },
      (_, index) => index
    );
    
    // Show top of stack first (for better visualization)
    const reversedIndices = [...stackIndices].reverse();

    return reversedIndices.map((stackIndex) => {
      // Current stack pointer (points to next available location)
      const currentSP = stackPointer;
      
      // Check if this stack location has data
      // Data exists if index is less than SP (since SP points to next free location)
      const hasData = stackIndex < currentSP;
      
      // Check if this is where the stack pointer is pointing
      // SP points to the NEXT available location, so it points to an empty cell
      const isStackPointerHere = stackIndex === currentSP;
      
      // Get the value at this stack location
      let stackValue = "";
      if (hasData && stackSummary[stackIndex] !== undefined && stackSummary[stackIndex] !== null) {
        stackValue = String(stackSummary[stackIndex]);
      } else if (stackSummary[stackIndex] !== undefined && stackSummary[stackIndex] !== null) {
        stackValue = String(stackSummary[stackIndex]);
      }

      return (
        <div
          key={stackIndex}
          className="flex items-center justify-center mb-2 lg:mb-3 w-full"
        >
          <div className="w-8 lg:w-12 text-right text-[10px] lg:text-xs text-gray-500 mr-2 lg:mr-3 font-mono">
            {stackIndex}
          </div>

          <div
            className={`flex-1 max-w-[120px] h-8 lg:h-10 border rounded-md flex items-center justify-center transition-all
              ${
                isStackPointerHere
                  ? "border-2 border-green-500 bg-green-50 shadow-md"
                  : hasData
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              } 
              hover:shadow-sm`}
          >
            <span className={`font-semibold text-xs lg:text-sm font-mono truncate px-2
              ${hasData ? "text-blue-900" : "text-gray-400"}
            `}>
              {stackValue || (isStackPointerHere ? "← Next" : "")}
            </span>
          </div>

          <div className="w-16 lg:w-20 ml-2 lg:ml-3">
            {isStackPointerHere && (
              <span className="text-[10px] lg:text-xs font-bold text-green-600 whitespace-nowrap animate-pulse">
                ← SP
              </span>
            )}
            {hasData && !isStackPointerHere && stackIndex === currentSP - 1 && currentSP > 0 && (
              <span className="text-[9px] lg:text-[10px] font-medium text-blue-500 whitespace-nowrap">
                TOP
              </span>
            )}
          </div>
        </div>
      );
    });
  };

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

              <p className="text-gray-600">
                Loading memory configuration...
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

      <div className="pt-20 lg:pt-24 pb-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm shadow-sm py-3">
          <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Memory Visualization
          </h2>
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-1">
            1 Word = {WORD_SIZE} bits | Total Memory: {totalMemorySize} Bytes = {totalWords} Words
          </p>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-[1900px] w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
              {/* Control Panel */}
              <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Bit Columns */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-900 rounded-full"></span>
                      Bit Columns
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {[4, 8, WORD_SIZE].map((bits) => (
                        <label key={bits} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="bitsPerRow"
                            checked={bitsPerRow === bits}
                            onChange={() =>
                              setViewOptions({
                                ...viewOptions,
                                bitsPerRow: bits,
                              })
                            }
                            className="w-4 h-4 accent-blue-900"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-900 transition">
                            {bits === WORD_SIZE ? `Word ${bits}` : `${bits} Bits`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rows */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-900 rounded-full"></span>
                      Rows Display
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {["4", "8", "full"].map((mode) => (
                        <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="rowsMode"
                            checked={rowsMode === mode}
                            onChange={() =>
                              setViewOptions({
                                ...viewOptions,
                                rowsMode: mode,
                              })
                            }
                            className="w-4 h-4 accent-blue-900"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-900 transition">
                            {mode === "full" ? "Full View" : `${mode}0 Rows`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Memory Stats */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Total Memory</p>
                      <p className="text-sm font-bold text-blue-900">{totalMemorySize} Bytes</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Words</p>
                      <p className="text-sm font-bold text-blue-900">{totalWords} Words</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Stack Size</p>
                      <p className="text-sm font-bold text-blue-900">{totalStackSize} Bytes</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Stack Pointer (SP)</p>
                      <p className="text-sm font-bold text-green-600">{stackPointer}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
                
                {/* Memory Section */}
                <div className="xl:col-span-9 border-r border-gray-200">
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                      Memory Values
                    </h3>

                    <div className="bg-gray-50 rounded-xl border border-gray-200 h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar">
                      <div className="p-4">
                        {/* Code Segment */}
                        <div className="mb-8">
                          <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-lg mb-4 sticky top-0 z-10">
                            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center justify-between">
                              <span>CODE SEGMENT</span>
                              <span className="text-[10px] font-normal">Address 0 to {CODE_SEGMENT_LIMIT - 1}</span>
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {codeRows.length > 0 ? (
                              codeRows.map((address) => (
                                <div key={address} className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-gray-200">
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <div className="w-16 flex-shrink-0">
                                      <span className="text-sm font-mono font-bold text-blue-900">
                                        {getAddressLabel(address)}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      {renderFullWidthMemoryRow(address, true)}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-6">
                                No code segment data available
                              </p>
                            )}
                          </div>

                          {rowsMode !== "full" &&
                            allCodeRows.length > codeRows.length && (
                              <p className="text-xs text-gray-500 text-center italic mt-3">
                                Showing {codeRows.length} of {allCodeRows.length} code rows
                              </p>
                            )}
                        </div>

                        {/* Data Segment */}
                        <div className="mb-8">
                          <div className="bg-gradient-to-r from-green-100 to-green-50 px-4 py-2 rounded-lg mb-4 sticky top-0 z-10">
                            <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide flex items-center justify-between">
                              <span>DATA SEGMENT</span>
                              <span className="text-[10px] font-normal">Address {CODE_SEGMENT_LIMIT}+</span>
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {dataRows.length > 0 ? (
                              dataRows.map((address) => (
                                <div key={address} className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-gray-200">
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <div className="w-16 flex-shrink-0">
                                      <span className="text-sm font-mono font-bold text-green-700">
                                        {getAddressLabel(address)}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      {renderFullWidthMemoryRow(address, false)}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-6">
                                No data memory found. Use Store [
                                {CODE_SEGMENT_LIMIT}
                                ],R1 or higher address.
                              </p>
                            )}
                          </div>

                          {rowsMode !== "full" &&
                            allDataRows.length > dataRows.length && (
                              <p className="text-xs text-gray-500 text-center italic mt-3">
                                Showing {dataRows.length} of {allDataRows.length} data rows
                              </p>
                            )}
                          
                          {totalMemorySize > 500 && rowsMode === "full" && (
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <p className="text-xs text-yellow-800 text-center">
                                💡 Large memory size ({totalMemorySize} bytes). Showing first 200 rows for performance.
                                Use "40 Rows" or "80 Rows" option to view more specific ranges.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-900 border border-blue-900"></div>
                            <span className="text-xs text-gray-600">Bit = 1</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-white border border-blue-900"></div>
                            <span className="text-xs text-gray-600">Bit = 0</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></div>
                            <span className="text-xs text-gray-600">Empty/Unused</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stack Memory */}
                <div className="xl:col-span-3">
                  <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-b from-gray-50 to-white h-full">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Stack Memory (LIFO)
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      SP points to <span className="font-bold text-green-600">next available location</span> | Current SP: <span className="font-bold text-green-600">{stackPointer}</span>
                    </p>

                    <div className="bg-gray-50 rounded-xl border border-gray-200 h-[600px] overflow-y-auto custom-scrollbar">
                      <div className="p-3">
                        <div className="flex flex-col items-center w-full">
                          {renderStack()}
                        </div>
                        
                        {totalStackSize > 100 && (
                          <div className="mt-4 p-2 bg-blue-50 rounded-lg text-center">
                            <p className="text-xs text-blue-800">
                              Showing first 100 of {totalStackSize} stack entries
                            </p>
                          </div>
                        )}
                        
                        {/* Stack Operation Info */}
                        <div className="mt-4 p-2 bg-gray-100 rounded-lg text-center">
                          <p className="text-[10px] text-gray-600">
                            💡 <span className="font-semibold">Push:</span> Store value at SP, then SP++
                          </p>
                          <p className="text-[10px] text-gray-600">
                            💡 <span className="font-semibold">Pop:</span> SP--, then retrieve value
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 italic">
                            SP starts at 0 → After first push: SP=1
                          </p>
                        </div>
                      </div>
                    </div>
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