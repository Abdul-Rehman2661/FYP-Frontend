import React, { useState } from "react";
import { useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext.jsx";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

// ================= CYCLE COUNT CONSTANTS =================
// Teacher concept:
// T0: AR <- PC       Fetch
// T1: IR <- M[AR]   Fetch
// T2: Decode        Decode
// T3...Tn: Action   Execute
const FETCH_CYCLES = 2;
const DECODE_CYCLES = 1;
const MIN_EXECUTE_CYCLES = 1;

const isEmptyCycleValue = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "-" ||
    value === "NULL" ||
    value === "null"
  );
};

const stripActionComment = (line) => {
  return String(line || "")
    .replace(/\/\/.*$/g, "")
    .trim();
};

const getActionSteps = (actionText) => {
  if (isEmptyCycleValue(actionText)) {
    return [];
  }

  return String(actionText)
    .split(/[\n;]+/)
    .map((step) => stripActionComment(step))
    .filter((step) => !isEmptyCycleValue(step));
};

const calculateInstructionCycleInfo = (actionText, isInterruptInstruction) => {
  if (isInterruptInstruction) {
    return {
      fetchCycles: FETCH_CYCLES,
      decodeCycles: DECODE_CYCLES,
      executeCycles: MIN_EXECUTE_CYCLES,
      totalCycles: FETCH_CYCLES + DECODE_CYCLES + MIN_EXECUTE_CYCLES,
      actionSteps: ["Interrupt input/output operation"],
    };
  }

  const actionSteps = getActionSteps(actionText);
  const executeCycles = Math.max(actionSteps.length, MIN_EXECUTE_CYCLES);
  const totalCycles = FETCH_CYCLES + DECODE_CYCLES + executeCycles;

  return {
    fetchCycles: FETCH_CYCLES,
    decodeCycles: DECODE_CYCLES,
    executeCycles,
    totalCycles,
    actionSteps,
  };
};

const buildInstructionPreview = (mnemonic, operands, isInterrupt) => {
  if (!mnemonic || !mnemonic.trim()) {
    return "Write mnemonic to show instruction preview";
  }

  if (isInterrupt) {
    return `${mnemonic.trim()} interrupt`;
  }

  if (!Array.isArray(operands) || operands.length === 0) {
    return mnemonic.trim();
  }

  const operandText = operands.map((op, index) => {
    if (op.type === "Immediate") {
      return index === 0 ? "5" : "10";
    }
    if (op.type === "Memory") {
      return `[${50 + index}]`;
    }
    if (op.type === "Indirect") {
      return `@[${50 + index}]`;
    }
    return `R${index + 1}`;
  });

  return `${mnemonic.trim()} ${operandText.join(",")}`;
};

export default function Instruction() {
  const navigate = useNavigate();

  // Form states
  const [opcode, setOpcode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [action, setAction] = useState("");
  const [interruptSymbol, setInterruptSymbol] = useState("");
  const [inputRegister, setInputRegister] = useState("");
  const [outputRegister, setOutputRegister] = useState("");
  const [addedInstructions, setAddedInstructions] = useState([]);
  const [isInterrupt, setIsInterrupt] = useState(false);
  const [operands, setOperands] = useState([
    { id: 1, type: "Register", selected: false },
  ]);

  // Calculate current cycle info for preview
  const currentCycleInfo = calculateInstructionCycleInfo(action, isInterrupt);
  const instructionPreview = buildInstructionPreview(mnemonic, operands, isInterrupt);

  const {
    architectureData,
    registerData,
    addressingModesData,
    setInstructionData,
  } = useContext(ArchitectureContext);

  // Get the maximum number of instructions from architecture data
  const maxInstructions = architectureData?.noOfInstructions || 0;
  const currentInstructionsCount = addedInstructions.length;

  useEffect(() => {
    if (inputRegister && inputRegister === outputRegister) {
      setOutputRegister("");
    }
  }, [inputRegister]);

  useEffect(() => {
    if (outputRegister && outputRegister === inputRegister) {
      setInputRegister("");
    }
  }, [outputRegister]);

  const DisplayInstruction = () => {
    // Check if adding this instruction would exceed the limit
    if (currentInstructionsCount + 1 > maxInstructions) {
      toast.error(
        `Cannot add more instructions. Maximum limit is ${maxInstructions} instructions (${currentInstructionsCount} already added).`,
      );
      return;
    }

    // Validation only for Opcode, Mnemonic, and Action
    if (!opcode || !opcode.trim()) {
      toast.error("Please enter Opcode");
      return;
    }

    if (!mnemonic || !mnemonic.trim()) {
      toast.error("Please enter Mnemonic");
      return;
    }

    if (!action || !action.trim()) {
      toast.error("Please enter Action (Java Code)");
      return;
    }

    // Check for duplicate opcode
    const isDuplicateOpcode = addedInstructions.some(
      (item) => item.opcode.toLowerCase() === opcode.trim().toLowerCase(),
    );

    if (isDuplicateOpcode) {
      toast.error(
        `Opcode "${opcode}" already exists. Please use a unique opcode.`,
      );
      return;
    }

    // Check for duplicate mnemonic
    const isDuplicateMnemonic = addedInstructions.some(
      (item) => item.mnemonic.toLowerCase() === mnemonic.trim().toLowerCase(),
    );

    if (isDuplicateMnemonic) {
      toast.error(
        `Mnemonic "${mnemonic}" already exists. Please use a unique mnemonic.`,
      );
      return;
    }

    if (isInterrupt) {
      if (!interruptSymbol || !inputRegister || !outputRegister) {
        toast.error("Please fill all interrupt instruction fields");
        return;
      }
    }

    // Find which operand is the destination (selected radio button)
    const selectedIndex = operands.findIndex((op) => op.selected === true);
    
    // Force correct mapping for DestinationOperand (1, 2, or 3)
    let destinationOperand = 0;
    if (selectedIndex === 0) destinationOperand = 1;  // Operand 1 selected
    if (selectedIndex === 1) destinationOperand = 2;  // Operand 2 selected
    if (selectedIndex === 2) destinationOperand = 3;  // Operand 3 selected

    // Validation: If there are operands, at least one must be selected as destination
    if (operands.length > 0 && destinationOperand === 0) {
      toast.error("Please select a destination operand using the radio button");
      return;
    }

    // --- Map operands to Operand1, Operand2, Operand3 fields ---
    const operand1 = operands[0]?.type || null;
    const operand2 = operands[1]?.type || null;
    const operand3 = operands[2]?.type || null;

    // Create the Operands list for the List<Operand> property
    const operandsList = operands.map((op, index) => ({
      destination: op.selected,
      type: op.type,
      position: index + 1,
    }));

    // Get cycle info for this instruction
    const cycleInfo = calculateInstructionCycleInfo(action, isInterrupt);
    const finalInstructionPreview = buildInstructionPreview(mnemonic, operands, isInterrupt);

    const newRecord = {
      opcode,
      mnemonic,
      action,
      interruptSymbol,
      inputRegister,
      outputRegister,
      // For UI display
      operands: operands.map((op) => ({
        type: op.type,
        selected: op.selected,
      })),
      // For database fields - Operand1, Operand2, Operand3
      operand1,
      operand2,
      operand3,
      // For database fields - NumberOfOperands and DestinationOperand
      numberOfOperands: operands.length,
      destinationOperand: destinationOperand, // Now correctly saves 1, 2, or 3
      // For List<Operand> property
      operandsList: operandsList,
      instructionFormat: operands.length,
      
      // ================= CYCLE COUNT DATA =================
      instructionPreview: finalInstructionPreview,
      fetchCycles: cycleInfo.fetchCycles,
      decodeCycles: cycleInfo.decodeCycles,
      executeCycles: cycleInfo.executeCycles,
      cycleCount: cycleInfo.totalCycles,
      actionSteps: cycleInfo.actionSteps,
    };

    const updatedInstructions = [...addedInstructions, newRecord];

    setAddedInstructions(updatedInstructions);
    setInstructionData(updatedInstructions);

    setOpcode("");
    setMnemonic("");
    setAction("");
    setInterruptSymbol("");
    setInputRegister("");
    setOutputRegister("");
    setOperands([{ id: Date.now(), type: "Register", selected: false }]);

    toast.success(
      `Instruction "${mnemonic}" added successfully! (${currentInstructionsCount + 1}/${maxInstructions} instructions used)`,
    );
  };

  const handleAddOperand = () => {
    if (operands.length >= 3) {
      toast.error("Maximum 3 operands allowed per instruction!");
      return;
    }
    
    setOperands([
      ...operands,
      {
        id: Date.now(),
        type: "Register",
        selected: false,
      },
    ]);
  };

  // FIXED: Ensure proper radio button selection
  const handleRadio = (id) => {
    console.log("Radio clicked for id:", id);
    console.log("Before update - operands:", JSON.parse(JSON.stringify(operands)));
    
    const updatedOperands = operands.map((op) => {
      const newSelected = op.id === id;
      console.log(`Operand id ${op.id} - was ${op.selected}, now ${newSelected}`);
      return {
        ...op,
        selected: newSelected
      };
    });
    
    console.log("After update - operands:", JSON.parse(JSON.stringify(updatedOperands)));
    setOperands(updatedOperands);
  };

  const handleType = (id, value) => {
    setOperands(
      operands.map((op) => 
        op.id === id ? { ...op, type: value } : op
      ),
    );
  };

  const handleDelete = (id) => {
    const deletedOperand = operands.find(op => op.id === id);
    const wasSelected = deletedOperand?.selected;
    
    const updatedOperands = operands.filter((op) => op.id !== id);
    
    // If we deleted an operand that was selected, clear selection from all
    if (wasSelected && updatedOperands.length > 0) {
      const clearedOperands = updatedOperands.map(op => ({
        ...op,
        selected: false
      }));
      setOperands(clearedOperands);
    } else {
      setOperands(updatedOperands);
    }
  };

  const handleCreate = async () => {
    // Validate that at least one instruction is added
    if (addedInstructions.length === 0) {
      toast.error(
        "Please add at least one instruction before creating architecture",
      );
      return;
    }

    try {
      const flatRegisters = [
        ...(registerData.flagRegisters || []),
        ...(registerData.generalPurposeRegisters || []).map((reg) => ({
          name: reg.name,
          action: "",
        })),
      ];

      const mappedAddressingModes = (addressingModesData || []).map((m) => ({
        addressingModeName: m.mode,
        addressingModeCode: m.code,
        addressingModeSymbol: m.sym,
      }));

      const mappedInstructions = (addedInstructions || []).map((ins) => ({
        mnemonics: ins.mnemonic,
        opcode: ins.opcode,
        operand1: ins.operand1,
        operand2: ins.operand2,
        operand3: ins.operand3,
        numberOfOperands: ins.numberOfOperands,
        destinationOperand: ins.destinationOperand,
        instructionFormat: ins.instructionFormat,
        operands: ins.operandsList || [],
        action: ins.action,
        interruptSymbol: ins.interruptSymbol || null,
        outputRegister: ins.outputRegister || null,
        inputRegister: ins.inputRegister || null,
        // Include cycle count data in the payload
        instructionPreview: ins.instructionPreview,
        fetchCycles: ins.fetchCycles,
        decodeCycles: ins.decodeCycles,
        executeCycles: ins.executeCycles,
        cycleCount: ins.cycleCount,
        actionSteps: ins.actionSteps,
      }));

      const payload = {
        architecture: {
          name: architectureData.name,
          memorySize: Number(architectureData.memorySize),
          stackSize: Number(architectureData.stackSize),
          busSize: Number(architectureData.busSize),
          numberOfRegisters: Number(architectureData.noOfRegisters),
          numberOfInstructions: Number(architectureData.noOfInstructions),
        },
        registers: flatRegisters,
        instructions: mappedInstructions,
        addressingModes: mappedAddressingModes,
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/architecture/create-full`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create architecture");
        return;
      }
      toast.success("Architecture Created Successfully!", {
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: "#1e293b",
          color: "#fff",
        },
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 1 },
      });
    } catch (err) {
      console.error("Frontend Error:", err);
      toast.error("Something went wrong ");
    }
  };

  // Get General Purpose Registers (exclude Flag Registers)
  const generalPurposeRegisters =
    registerData && typeof registerData === "object"
      ? (registerData.generalPurposeRegisters || []).filter(
          (reg) =>
            !reg.isFlag &&
            reg.isFlag !== 1 &&
            reg.isFlagRegister !== true &&
            reg.isFlagRegister !== 1,
        )
      : [];

  const inputRegisterOptions = generalPurposeRegisters.filter(
    (reg) => reg.name !== outputRegister,
  );

  const outputRegisterOptions = generalPurposeRegisters.filter(
    (reg) => reg.name !== inputRegister,
  );

  return (
    <>
      <Header />
      <div className="pt-20 lg:pt-24 p-4 bg-gray-100">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Instruction Design
        </h2>

        {/* Show Instruction Limit Info */}
        {/* {maxInstructions > 0 && (
          <div className="mt-4 mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Instruction Limit:</span> You can
              add up to {maxInstructions} instructions. Currently added:{" "}
              <span className="font-semibold">{currentInstructionsCount}</span>/
              {maxInstructions}
            </p>
          </div>
        )} */}

        <div className="mt-4 mb-20 bg-white shadow p-4 rounded-xl">
          {/* Interrupt Checkbox */}
          {/* <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isInterrupt}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setIsInterrupt(newValue);
                  if (!newValue) {
                    setInterruptSymbol("");
                    setInputRegister("");
                    setOutputRegister("");
                  }
                }}
                className="w-4 h-4 accent-blue-900"
              />
              <span className="text-black">Interrupt Instruction</span>
            </label>
          </div> */}

          {/* Opcode & Mnemonics */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <span className="text-black">OpCode</span>
              <br />
              <input
                className="mt-2 h-8 mb-5 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900 "
                type="text"
                value={opcode}
                onChange={(e) => setOpcode(e.target.value)}
                placeholder="Enter Instruction Code e.g (01)"
              />
            </div>

            <div className="w-full md:w-1/2">
              <span className="text-black">Mnemonics</span>
              <br />
              <input
                className="mt-2 h-8 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                type="text"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter Instruction Mnemonics e.g ADD"
              />
            </div>
          </div>

          {/* Operands and Destination */}
          {!isInterrupt && (
            <>
              <div className="flex justify-between mb-4">
                <span className="text-black">Operands</span>
                {operands.some(op => op.selected) && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Destination: Operand {operands.findIndex(op => op.selected) + 1}
                  </span>
                )}
                {operands.length > 0 && !operands.some(op => op.selected) && (
                  <span className="text-xs text-red-500 font-medium">
                    ⚠ Select destination
                  </span>
                )}
              </div>

              {/* Operands List */}
              {operands.map((op, index) => (
                <div
                  key={op.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3"
                >
                  <span className="text-black mb-2 md:mb-0">
                    Operand {index + 1}
                  </span>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <select
                      value={op.type}
                      onChange={(e) => handleType(op.id, e.target.value)}
                      className="border rounded-md px-2 bg-white text-black py-1 text-sm flex-1 sm:flex-none"
                    >
                      <option value="Register">Register</option>
                      <option value="Immediate">Immediate</option>
                      <option value="Memory">Memory</option>
                      <option value="Memory">Indirect</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="destination"
                        checked={op.selected === true}
                        onChange={() => handleRadio(op.id)}
                        className="w-4 h-4 rounded-full border border-black bg-white"
                      />
                      <span className={`text-sm ${op.selected ? 'text-blue-900 font-semibold' : 'text-gray-600'}`}>
                        Dest
                      </span>
                    </label>

                    <button
                      onClick={() => handleDelete(op.id)}
                      className="text-red-700 hover:text-red-900"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>

                    {index === operands.length - 1 && (
                      <button
                        onClick={() => {
                          if (operands.length >= 3) {
                            toast.error("Maximum 3 operands allowed per instruction!");
                            return;
                          }
                          handleAddOperand();
                        }}
                        className="text-blue-600 text-xl font-bold"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Interrupt Instruction Fields */}
          {/* {isInterrupt && (
            <div className="mt-4 space-y-4">
              <div>
                <span className="text-black">Interrupt Symbol</span>
                <select
                  value={interruptSymbol}
                  onChange={(e) => setInterruptSymbol(e.target.value)}
                  className="mt-2 w-full border rounded-md px-3 py-2 bg-white text-black text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                >
                  <option value="">Select Interrupt</option>
                  <option value="1(Input)">1(Input)</option>
                  <option value="2(Output)">2(Output)</option>
                </select>
              </div>

              <div>
                <span className="text-black">Input Register</span>
                <select
                  value={inputRegister}
                  onChange={(e) => setInputRegister(e.target.value)}
                  className="mt-2 w-full border rounded-md px-3 py-2 bg-white text-black text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                >
                  <option value="">Select Input Register</option>
                  {inputRegisterOptions.map((reg) => (
                    <option key={reg.name} value={reg.name}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-black">Output Register</span>
                <select
                  value={outputRegister}
                  onChange={(e) => setOutputRegister(e.target.value)}
                  className="mt-2 w-full border rounded-md px-3 py-2 bg-white text-black text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                >
                  <option value="">Select Output Register</option>
                  {outputRegisterOptions.map((reg) => (
                    <option key={reg.name} value={reg.name}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )} */}

          {/* Action */}
          <div className="mt-4">
            <span className="text-black block mb-2">Action (Java Code)</span>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="// Write Java Code Here"
              className="w-full border rounded-md p-2 h-24 border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
            ></textarea>
          </div>

          {/* ================= LIVE CYCLE COUNT PREVIEW ================= */}
          {/* <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 mb-2 text-center">
              Clock Cycle Count
            </h3>
            
            <p className="text-xs text-blue-800 font-semibold mb-3 text-center">
              Instruction: {instructionPreview}
            </p>

            {!mnemonic || !mnemonic.trim() ? (
              <p className="text-xs text-red-600 font-semibold text-center">
                Write mnemonic to calculate cycle count.
              </p>
            ) : !isInterrupt && !action.trim() ? (
              <p className="text-xs text-red-600 font-semibold text-center">
                Write action to calculate execute cycles.
              </p>
            ) : (
              <>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">Fetch:</span>
                  <span className="text-gray-900 font-bold">{currentCycleInfo.fetchCycles}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">Decode:</span>
                  <span className="text-gray-900 font-bold">{currentCycleInfo.decodeCycles}</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-700 font-medium">Execute:</span>
                  <span className="text-gray-900 font-bold">{currentCycleInfo.executeCycles}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-blue-200">
                  <span className="text-blue-900 font-bold">Total Cycles:</span>
                  <span className="text-blue-900 font-bold">{currentCycleInfo.totalCycles}</span>
                </div>
                {currentCycleInfo.actionSteps.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Action Steps: {currentCycleInfo.actionSteps.join(" | ")}
                  </p>
                )}
              </>
            )}
          </div> */}

          {/* Added Instructions List */}
          {addedInstructions.length > 0 && (
            <div className="mt-6 mb-3 border rounded-md p-4 text-black text-sm bg-gray-50">
              <h3 className="text-blue-900 font-semibold mb-2">
                Added Instructions ({addedInstructions.length}/{maxInstructions})
              </h3>

              {addedInstructions.map((item, index) => (
                <div key={index} className="mb-3 border-b border-gray-200 pb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="flex">
                      <p className="text-blue-900 font-medium mr-1 w-24">
                        OpCode:
                      </p>
                      <p>{item.opcode}</p>
                    </span>

                    <span className="flex">
                      <p className="text-blue-900 font-medium mr-1 w-24">
                        Mnemonic:
                      </p>
                      <p>{item.mnemonic}</p>
                    </span>

                    <span className="flex col-span-2">
                      <p className="text-blue-900 font-medium mr-1 w-24">
                        Action:
                      </p>
                      <p className="truncate">
                        {item.action.substring(0, 50)}...
                      </p>
                    </span>

                    {item.interruptSymbol && (
                      <>
                        <span className="flex">
                          <p className="text-blue-900 font-medium mr-1 w-24">
                            Interrupt:
                          </p>
                          <p>{item.interruptSymbol}</p>
                        </span>

                        <span className="flex">
                          <p className="text-blue-900 font-medium mr-1 w-24">
                            Input Reg:
                          </p>
                          <p>{item.inputRegister}</p>
                        </span>

                        <span className="flex">
                          <p className="text-blue-900 font-medium mr-1 w-24">
                            Output Reg:
                          </p>
                          <p>{item.outputRegister}</p>
                        </span>
                      </>
                    )}

                    <span className="flex col-span-2">
                      <p className="text-blue-900 font-medium mr-1 w-24">
                        Operands:
                      </p>
                      <p>
                        {item.operands.map((op, i) => (
                          <span key={i} className="mr-2">
                            {op.type}
                            {op.selected ? " (Dest)" : ""}
                            {i < item.operands.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </p>
                    </span>

                    {/* Cycle Count Display in Added Instructions */}
                    <div className="col-span-2 mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold text-blue-900">Cycle Count:</span>
                        <br />
                        Fetch: <span className="text-green-700 font-mono">{item.fetchCycles}</span> | 
                        Decode: <span className="text-green-700 font-mono">{item.decodeCycles}</span> | 
                        Execute: <span className="text-green-700 font-mono">{item.executeCycles}</span>
                        <br />
                        <span className="font-semibold">Total Cycles:</span>{' '}
                        <span className="text-green-700 font-mono font-bold">{item.cycleCount}</span>
                      </p>
                      {item.actionSteps && item.actionSteps.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Steps: {item.actionSteps.join(" → ")}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2 mt-1 p-2 bg-gray-100 rounded">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold text-blue-900">Database Fields:</span>
                        <br />
                        NumberOfOperands: <span className="text-green-700 font-mono">{item.numberOfOperands}</span>
                        {' | '}
                        <span className="font-semibold">DestinationOperand:</span>{' '}
                        <span className="text-green-700 font-mono font-bold">
                          {item.destinationOperand > 0
                            ? `${item.destinationOperand} (Operand ${item.destinationOperand} is Destination)`
                            : "None (0)"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD Button */}
          <button
            onClick={DisplayInstruction}
            disabled={
              currentInstructionsCount >= maxInstructions && maxInstructions > 0
            }
            className={`w-full py-2 rounded-md mt-4 transition ${
              currentInstructionsCount >= maxInstructions && maxInstructions > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-800 text-white"
            }`}
          >
            ADD{" "}
            {currentInstructionsCount >= maxInstructions &&
              maxInstructions > 0 &&
              "(Limit Reached)"}
          </button>

          {/* Create Architecture Button */}
          <button
            onClick={handleCreate}
            className="w-full bg-blue-900 text-white py-3 rounded-md mt-6 font-semibold hover:bg-blue-800"
          >
            Create Architecture
          </button>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}