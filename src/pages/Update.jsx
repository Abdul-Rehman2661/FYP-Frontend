import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Update() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [archName, setArchName] = useState("");
  const [memorySize, setMemorySize] = useState("");
  const [busSize, setBusSize] = useState("");
  const [stackSize, setStackSize] = useState("");
  const [noOfRegisters, setNoOfRegisters] = useState("");
  const [noOfInstructions, setNoOfInstructions] = useState("");

  const [flagRegister, setFlagRegister] = useState("");
  const [flagAction, setFlagAction] = useState("");
  const [flagRegisterList, setFlagRegisterList] = useState([]);

  const [gpRegister, setGpRegister] = useState("");
  const [gpRegisterList, setGpRegisterList] = useState([]);
  const [currentGPIndex, setCurrentGPIndex] = useState(0);

  const [addressingMode, setAddressingMode] = useState("");
  const [addressingModeCode, setAddressingModeCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [addressingModeList, setAddressingModeList] = useState([]);
  const [currentModeIndex, setcurrentModeIndex] = useState(0);

  const [opcode, setOpcode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [action, setAction] = useState("");
  const [interruptSymbol, setInterruptSymbol] = useState("");
  const [inputRegister, setInputRegister] = useState("");
  const [outputRegister, setOutputRegister] = useState("");
  const [CPUlist, setCPUlist] = useState([]);
  const [addedInstructions, setAddedInstructions] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  const [operands, setOperands] = useState([
    { id: 1, type: "Register", selected: false },
  ]);

  const [isInterrupt, setIsInterrupt] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/architecture/get-full/${id}`,
        );

        const data = await res.json();

        console.log("API RESPONSE:", data);

        const arch = data.Architecture;

        setArchName(arch?.Name || "");
        setMemorySize(arch?.MemorySize || "");
        setStackSize(arch?.StackSize || "");
        setBusSize(arch?.BusSize || "");
        setNoOfRegisters(arch?.NumberOfRegisters || "");
        setNoOfInstructions(arch?.NumberOfInstructions || "");

        // ✅ Fixed: Registers with proper fields
        setFlagRegisterList(
          data.Registers?.filter((r) => r.IsFlagRegister).map((r) => ({
            name: r.Name,
            Action: r.Action,
            RegisterSize: r.RegisterSize,
            RegisterCode: r.RegisterCode,
          })) || [],
        );

        setGpRegisterList(
          data.Registers?.filter((r) => !r.IsFlagRegister).map((r) => ({
            name: r.Name,
            RegisterSize: r.RegisterSize,
            RegisterCode: r.RegisterCode,
          })) || [],
        );

        setAddressingModeList(
          data.AddressingModes?.map((m) => ({
            mode: m.AddressingModeName,
            code: m.AddressingModeCode,
            sym: m.AddressingModeSymbol,
          })) || [],
        );

        // ✅ Fixed: Instructions with proper operands mapping
        setAddedInstructions(
          data.Instructions?.map((ins) => {
            let operandsList = [];
            if (ins.Operands) {
              if (typeof ins.Operands === "string") {
                try {
                  operandsList = JSON.parse(ins.Operands);
                } catch (e) {
                  operandsList = [];
                }
              } else if (Array.isArray(ins.Operands)) {
                operandsList = ins.Operands;
              }
            }

            return {
              mnemonics: ins.Mnemonics,
              opcode: ins.Opcode,
              action: ins.Action,
              interruptSymbol: ins.InterruptSymbol,
              inputRegister: ins.InputRegister,
              outputRegister: ins.OutputRegister,
              operands: operandsList,
              destinationOperand: ins.DestinationOperand,
              numberOfOperands: ins.NumberOfOperands,
              instructionFormat: ins.InstructionFormat,
              operand1: ins.Operand1,
              operand2: ins.Operand2,
              operand3: ins.Operand3,
            };
          }) || [],
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    if (gpRegisterList.length > 0) {
      setGpRegister(gpRegisterList[0].name);
    }
  }, [gpRegisterList]);

  useEffect(() => {
    if (addressingModeList.length > 0) {
      const current = addressingModeList[currentModeIndex];
      setAddressingMode(current.mode);
      setAddressingModeCode(current.code);
      setSymbol(current.sym);
    }
  }, [addressingModeList, currentModeIndex]);

  useEffect(() => {
    if (
      addedInstructions.length > 0 &&
      currentInstructionIndex < addedInstructions.length
    ) {
      const current = addedInstructions[currentInstructionIndex];

      setOpcode(current.opcode || "");
      setMnemonic(current.mnemonics || "");
      setAction(current.action || "");
      setInterruptSymbol(current.interruptSymbol || "");
      setInputRegister(current.inputRegister || "");
      setOutputRegister(current.outputRegister || "");

      const operandsList = current.operands || [];
      setOperands(
        operandsList.length > 0
          ? operandsList
          : [{ id: 1, type: "Register", selected: false }],
      );

      setIsInterrupt(!!current.interruptSymbol);
    } else if (addedInstructions.length === 0) {
      setOpcode("");
      setMnemonic("");
      setAction("");
      setInterruptSymbol("");
      setInputRegister("");
      setOutputRegister("");
      setOperands([{ id: 1, type: "Register", selected: false }]);
      setIsInterrupt(false);
    }
  }, [addedInstructions, currentInstructionIndex]);

  const buildPayload = () => {
    return {
      Architecture: {
        Name: archName,
        MemorySize: parseInt(memorySize) || 0,
        StackSize: parseInt(stackSize) || 0,
        BusSize: parseInt(busSize) || 0,
        NumberOfRegisters: parseInt(noOfRegisters) || 0,
        NumberOfInstructions: parseInt(noOfInstructions) || 0,
      },

      // ✅ Fixed: Registers with all required fields
      Registers: [
        ...flagRegisterList.map((f, idx) => ({
          Name: f.name,
          RegisterSize: f.RegisterSize || 32,
          RegisterCode: f.RegisterCode || `F${idx}`,
          Action: f.Action || "Flag register",
          IsFlagRegister: true,
        })),
        ...gpRegisterList.map((g, idx) => ({
          Name: g.name,
          RegisterSize: g.RegisterSize || 32,
          RegisterCode: g.RegisterCode || `R${idx}`,
          Action: "General purpose register",
          IsFlagRegister: false,
        })),
      ],

      // ✅ Fixed: Instructions with proper payload structure
      Instructions: addedInstructions.map((ins) => {
        const operandsList = ins.operands || [];
        const destIndex = operandsList.findIndex((op) => op.selected);

        return {
          Mnemonics: ins.mnemonics,
          Opcode: ins.opcode,
          Operands: operandsList,
          DestinationOperand: destIndex + 1,
          NumberOfOperands: operandsList.length,
          Action: ins.action,
          InstructionFormat: operandsList.length,
          Operand1: operandsList[0]?.type || null,
          Operand2: operandsList[1]?.type || null,
          Operand3: operandsList[2]?.type || null,
          InterruptSymbol: ins.interruptSymbol || null,
          InputRegister: ins.inputRegister || null,
          OutputRegister: ins.outputRegister || null,
        };
      }),

      AddressingModes: addressingModeList.map((m) => ({
        AddressingModeName: m.mode,
        AddressingModeCode: m.code,
        AddressingModeSymbol: m.sym || "",
      })),
    };
  };

  console.log("FINAL PAYLOAD:", JSON.stringify(buildPayload(), null, 2));

  const handleCPUAdded = () => {
    if (!archName) return;

    setCPUlist([
      ...CPUlist,
      {
        archName,
        memorySize,
        busSize,
        stackSize,
        noOfRegisters,
        noOfInstructions,
      },
    ]);
  };

  const handleUpdate = async () => {
    try {
      const payload = buildPayload();

      console.log("Payload:", payload);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/architecture/update-full/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Updated successfully ✅");
        navigate("/dashboard");
      } else {
        console.error(data);
        alert(data.message || data.ExceptionMessage || "Update failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  const handleAddedFR = (e) => {
    e.preventDefault();
    if (!flagRegister || !flagAction) return;

    setFlagRegisterList([
      ...flagRegisterList,
      {
        name: flagRegister,
        Action: flagAction,
        RegisterSize: 32,
        RegisterCode: `F${flagRegisterList.length}`,
      },
    ]);

    setFlagRegister("");
    setFlagAction("");
  };

  const handleUpdateGP = () => {
    const updated = [...gpRegisterList];

    updated[currentGPIndex] = {
      ...updated[currentGPIndex],
      name: gpRegister,
    };

    setGpRegisterList(updated);
  };

  const handleNextGP = () => {
    if (gpRegisterList.length === 0) return;

    const nextIndex = (currentGPIndex + 1) % gpRegisterList.length;

    setCurrentGPIndex(nextIndex);
    setGpRegister(gpRegisterList[nextIndex].name);
  };

  const handleNextMode = () => {
    if (addressingModeList.length === 0) return;

    const nextIndex = (currentModeIndex + 1) % addressingModeList.length;

    setcurrentModeIndex(nextIndex);
  };

  const handleUpdateMode = () => {
    const updated = [...addressingModeList];

    updated[currentModeIndex] = {
      mode: addressingMode,
      code: addressingModeCode,
      sym: symbol,
    };

    setAddressingModeList(updated);
  };

  const handleNextInstruction = () => {
    if (addedInstructions.length === 0) return;

    // Save current instruction before moving
    if (mnemonic || opcode) {
      handleUpdateInstruction();
    }

    const nextIndex = (currentInstructionIndex + 1) % addedInstructions.length;
    setCurrentInstructionIndex(nextIndex);
  };

  const handleUpdateInstruction = () => {
    if (!mnemonic && !opcode) return;

    const updated = [...addedInstructions];
    const instructionData = {
      mnemonics: mnemonic,
      opcode: opcode,
      action: action,
      interruptSymbol: isInterrupt ? interruptSymbol : null,
      inputRegister: isInterrupt ? inputRegister : null,
      outputRegister: isInterrupt ? outputRegister : null,
      operands: isInterrupt ? [] : operands,
    };

    if (currentInstructionIndex < updated.length) {
      updated[currentInstructionIndex] = instructionData;
    } else {
      updated.push(instructionData);
      setCurrentInstructionIndex(updated.length - 1);
    }

    setAddedInstructions(updated);
  };

  const handleAddOperand = () => {
    setOperands([
      ...operands,
      { id: Date.now(), type: "Register", selected: false },
    ]);
  };

  const handleRadio = (id) => {
    setOperands(
      operands.map((op) =>
        op.id === id ? { ...op, selected: true } : { ...op, selected: false },
      ),
    );
  };

  const handleType = (id, value) => {
    setOperands(
      operands.map((op) => (op.id === id ? { ...op, type: value } : op)),
    );
  };

  const handleDelete = (id) => {
    setOperands(operands.filter((op) => op.id !== id));
  };

  return (
    <>
      <Header />

      {/* CPU Configuration */}
      <div className="pt-20 lg:pt-24">
        <h2 className="text-center text-xl font-bold text-blue-900 px-4">
          Edit Architecture
        </h2>

        {/* CPU Configuration */}
        <div className="p-4 bg-gray-100">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white rounded-xl p-4 space-y-4 lg:p-8 lg:shadow">
              <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
                CPU Design Configuration
              </h2>

              {/* FORM */}
              <form className="space-y-4 lg:space-y-6">
                {/* Architecture Name */}
                <div>
                  <label className="text-sm text-black">
                    Architecture Name
                  </label>
                  <input
                    type="text"
                    value={archName}
                    onChange={(e) => setArchName(e.target.value)}
                    placeholder="Enter architecture name"
                    className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                    focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-black">Memory Size</label>
                    <input
                      type="text"
                      value={memorySize}
                      onChange={(e) => setMemorySize(e.target.value)}
                      placeholder="Enter memory size (e.g. 64 B)"
                      className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black">Bus Size</label>
                    <input
                      type="text"
                      value={busSize}
                      onChange={(e) => setBusSize(e.target.value)}
                      placeholder="Enter bus size (e.g. 32-bit)"
                      className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black">Stack Size</label>
                    <input
                      type="text"
                      value={stackSize}
                      onChange={(e) => setStackSize(e.target.value)}
                      placeholder="Enter stack size (e.g. 16 B)"
                      className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black">
                      No of Registers
                    </label>
                    <input
                      type="number"
                      value={noOfRegisters}
                      onChange={(e) => setNoOfRegisters(e.target.value)}
                      placeholder="Enter no of Registers"
                      className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black">
                      No of Instructions
                    </label>
                    <input
                      type="number"
                      value={noOfInstructions}
                      onChange={(e) => setNoOfInstructions(e.target.value)}
                      placeholder="Enter no of Instruction"
                      className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                    />
                  </div>
                </div>

                {CPUlist.length > 0 && (
                  <div className="bg-gray-100 border rounded-sm m-2 p-2 text-sm text-black">
                    <p className="text-blue-900 font-semibold">Added Data</p>

                    {CPUlist.map((cpu, i) => (
                      <div key={i} className="m-2">
                        <span className="flex">
                          <p className="mr-1 text-blue-900">
                            Architecture Name:
                          </p>
                          <p>{cpu.archName}</p>
                        </span>
                        <span className="flex">
                          <p className="mr-1 text-blue-900">Memory Size::</p>
                          <p>{cpu.memorySize}</p>
                        </span>
                        <span className="flex">
                          <p className="mr-1 text-blue-900">Bus Size:</p>
                          <p>{cpu.busSize}</p>
                        </span>
                        <span className="flex">
                          <p className="mr-1 text-blue-900">Stack Size:</p>
                          <p>{cpu.stackSize}</p>
                        </span>
                        <span className="flex">
                          <p className="mr-1 text-blue-900">No of Registers:</p>
                          <p>{cpu.noOfRegisters}</p>
                        </span>
                        <span className="flex">
                          <p className="mr-1 text-blue-900">
                            No of Instruction:
                          </p>
                          <p>{cpu.noOfInstructions}</p>
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleCPUAdded}
                  type="button"
                  className="w-full h-8 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
                >
                  ADD
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Register Configuration */}
        <div className="p-4 bg-gray-100">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white rounded-xl p-4 space-y-4 lg:p-8 lg:shadow">
              <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
                Register Design Configuration
              </h2>

              <div>
                {/* Flag Registers Section */}
                <div className="mb-6"></div>

                {/* GP Registers Section */}
                <div>
                  <div>
                    <span className="text-black font-semibold">
                      GP Register
                    </span>
                    <input
                      value={gpRegister}
                      onChange={(e) => setGpRegister(e.target.value)}
                      className="mt-2 mb-4 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                      type="text"
                      placeholder="Enter GP Register Name"
                    />
                    {/* Display GP */}
                    {gpRegisterList.length > 0 && (
                      <div className="bg-gray-100 m-2 border rounded-sm">
                        <p className="text-black text-sm m-2 font-semibold text-blue-900">
                          Added General Purpose
                        </p>
                        {gpRegisterList.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setCurrentGPIndex(index);
                              setGpRegister(item.name);
                            }}
                            className="cursor-pointer hover:bg-gray-200"
                          >
                            <span className="flex m-2 mb-3">
                              <p className="mr-1 text-sm text-blue-900">
                                Name:
                              </p>
                              <p className="text-black text-sm ">{item.name}</p>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-8">
                      <button
                        onClick={handleNextGP}
                        className="w-full sm:w-1/2 h-8 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
                      >
                        NEXT
                      </button>
                      <button
                        onClick={handleUpdateGP}
                        className="w-full sm:w-1/2 h-8 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>

                {/* Addressing Modes Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6 text-black font-semibold">
                    <span>Add Addressing Modes</span>
                  </div>

                  <div>
                    <span className="text-black">Addressing Mode</span>
                    <select
                      value={addressingMode}
                      onChange={(e) => setAddressingMode(e.target.value)}
                      className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                      ${addressingMode === "" ? "text-gray-500" : "text-black"}`}
                    >
                      <option value="">Select Addressing Mode</option>
                      <option value="Direct">Direct Addressing</option>
                      <option value="Indirect">Indirect Addressing</option>
                      <option value="Indexed">Indexed Addressing</option>
                    </select>

                    <span className="text-black">Addressing Mode Code</span>
                    <select
                      value={addressingModeCode}
                      onChange={(e) => setAddressingModeCode(e.target.value)}
                      className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                      ${addressingModeCode === "" ? "text-gray-500" : "text-black"}`}
                    >
                      <option value="">Select Addressing Mode Code</option>
                      <option value="00">00</option>
                      <option value="01">01</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                    </select>

                    <span className="text-black">Symbol</span>
                    <input
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      className="auto-textarea mt-2 pl-2 h-8 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                      type="text"
                      placeholder="Enter Symbol (e.g., #, @, etc.)"
                    />
                    {/* Display Addressing Modes */}
                    {addressingModeList.length > 0 && (
                      <div className="bg-gray-100 border mt-4 rounded-sm text-sm">
                        <p className="font-semibold text-blue-900 m-2">
                          Added Addressing Modes
                        </p>

                        {addressingModeList.map((item, index) => (
                          <div
                            key={index}
                            className="text-black m-2"
                            onClick={() => {
                              setCurrentModeIndex(index);
                              setAddressingMode(item.mode);
                              setAddressingModeCode(item.code);
                              setSymbol(item.sym);
                            }}
                          >
                            <span className="flex ">
                              <p className="text-blue-900 mr-1">Mode:</p>
                              <p>{item.mode}</p>
                            </span>
                            <span className="flex ">
                              <p className="text-blue-900 mr-1">Code:</p>
                              <p>{item.code}</p>
                            </span>
                            <span className="flex mb-3">
                              <p className="text-blue-900 mr-1">Symbol:</p>
                              <p>{item.sym}</p>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleUpdateMode}
                      className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold hover:bg-blue-800 transition"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instruction Configuration */}
        <div className="p-4 bg-gray-100">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white rounded-xl p-4 space-y-4 lg:p-8 lg:shadow">
              <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
                Instruction Design Configuration
              </h2>

              <div>
                {/* Interrupt Instruction Checkbox */}
                {/* <div className="mb-4">
                  <span className="text-black">Interrupt Instruction</span>
                  <input
                    type="checkbox"
                    checked={isInterrupt}
                    onChange={(e) => {
                      setIsInterrupt(e.target.checked);
                      if (e.target.checked) {
                        setOperands([]);
                      } else {
                        setOperands([{ id: 1, type: "Register", selected: false }]);
                      }
                    }}
                    className="bg-white ml-2 h-4 w-4"
                  />
                </div> */}

                {/* Opcode & Mnemonics */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2">
                    <span className="text-black">OpCode</span>
                    <br />
                    <input
                      className="mt-2 h-8 mb-5 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900 "
                      value={opcode}
                      type="text"
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

                {/* Interrupt Extra Fields */}
                {isInterrupt && (
                  <>
                    <div className="mb-4">
                      <span className="text-black">Interrupt Symbol</span>
                      <select
                        className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                                    ${interruptSymbol === "" ? "text-gray-500" : "text-black"}`}
                        value={interruptSymbol}
                        onChange={(e) => setInterruptSymbol(e.target.value)}
                      >
                        <option value="">Select interrupt symbol</option>
                        <option value="IN">IN (Input)</option>
                        <option value="OUT">OUT (Output)</option>
                        <option value="INT">INT (Interrupt)</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <span className="text-black">Input Register</span>
                      <select
                        className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                                    ${inputRegister === "" ? "text-gray-500" : "text-black"}`}
                        value={inputRegister}
                        onChange={(e) => setInputRegister(e.target.value)}
                      >
                        <option value="">Select input register</option>
                        {[...flagRegisterList, ...gpRegisterList].map(
                          (reg, idx) => (
                            <option key={idx} value={reg.name}>
                              {reg.name}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div className="mb-4">
                      <span className="text-black">Output Register</span>
                      <select
                        className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                                    ${outputRegister === "" ? "text-gray-500" : "text-black"}`}
                        value={outputRegister}
                        onChange={(e) => setOutputRegister(e.target.value)}
                      >
                        <option value="">Select output register</option>
                        {[...flagRegisterList, ...gpRegisterList].map(
                          (reg, idx) => (
                            <option key={idx} value={reg.name}>
                              {reg.name}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </>
                )}

                {/* Operands and Destination */}
                {!isInterrupt && (
                  <>
                    <div className="flex justify-between mb-4">
                      <span className="text-black">Operands</span>
                      <span className="text-black">Destination</span>
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
                          </select>

                          <input
                            type="radio"
                            name="destination"
                            checked={op.selected}
                            onChange={() => handleRadio(op.id)}
                            className="w-4 h-4 rounded-full border border-black bg-white"
                          />

                          <button
                            type="button"
                            onClick={() => handleDelete(op.id)}
                            className="text-red-700 hover:text-red-900"
                          >
                            <TrashIcon className="w-6 h-6" />
                          </button>

                          {index === operands.length - 1 && (
                            <button
                              type="button"
                              onClick={handleAddOperand}
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

                {/* Action */}
                <div className="mt-4">
                  <span className="text-black block mb-2">
                    Action (Java Code)
                  </span>
                  <textarea
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="// Write Java Code Here"
                    className="w-full border rounded-md p-2 h-24 bg-gray-100 text-black text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-8">
                  <button
                    onClick={handleNextInstruction}
                    className="bg-blue-900 text-white py-2 rounded-md w-full sm:w-1/2"
                  >
                    Next
                  </button>

                  <button
                    onClick={handleUpdateInstruction}
                    className="bg-blue-900 text-white py-2 rounded-md w-full sm:w-1/2"
                  >
                    ADD
                  </button>
                </div>

                {/* Added Instructions List */}
                {addedInstructions.length > 0 && (
                  <div className="mt-6 mb-3 border rounded-md p-4 text-black text-sm bg-gray-50">
                    <h3 className="text-blue-900 font-semibold mb-2">
                      Added Instructions
                    </h3>

                    {addedInstructions.map((item, index) => (
                      <div
                        key={index}
                        className="mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                        onClick={() => {
                          setCurrentInstructionIndex(index);
                          setOpcode(item.opcode);
                          setMnemonic(item.mnemonics);
                          setAction(item.action);
                          setInterruptSymbol(item.interruptSymbol || "");
                          setInputRegister(item.inputRegister || "");
                          setOutputRegister(item.outputRegister || "");
                          const operandsList = item.operands || [];
                          setOperands(
                            operandsList.length > 0
                              ? operandsList
                              : [{ id: 1, type: "Register", selected: false }],
                          );
                          setIsInterrupt(!!item.interruptSymbol);
                        }}
                      >
                        <span className="flex ">
                          <p className="text-blue-900 mr-1">OpCode:</p>
                          <p>{item.opcode}</p>
                        </span>

                        <span className="flex ">
                          <p className="text-blue-900 mr-1">Mnemonic:</p>
                          <p>{item.mnemonics}</p>
                        </span>

                        <span className="flex ">
                          <p className="text-blue-900 mr-1">Action:</p>
                          <p>{item.action}</p>
                        </span>

                        <span className="flex ">
                          <p className="text-blue-900 mr-1">
                            Interrupt Symbol:
                          </p>
                          <p>{item.interruptSymbol}</p>
                        </span>

                        <span className="flex ">
                          <p className="text-blue-900 mr-1">Input Register:</p>
                          <p>{item.inputRegister}</p>
                        </span>

                        <span className="flex ">
                          <p className="text-blue-900 mr-1">Output Register:</p>
                          <p>{item.outputRegister}</p>
                        </span>

                        <div className="flex text-black mb-4">
                          <p className="text-blue-900 mr-1">Operands:</p>{" "}
                          {item.operands &&
                            item.operands.map((op, i) => (
                              <span key={i}>
                                {op.type}
                                {op.selected ? " (Dest)" : ""}{" "}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24 p-4">
          <div className="max-w-8xl mx-auto">
            <button
              onClick={handleUpdate}
              type="button"
              className="w-full h-10 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
            >
              Update Architecture
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
