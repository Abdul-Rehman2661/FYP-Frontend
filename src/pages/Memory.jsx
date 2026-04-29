import { useState, useEffect } from "react";
import React from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";

function Memory() {
  const { executionResult } = useContext(ArchitectureContext);
  const memorySummary = executionResult?.MemorySummary || {};
  const stackSummary = executionResult?.StackSummary || {};
  const spIndex = executionResult?.StackPointer || 0;
  const { architectureData } = useContext(ArchitectureContext);
const memorySize = architectureData?.memorySize || 0;

const ROWS = Number(memorySize) || 0;
const COLS = 8;

const memoryRows = Array.from(
  { length: ROWS },
  (_, i) => `0x${String(i).padStart(2, "0")}`
);
const stackRows = Array.from({ length: 16 }, (_, i) => i);
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
              <p className="text-sm text-gray-700 mb-2">Memory Value</p>

              <div className="border rounded-lg p-3 bg-gray-100 overflow-x-auto">
                <div className="grid grid-cols-[60px_repeat(8,minmax(60px,1fr))] gap-2">
                  {memoryRows.map((addr, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {/* Address label */}
                      <div className="text-xs text-gray-600 flex items-center">
                        {addr}
                      </div>

                      {/* 8 memory cells per row */}
                      {Array.from({ length: 8 }).map((_, colIndex) => {
                        const address = rowIndex * 8 + colIndex;
                        const value = memorySummary[address] ?? 0;

                        return (
                          <div
                            key={colIndex}
                            className="h-8 border rounded bg-white flex items-center justify-center text-xs"
                          >
                            {value}
                          </div>
                        );
                      })}
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

                  {/* Stack boxes (FIXED) */}
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
