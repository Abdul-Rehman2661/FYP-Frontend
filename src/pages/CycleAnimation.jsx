import React, { useEffect, useRef, useState } from "react";
import BackButton from "../components/BackButton.jsx";
import {
  XMarkIcon,
  CpuChipIcon,
  FlagIcon,
  ServerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";

const STAGE_COLORS = {
  Fetch: "#2563EB",
  Decode: "#6D28D9",
  Execute: "#16A34A",
};

const STAGE_BG = {
  Fetch: "#EAF2FF",
  Decode: "#F2EAFE",
  Execute: "#EAFBF1",
};

const normalize = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

const getStageColor = (stage) => STAGE_COLORS[stage] || "#2563EB";
const getStageBg = (stage) => STAGE_BG[stage] || "#EAF2FF";

const displayValue = (value) => {
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
};

const isChanged = (changedList = [], name) => {
  return changedList.some((item) => normalize(item) === normalize(name));
};

// Helper function to get flag value from both array and object formats
const getFlagValue = (flags, flagName) => {
  if (!flags) return 0;

  // Handle array format (from backend API)
  if (Array.isArray(flags)) {
    const flagMap = {
      Carry: 0,
      carry: 0,
      CF: 0,
      cf: 0,
      Overflow: 1,
      overflow: 1,
      OF: 1,
      of: 1,
      Sign: 2,
      sign: 2,
      SF: 2,
      sf: 2,
      Zero: 3,
      zero: 3,
      ZF: 3,
      zf: 3,
    };
    const index = flagMap[flagName];
    return index !== undefined && flags[index] ? 1 : 0;
  }

  // Handle object format (from animation trace)
  // Try exact match, then case-insensitive match
  if (flags[flagName] !== undefined) return flags[flagName] ? 1 : 0;

  const lowerFlagName = flagName.toLowerCase();
  for (const [key, value] of Object.entries(flags)) {
    if (key.toLowerCase() === lowerFlagName) {
      return value ? 1 : 0;
    }
  }

  return 0;
};

const ValueCard = ({ name, value, changed, type = "register" }) => {
  return (
    <div
      className={`
        ${type === "flag" ? "bg-purple-50" : "bg-white"}
        border rounded-lg p-2 flex flex-col items-center
        ${changed ? "bg-green-50 border-green-500" : "border-gray-200"}
        transition-all duration-300
      `}
      style={{ width: "calc(33% - 0.5rem)", marginBottom: "0.5rem" }}
    >
      <p
        className={`text-xs font-bold mb-1 truncate w-full text-center ${
          changed ? "text-green-600" : "text-gray-700"
        }`}
      >
        {name}
      </p>
      <p
        className={`text-sm font-extrabold ${
          changed ? "text-green-600" : "text-blue-900"
        }`}
      >
        {displayValue(value)}
      </p>
    </div>
  );
};

const TimelineDot = ({ cycle, active, done }) => {
  const color = getStageColor(cycle?.stage);

  return (
    <div className="flex flex-col items-center mr-1" style={{ width: "48px" }}>
      <div
        className={`
          flex items-center justify-center rounded-full border-2 transition-all duration-300
          ${active ? "w-9 h-9 bg-blue-900 border-blue-400" : "w-7 h-7"}
          ${done && !active ? `bg-[${color}] border-[${color}]` : "bg-gray-100 border-gray-300"}
        `}
        style={
          done && !active ? { backgroundColor: color, borderColor: color } : {}
        }
      >
        {done && !active ? (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <span
            className={`text-xs font-black ${active ? "text-white" : "text-gray-500"}`}
          >
            {cycle?.tState || "-"}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 font-bold mt-1 truncate w-full text-center">
        {cycle?.stage || "-"}
      </p>
    </div>
  );
};

const CycleAnimationScreen = ({
  isOpen,
  onClose,
  cycleTrace = [],
  architectureName = "Selected Architecture",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const timelineRef = useRef(null);
  const animationRef = useRef(null);

  const totalCycles = Array.isArray(cycleTrace) ? cycleTrace.length : 0;
  const safeIndex =
    totalCycles > 0 ? Math.min(currentIndex, totalCycles - 1) : 0;

  const currentCycle = totalCycles > 0 ? cycleTrace[safeIndex] : null;

  const currentStage = currentCycle?.stage || "Fetch";
  const stageColor = getStageColor(currentStage);
  const stageBg = getStageBg(currentStage);

  const isLastCycle = totalCycles > 0 && safeIndex === totalCycles - 1;

  const progressPercent =
    totalCycles > 0 ? ((safeIndex + 1) / totalCycles) * 100 : 0;

  const registerEntries = Object.entries(currentCycle?.registers || {});

  // Get flag entries in a consistent order
  const getFlagEntries = (flags) => {
    if (!flags) return [];

    // Define standard flag order
    const standardFlags = ["Carry", "Overflow", "Sign", "Zero"];

    if (Array.isArray(flags)) {
      // Convert array to named entries
      const flagNames = ["Carry", "Overflow", "Sign", "Zero"];
      return flagNames.map((name, index) => [name, flags[index] ? 1 : 0]);
    }

    // Object format - return in standard order
    return standardFlags.map((name) => {
      // Find the flag value by case-insensitive key matching
      let value = 0;
      for (const [key, val] of Object.entries(flags)) {
        if (key.toLowerCase() === name.toLowerCase()) {
          value = val ? 1 : 0;
          break;
        }
      }
      return [name, value];
    });
  };

  const flagEntries = getFlagEntries(currentCycle?.flags);
  const memoryEntries = Object.entries(currentCycle?.memory || {});

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Animation loop
  useEffect(() => {
    if (!isOpen) return;
    if (totalCycles === 0) return;
    if (!isPlaying) return;
    if (isLastCycle) {
      setIsPlaying(false);
      return;
    }

    animationRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= totalCycles ? totalCycles - 1 : next;
      });
    }, animationSpeed);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isOpen, isPlaying, safeIndex, totalCycles, animationSpeed, isLastCycle]);

  // Scroll timeline into view
  useEffect(() => {
    if (timelineRef.current && safeIndex >= 0) {
      const timelineElement = timelineRef.current;
      const dotWidth = 48;
      const scrollPosition =
        safeIndex * dotWidth - timelineElement.clientWidth / 2;
      timelineElement.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  }, [safeIndex]);

  const handlePrevious = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (safeIndex < totalCycles - 1) {
      setCurrentIndex(safeIndex + 1);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isLastCycle) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed) => {
    setAnimationSpeed(speed);
  };

  const handleSeek = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mb-16 z-50 bg-gray-100 overflow-y-auto">
      {/* Header */}
      <header
        className="
          fixed top-0 left-1/2 -translate-x-1/2
          w-full lg:max-w-full
          bg-blue-900 px-4 py-3 lg:py-5
          flex items-center justify-center gap-2
          z-50
        "
      >
        <BackButton />
        <CpuChipIcon className="h-5 w-5 text-white" />

        <h3 className="text-white text-sm font-semibold lg:text-lg">
          Computer Architecture ToolKit
        </h3>
      </header>

      <div className="p-4 pb-8 mt-20 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-gray-500 text-xs font-bold mb-1">Total</p>
            <p className="text-blue-900 text-xl font-bold">{totalCycles}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-gray-500 text-xs font-bold mb-1">Current</p>
            <p className="text-blue-900 text-xl font-bold">
              {currentCycle?.tState || "-"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <p className="text-gray-500 text-xs font-bold mb-1">Status</p>
            <p
              className={`text-xl font-bold ${isLastCycle ? "text-green-600" : "text-blue-900"}`}
            >
              {totalCycles === 0 ? "Empty" : isLastCycle ? "Done" : "Run"}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
              <div
                className="absolute w-28 h-28 rounded-full border-4 border-transparent animate-spin"
                style={{
                  borderTopColor: stageColor,
                  borderRightColor: stageColor,
                }}
              ></div>
              <p className="text-3xl font-black" style={{ color: stageColor }}>
                {currentCycle?.tState || "T0"}
              </p>
            </div>

            <div className="flex-1">
              <div
                className="inline-block px-3 py-1 rounded-lg mb-2"
                style={{ backgroundColor: stageBg }}
              >
                <p className="text-xs font-black" style={{ color: stageColor }}>
                  {currentStage.toUpperCase()}
                </p>
              </div>
              <p className="text-gray-500 text-xs font-bold mb-1">
                Instruction
              </p>
              <p className="text-gray-900 font-bold text-base truncate">
                {currentCycle?.instruction || "-"}
              </p>
              <p className="text-gray-500 text-xs font-semibold mt-2">
                Cycle {totalCycles > 0 ? safeIndex + 1 : 0} of {totalCycles}
              </p>
            </div>
          </div>

          <div
            className="mt-3 p-3 rounded-lg border"
            style={{ borderColor: stageColor, backgroundColor: "#F8FBFF" }}
          >
            <p className="text-gray-500 text-xs font-bold mb-1">
              Micro Operation
            </p>
            <p
              className="text-sm font-bold break-words"
              style={{ color: stageColor }}
            >
              {currentCycle?.microOperation || "-"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: stageColor,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 mb-4 bg-white rounded-xl border border-gray-200 p-3">
          <button
            onClick={handlePrevious}
            disabled={safeIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={handlePlayPause}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold transition"
          >
            {isPlaying ? (
              <div className="flex items-center gap-2">
                <PauseIcon className="w-4 h-4" />
                <span>Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlayIcon className="w-4 h-4" />
                <span>{isLastCycle ? "Restart" : "Play"}</span>
              </div>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={safeIndex === totalCycles - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>

          <select
            value={animationSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="ml-2 px-2 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
            <option value={200}>Very Fast</option>
          </select>
        </div>

        {/* Timeline */}
        <div
          ref={timelineRef}
          className="overflow-x-auto bg-white rounded-xl border border-gray-200 p-3 mb-4"
        >
          <div className="flex gap-1" style={{ minWidth: "max-content" }}>
            {cycleTrace.map((cycle, index) => (
              <button
                key={`${cycle?.tState || "T"}-${index}`}
                onClick={() => handleSeek(index)}
                className="focus:outline-none"
              >
                <TimelineDot
                  cycle={cycle}
                  active={index === safeIndex}
                  done={index <= safeIndex}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Registers Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CpuChipIcon className="w-5 h-5 text-blue-900" />
            <h3 className="font-extrabold text-gray-800">Registers</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {registerEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">No registers found</p>
            ) : (
              registerEntries.map(([name, value]) => (
                <ValueCard
                  key={name}
                  name={name}
                  value={value}
                  changed={isChanged(currentCycle?.changedRegisters, name)}
                />
              ))
            )}
          </div>
        </div>

        {/* Flags Section - Updated with better display */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FlagIcon className="w-5 h-5 text-purple-900" />
            <h3 className="font-extrabold text-gray-800">Flag Registers</h3>
          </div>
          {flagEntries.length === 0 ? (
            <p className="text-gray-500 text-sm">No flags found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flagEntries.map(([name, value]) => {
                const isFlagChanged = currentCycle?.changedFlags?.some(
                  (flag) => normalize(flag) === normalize(name),
                );
                return (
                  <div
                    key={name}
                    className={`
                      rounded-lg p-4 text-center border-2 transition-all duration-300
                      ${isFlagChanged ? "bg-green-50 border-green-500 shadow-md" : "bg-purple-50 border-purple-200"}
                    `}
                  >
                    <p
                      className={`text-sm font-bold uppercase mb-2 ${isFlagChanged ? "text-green-700" : "text-purple-700"}`}
                    >
                      {name}
                    </p>
                    <p
                      className={`text-3xl font-black ${value === 1 ? "text-green-600" : "text-gray-500"}`}
                    >
                      {value}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {value === 1 ? "SET" : "CLEAR"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Memory Section */}
        {memoryEntries.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <ServerIcon className="w-5 h-5 text-green-700" />
              <h3 className="font-extrabold text-gray-800">Memory</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {memoryEntries.map(([address, value]) => (
                <ValueCard
                  key={address}
                  name={`[${address}]`}
                  value={value}
                  changed={isChanged(currentCycle?.changedMemory, address)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Help Box */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <h4 className="text-blue-900 font-extrabold text-sm mb-2">
            How to read this?
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed">
            Each T-state represents one clock cycle. The Fetch phase loads the
            instruction, the Decode phase interprets the operands, and the
            Execute phase performs the required operation. The flags indicate
            the current CPU status after each operation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CycleAnimationScreen;
