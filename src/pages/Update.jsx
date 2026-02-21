import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Update() {
  const [archName, setArchName] = useState("");
  const [memorySize, setMemorySize] = useState("");
  const [busSize, setBusSize] = useState("");
  const [stackSize, setStackSize] = useState("");
  const [noOfRegisters, setNoOfRegisters] = useState("");
  const [noOfInstructions, setNoOfInstructions] = useState("");

  const [addressingMode, setAddressingMode] = useState("");
  const [addressingModeCode, setAddressingModeCode] = useState("");

  const navigate = useNavigate();
  const [opcode, setOpcode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [action, setAction] = useState("");

  const [interruptSymbol, setInterruptSymbol] = useState("");
  const [inputRegister, setInputRegister] = useState("");
  const [outputRegister, setOutputRegister] = useState("");

  const [addedInstructions, setAddedInstructions] = useState([]);

  const [operands, setOperands] = useState([
    { id: 1, type: "Register", selected: false },
    { id: 2, type: "Register", selected: false },
    { id: 3, type: "Register", selected: false },
  ]);

  const [isInterrupt, setIsInterrupt] = useState(false);

  const handleDelete = (id) => {
    setOperands(operands.filter((op) => op.id !== id));
  };

  const handleTypeChange = (id, value) => {
    setOperands(
      operands.map((op) => (op.id === id ? { ...op, type: value } : op)),
    );
  };

  const handleRadioChange = (id) => {
    setOperands(
      operands.map((op) =>
        op.id === id ? { ...op, selected: true } : { ...op, selected: false },
      ),
    );
  };

  const handleAdd = () => {
    setOperands([
      ...operands,
      {
        id: Date.now(),
        type: "Register",
        selected: false,
      },
    ]);
  };

  return (
    <>
      <Header />

      {/* CPU Configuration */}
      <h2 className="mt-16 lg:mt-24 text-center text-xl font-bold text-blue-900 ">
        Edit Architecture
      </h2>

        {/* CPU Configuration */}
      <div className="p-4 bg-gray-100 flex justify-center">
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
          <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
            CPU Design Configuration
          </h2>

          {/* FORM */}
          <form className="space-y-4 lg:space-y-6">
            {/* Architecture Name */}
            <div>
              <label className="text-sm text-black">Architecture Name</label>
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
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
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
                <label className="text-sm text-black">No of Registers</label>
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
                <label className="text-sm text-black">No of Instructions</label>
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

            {/* Button */}
            <button
              type="button"
              className="w-full mt-6 bg-blue-900 text-white py-2 rounded-md
                text-sm font-semibold hover:bg-blue-800 transition"
            >
              ADD
            </button>
          </form>
        </div>
      </div>

      {/* Register Configuration */}
      <div className="p-4 bg-gray-100 flex justify-center">
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
          <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
            Register Design Configuration
          </h2>

          <div>
            <span className="text-black">Flag Register</span>
            <input
              className=" mt-2 h-8 mb-4 pl-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
              type="text"
              placeholder="Enter Flag Register Name"
            />

            <span className="text-black">Flag Register Action</span>
            <textarea
              className="auto-textarea h-20  mt-2 pl-2 bg-gray-100 w-full rounded-md border border-xl border-gray-300 text-black"
              type="text"
              placeholder="//Write Java Code here for Logic of Flag Register"
            />

            <div className="flex flex-col md:flex-row gap-3 mt-4 mb-8">
              <button className="w-1/2 h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold">
                NEXT
              </button>
              <button className="w-1/2 m-6 h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold">
                ADD
              </button>
            </div>

            <div className="text-black">GP Register</div>
            <input
              className=" mt-2 mb-4 pl-2 bg-gray-100 w-full h-8 rounded-md border border-gray-300 text-black"
              type="text"
              placeholder="Enter Flag Register Name"
            />

            <div className="flex flex-col md:flex-row gap-3 mt-4 mb-8">
              <button className="w-1/2 h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold">
                NEXT
              </button>
              <button className="w-1/2 m-6 h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold">
                ADD
              </button>
            </div>

            <div className="m-6 p-6 shadow-md rouded-xl bg-white order border-gray-200 rounded-xl">
              <div className="flex items-center gap-2 mb-6 text-black font-semibold">
                <span>Add Addressing Modes</span>
              </div>

              <div>
                <span className="text-black">Addressing Mode</span>
                <select
                  className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full rounded-md border border-gray-300 
             ${addressingMode === "" ? "text-gray-500" : "text-black"}`}
                >
                  <option value="" disabled>
                    Select Addressing Mode
                  </option>
                  <option>Direct Addressing</option>
                  <option>Indirect Addressing</option>
                  <option>Indexed Addressing</option>
                </select>

                <span className="text-black">Addressing Mode Code</span>
                <select
                  className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full rounded-md border border-gray-300 
             ${addressingModeCode === "" ? "text-gray-500" : "text-black"}`}
                >
                  <option value="" disabled>
                    Select Addressing Mode Code
                  </option>
                  <option>00</option>
                  <option>01</option>
                  <option>10</option>
                  <option>11</option>
                </select>

                <span className="text-black">Symbol</span>
                <input
                  className="auto-textarea mt-2 pl-2 h-8 bg-gray-100 w-full rounded-md border border-xl border-gray-300 text-black"
                  type="text"
                  placeholder="Enter Symbol"
                />

                <button className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold">
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Configuration */}
      <div className="p-4 bg-gray-100 flex justify-center">
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
          <h2 className="text-center text-xl font-bold text-blue-900 mb-6">
            Instruction Design Configuration
          </h2>

          <div className="mb-6">
            <span className="text-black">Interrupt Instruction</span>
            <input
              type="checkbox"
              checked={isInterrupt}
              onChange={(e) => setIsInterrupt(e.target.checked)}
              className="bg-white ml-2 h-4 w-4"
            />
          </div>

          {/* Opcode & Nmenonics */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <span className="text-black">OpCode</span>
              <br />
              <input
                className="mt-2 h-8 mb-5 pl-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
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
                className="mt-2 h-8 pl-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
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
              {/* Interrupt Symbol */}
              <div className="mb-4">
                <span className="text-black">Interrupt Symbol</span>
                <select
                  className="mt-2 h-8 mb-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
                  value={interruptSymbol}
                  onChange={(e) => setInterruptSymbol(e.target.value)}
                >
                  <option value="">Select interrupt symbol</option>
                  <option value="1">1(Input)</option>
                  <option value="2">2(Output)</option>
                </select>
              </div>

              {/* Input Register */}
              <div className="mb-4">
                <span className="text-black">Input Register</span>
                <select
                  className="mt-2 h-8 mb-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
                  value={inputRegister}
                  onChange={(e) => setInputRegister(e.target.value)}
                >
                  <option value="">Select input register</option>
                  <option value="R1">R1</option>
                  <option value="R2">R2</option>
                  <option value="R3">R3</option>
                  <option value="R3">R4</option>
                  <option value="R3">R5</option>
                </select>
              </div>

              {/* Output Register */}
              <div className="mb-4">
                <span className="text-black">Output Register</span>
                <select
                  className="mt-2 h-8 mb-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
                  value={outputRegister}
                  onChange={(e) => setOutputRegister(e.target.value)}
                >
                  <option value="">Select output register</option>
                  <option value="R1">R1</option>
                  <option value="R2">R2</option>
                  <option value="R3">R3</option>
                  <option value="R3">R4</option>
                  <option value="R3">R5</option>
                </select>
              </div>
            </>
          )}

          {/* Oprands and Destination */}
          {!isInterrupt && (
            <>
              {/* Oprands and Destination */}
              <div className="flex justify-between mb-4">
                <span className="text-black ">Operands</span>
                <span className="text-black ">Destination</span>
              </div>

              {/* Operands List */}
              {operands.map((op, index) => (
                <div
                  key={op.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3"
                >
                  {/* Left Label */}
                  <span className="text-black mb-2 md:mb-0">
                    Operand {index + 1}
                  </span>

                  {/* Right Controls */}
                  <div className="flex items-center gap-3">
                    <select
                      value={op.type}
                      onChange={(e) => handleTypeChange(op.id, e.target.value)}
                      className="border rounded-md px-2 bg-white text-black py-1 text-sm"
                    >
                      <option value="Register">Register</option>
                      <option value="Immediate">Immediate</option>
                      <option value="Memory">Memory</option>
                    </select>

                    <input
                      type="radio"
                      name="destination"
                      checked={op.selected}
                      onChange={() => handleRadioChange(op.id)}
                      className="w-4 h-4 rounded-full border border-black bg-white"
                    />

                    <button
                      onClick={() => handleDelete(op.id)}
                      className="text-red-700 hover:text-red-900"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>

                    {index === operands.length - 1 && (
                      <button
                        onClick={handleAdd}
                        className="text-blue-600 text-xl"
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
            <span className="text-black block mb-2">Action</span>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="// Write Java Code Here"
              className="w-full border rounded-md p-2 h-24 bg-white text-black"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mt-4 mb-8">
            <button
              onClick={() => {
                const data = {
                  opcode,
                  mnemonic,
                  action,
                  isInterrupt,
                  operands,
                  interruptSymbol,
                  inputRegister,
                  outputRegister,
                };

                setAddedInstructions([...addedInstructions, data]);

                // optional clear
                setOpcode("");
                setMnemonic("");
                setAction("");
                setInterruptSymbol("");
                setInputRegister("");
                setOutputRegister("");
              }}
              className="bg-blue-900 text-white py-2 rounded-md w-full"
            >
              Next
            </button>

            <button className="bg-blue-900 text-white py-2 rounded-md w-full">
              ADD
            </button>
          </div>
        </div>
      </div>

      <div className="mb-24 m-4">
                        <button
        type="button"
        className="w-full bg-blue-900 text-white py-2 rounded-md
                text-sm font-semibold hover:bg-blue-800 transition"
      >
        Update Architecture
      </button>
      </div>

      <BottomNavigation />
    </>
  );
}
