import { useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/outline";

function Debugging() {
  const { id } = useParams();
  const [registers, setRegisters] = useState([
    { name: "R1", value: 0 },
    { name: "R2", value: 0 },
    { name: "R3", value: 0 },
    { name: "R4", value: 0 },
    { name: "R5", value: 0 },
    { name: "PC", value: 0 },
    { name: "SP", value: 0 },
    { name: "IR", value: 0 },
  ]);

  const [flags, setFlags] = useState([
    { name: "Carry", value: 0 },
    { name: "Overflow", value: 0 },
    { name: "Sign", value: 0 },
    { name: "Zero", value: 0 },
  ]);

  const [loadingStep, setLoadingStep] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const getInstructions = () => {
    return code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
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

      setRegisters((prev) =>
        prev.map((reg, index) => ({
          ...reg,
          value: data.Registers?.[index] ?? reg.value,
        })),
      );

      setFlags((prev) =>
        prev.map((flag, index) => ({
          ...flag,
          value: data.Flags?.[index] ?? flag.value,
        })),
      );

      console.log(res.data);

      setOutput(JSON.stringify(data));
      setError("");

      setStep((prev) => prev + 1);
    } catch (err) {
      console.log("Error in Debugging:", err);

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

      setRegisters((prev) =>
        prev.map((reg, index) => ({
          ...reg,
          value: data.Registers?.[index] ?? reg.value,
        })),
      );

      setFlags((prev) =>
        prev.map((flag, index) => ({
          ...flag,
          value: data.Flags?.[index] ?? flag.value,
        })),
      );

      setOutput(JSON.stringify(data));
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

    setRegisters([
      { name: "R1", value: 0 },
      { name: "R2", value: 0 },
      { name: "R3", value: 0 },
      { name: "R4", value: 0 },
      { name: "R5", value: 0 },
      { name: "PC", value: 0 },
      { name: "SP", value: 0 },
      { name: "IR", value: 0 },
    ]);

    setFlags([
      { name: "Carry", value: 0 },
      { name: "Overflow", value: 0 },
      { name: "Sign", value: 0 },
      { name: "Zero", value: 0 },
    ]);
  };

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
              <button className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold">
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleStep}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold"
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
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded-lg border border-blue-900 text-xs rounded font-bold"
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
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setStep(0);
                  }}
                  className="p-4 rounded-xl bg-gray-100 text-black w-full h-48 focus:ring-gray-300"
                  placeholder={`Program Display.`}
                />
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
              <div className="mt-5">
                <p className="text-sm text-gray-700 mb-2">Error Display</p>
                <div className="p-4 bg-red-100 rounded-xl bg-gray-100 w-full focus:ring-gray-300">
                  <p className="text-red-500">
                    {error || "No error Detected.."}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Flag Registers</p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {flags.map((flag, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-gray-700 mb-1">
                          {flag.name}
                        </p>
                        <div className="border rounded-md py-2 bg-white text-black text-sm">
                          {flag.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full text-black">
              <p>Output</p>
              <div className="border border-gray-300 rounded-lg h-24 w-full bg-gray-100 overflow-y-auto">
                <p className="text-gray-400 p-4 font-mono">
                  {output || "No Output to display..."}
                </p>
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
