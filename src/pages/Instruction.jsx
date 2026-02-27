import React, { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  addArchitecture,
  addRegisters,
  addInstructions,
  addAddressingModes,
  getAllArchitectures,
} from "../services/api";

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

  return (
    <>
      <Header />
      <div className="pt-20 lg:pt-24 p-4 bg-gray-100">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Instruction Design
        </h2>
        <div className="mt-4 bg-white shadow p-4 rounded-xl">
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
                className={`mt-2 h-8 mb-2 pl-2 bg-gray-100 w-full rounded-md border text-black`}
                type="text"
                onChange={(e) => setOpcode(e.target.value)}
                placeholder="Enter Instruction Code e.g (01)"
              />
            </div>

            <div className="w-full md:w-1/2">
              <span className="text-black">Mnemonics</span>
              <br />
              <input
                className={`mt-2 h-8 mb-2 pl-2 bg-gray-100 w-full rounded-md border text-black`}
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
                  className={`mt-2 h-8 mb-2 bg-gray-100 w-full rounded-md border text-black`}
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
                  className={`mt-2 h-8 mb-2 bg-gray-100 w-full rounded-md border text-black`}
                  onChange={(e) => setInputRegister(e.target.value)}
                >
                  <option value="">Select input register</option>
                </select>
              </div>

              <div className="mb-4">
                <span className="text-black">Output Register</span>
                <select
                  className={`mt-2 h-8 mb-2 bg-gray-100 w-full rounded-md border  text-black`}
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

                  <div className="flex items-center gap-3">
                    <select
                      value={op.type}
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
                      className="w-4 h-4 rounded-full border border-black bg-white"
                    />

                    <button className="text-red-700 hover:text-red-900">
                      <TrashIcon className="w-6 h-6" />
                    </button>

                    {index === operands.length - 1 && (
                      <button className="text-blue-600 text-xl font-bold">
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
              className={`w-full border rounded-md p-2 h-24 bg-white text-black `}
            ></textarea>
          </div>

          {/* ADD Button */}
          <button className="w-full bg-blue-900 text-white py-2 rounded-md mt-4 hover:bg-blue-800">
            ADD
          </button>

          {/* Added Instructions List */}
          {addedInstructions.length > 0 && (
            <div className="mt-6 border rounded-md p-4 bg-gray-50">
              <h3 className="text-black font-semibold mb-3">
                Added Instructions ({addedInstructions.length})
              </h3>

              {addedInstructions.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 border rounded bg-white relative"
                >
                  <button className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    ✕
                  </button>
                  <p className="text-black">
                    <b>Opcode:</b> {item.opcode}
                  </p>
                  <p className="text-black">
                    <b>Mnemonic:</b> {item.mnemonic}
                  </p>
                  <p className="text-black">
                    <b>Action:</b> {item.action.substring(0, 50)}...
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
                    <p className="text-black">
                      <b>Operands:</b> {item.operands.length}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create Architecture Button */}
          <button className="w-full bg-blue-900 text-white py-3 rounded-md mt-6 font-semibold hover:bg-blue-800">
            "Create Architecture"
          </button>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Instruction;
