import { useState } from "react";
import Header from "../components/Header.jsx"
import BottomNavigation from "../components/BottomNavigation.jsx"
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

function InstructionDesign() {
  const [opcode, setOpcode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [addressType, setAddressType] = useState("direct");

  const [operands, setOperands] = useState([
    { id: 1, name: "Operand 1", isDestination: false },
  ]);


  const addOperand = () => {
    setOperands([
      ...operands,
      {
        id: Date.now(),
        name: `Operand ${operands.length + 1}`,
        isDestination: false,
      },
    ]);
  };

  const deleteOperand = (id) => {
    setOperands(operands.filter((op) => op.id !== id));
  };

  const setDestination = (id) => {
    setOperands(
      operands.map((op) => ({
        ...op,
        isDestination: op.id === id,
      }))
    );
  };

  return (
    <>
      <Header />
      <div className="p-4 pt-16 min-h-screen bg-gray-100 pb-16">
        <div className="space-y-4 p-4 bg-white rounded-xl">

          <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
            Instruction Design
          </h2>

          <form className="space-y-4">
            <div>
              <label className="mb-1 text-black">OpCode</label>
              <input
                className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                placeholder="Enter instruction code (e.g. 01)"
                value={opcode}
                onChange={(e) => setOpcode(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-black">Mnemonic</label>
              <input
                className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                placeholder="Enter mnemonic (e.g. ADD)"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-black">Operands</span>
                <span className="text-black">Destination</span>
              </div>

              {operands.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center text-sm justify-between border text-black rounded-lg px-3 py-2 mb-2"
                >
                  <span>{op.name}</span>

                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="destination"
                      checked={op.isDestination}
                      onChange={() => setDestination(op.id)}
                    />

                    <button onClick={() => deleteOperand(op.id)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}

              <button
              type="button"
                onClick={addOperand}
                className="flex text-sm items-center gap-2 text-blue-600 mt-2"
              >
                <PlusIcon className="h-5 w-5" />
                Add Operand
              </button>
            </div>

            <div className="mb-6">
              <p className="text-black mb-2">Address Type</p>

              <label className="flex items-center text-sm text-black gap-2 mb-2">
                <input
                  type="radio"
                  name="addressType"
                  value="direct"
                  checked={addressType === "direct"}
                  onChange={(e) => setAddressType(e.target.value)}
                />
                Direct Address
              </label>

              <label className="flex items-center text-sm text-black gap-2">
                <input
                  type="radio"
                  name="addressType"
                  value="indirect"
                  checked={addressType === "indirect"}
                  onChange={(e) => setAddressType(e.target.value)}
                />
                Indirect Address
              </label>
            </div>

            <div>
              <label className="block text-black mb-1">Action</label>
              <textarea
                rows={2}
                className="w-full border bg-gray-100 text-black rounded-lg px-3 py-2 mb-6"
                placeholder="// Write Java Code Here"
              />
            </div>

            <button
              type="button"
              className="w-full mt-4 bg-blue-900 text-white py-2 rounded-md 
                       text-sm font-semibold hover:bg-blue-800 transition"
            >
              Add
            </button>
            <button
              type="button"
              className="w-full mt-4 bg-blue-900 text-white py-2 rounded-md 
                       text-sm font-semibold hover:bg-blue-800 transition"
            >
              Create Architecture
            </button>

          </form>
        </div>
      </div>
      <BottomNavigation />
    </>

  )
}

export default InstructionDesign;