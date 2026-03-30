import React, { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

function Instruction() {
  const navigate = useNavigate();

  // Form states
  const [opcode, setOpcode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [action, setAction] = useState("");
  const [interruptSymbol, setInterruptSymbol] = useState("");
  const [inputRegister, setInputRegister] = useState("");
  const [outputRegister, setOutputRegister] = useState("");
  const [addedInstructions, setAddedInstructions] = useState([]);
  const [operands, setOperands] = useState([
    { id: 1, type: "Register", selected: false },
  ]);
  const [isInterrupt, setIsInterrupt] = useState(false);

  const DisplayInstruction = () => {
    if (!opcode || !mnemonic || !action) return;

    if (isInterrupt) {
      if (!interruptSymbol || !inputRegister || !outputRegister) return;
    }

    const newRecord = {
      opcode,
      mnemonic,
      action,
      interruptSymbol,
      inputRegister,
      outputRegister,
      operands,
    };

    setAddedInstructions([...addedInstructions, newRecord]);

    (setOpcode(" "),
      setMnemonic(" "),
      setAction(" "),
      setInterruptSymbol(" "),
      setInputRegister(" "),
      setOutputRegister(" "),
      setOperands[{ id: 1, type: "Register", selected: false }]);

    console.log("New Record:", newRecord);
  };

  const handleAddOperand = () => {
    setOperands([
      ...operands,
      {
        id: Date.now(),
        type: "Register",
        selected: false,
      },
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
      operands.map((op) =>
        op.id === id ? { ...op, type: value } : { type: "register" },
      ),
    );
  };

  const handleDelete = (id) => {
    setOperands(operands.filter((op) => op.id !== id));
  };

  return (
    <>
      <Header />
      <div className="pt-20 lg:pt-24 p-4 bg-gray-100">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Instruction Design
        </h2>
        <div className="mt-4 mb-20 bg-white shadow p-4 rounded-xl">
          <div className="mb-6">
            <span className="text-black">Interrupt Instruction</span>
            <input
              type="checkbox"
              onChange={(e) => {
                setIsInterrupt(e.target.checked);
              }}
              className="bg-white ml-2 h-4 w-4"
            />
          </div>

          {/* Opcode & Mnemonics */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <span className="text-black">OpCode</span>
              <br />
              <input
                className="mt-2 h-8 mb-5 pl-2 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900 "
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
                </select>
              </div>

              <div className="mb-4">
                <span className="text-black">Input Register</span>
                <select
                  className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                      ${inputRegister === "" ? "text-gray-500" : "text-black"}`}
                  onChange={(e) => setInputRegister(e.target.value)}
                >
                  <option value="">Select input register</option>
                </select>
              </div>

              <div className="mb-4">
                <span className="text-black">Output Register</span>
                <select
                  className={`mt-2 mb-4 h-8 pl-2 bg-gray-100 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900
                      ${outputRegister === "" ? "text-gray-500" : "text-black"}`}
                  onChange={(e) => setOutputRegister(e.target.value)}
                >
                  <option value="">Select output register</option>
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
                      onClick={() => handleDelete(op.id)}
                      className="text-red-700 hover:text-red-900"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>

                    {index === operands.length - 1 && (
                      <button
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
            <span className="text-black block mb-2">Action (Java Code)</span>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="// Write Java Code Here"
              className="w-full border rounded-md p-2 h-24 border bg-gray-100 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
            ></textarea>
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
                  className="mb-2"
                >
                    <span className="flex ">
                      <p className="text-blue-900 mr-1">OpCode:</p>
                      <p>{item.opcode}</p>
                    </span>

                    <span className="flex ">
                      <p className="text-blue-900 mr-1">Mnemonic:</p>
                      <p>{item.mnemonic}</p>
                    </span>

                    <span className="flex ">
                      <p className="text-blue-900 mr-1">Action:</p>
                      <p>{item.action}</p>
                    </span>

                    <span className="flex ">
                      <p className="text-blue-900 mr-1">Interrupt Symbol:</p>
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

                  <p className="flex text-black mb-4">
                    <p className="text-blue-900 mr-1">Operands:</p>{" "}
                    {item.operands.map((op, i) => (
                      <span key={i}>
                        {op.type}
                        {op.selected ? " (Dest)" : ""}{" "}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ADD Button */}
          <button
            onClick={DisplayInstruction}
            className="w-full bg-blue-900 text-white py-2 rounded-md mt-4 hover:bg-blue-800"
          >
            ADD
          </button>

          {/* Create Architecture Button */}
          <button onClick={() => {navigate("/editor")}} className="w-full bg-blue-900 text-white py-3 rounded-md mt-6 font-semibold hover:bg-blue-800">
            Create Architecture
          </button>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Instruction;