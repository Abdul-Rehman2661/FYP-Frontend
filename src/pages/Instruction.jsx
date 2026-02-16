import React, { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

function Instruction() {

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
      <div className="pt-20">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Instruction Design
        </h2>
      </div>

      <div className="m-6 p-6 shadow-md bg-white border border-gray-200 rounded-xl">
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

        {addedInstructions.length > 0 && (
          <div className="mb-6 border rounded-md p-3 bg-gray-50">
            <h3 className="text-black font-semibold mb-2">
              Added Instructions
            </h3>

            {addedInstructions.map((item, i) => (
              <div key={i} className="mb-3 p-2 border rounded text-sm">
                <p className="text-black">
                  <b>Opcode:</b> {item.opcode}
                </p>
                <p className="text-black">
                  <b>Mnemonic:</b> {item.mnemonic}
                </p>
                <p className="text-black">
                  <b>Action:</b> {item.action}
                </p>

                {item.isInterrupt ? (
                  <>
                    <p className="text-black">
                      <b>Interrupt Symbol:</b> {item.interruptSymbol}
                    </p>
                    <p className="text-black">
                      <b>Input Register:</b> {item.inputRegister}
                    </p>
                    <p className="text-black">
                      <b>Output Register:</b> {item.outputRegister}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-black">
                      <b>Operands:</b>
                    </p>
                    {item.operands.map((op, idx) => (
                      <p className="text-black" key={idx}>
                        Operand {idx + 1}: {op.type}{" "}
                        {op.selected && "(Destination)"}
                      </p>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

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
            ADD
          </button>

          <button className="bg-blue-900 text-white py-2 rounded-md w-full"
          onClick={() => navigate("/editor")}
          >
            CreateArchitecture
          </button>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default Instruction;
