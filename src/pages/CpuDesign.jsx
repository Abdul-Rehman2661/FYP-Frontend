import { useState } from "react";
import Header from "../components/Header.jsx"
import BottomNavigation from "../components/BottomNavigation.jsx"
import AddRegister from "../components/AddRegister.jsx";

function CpuDesign() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <div className="p-4 pt-16 min-h-screen bg-gray-100 pb-16 flex justify-center">
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
            CPU Design
          </h2>

          {/* FORM */}
          <form className="space-y-4 lg:space-y-6">

            {/* Architecture Name (Full width always) */}
            <div>
              <label className="text-sm text-black">
                Architecture Name
              </label>
              <input
                type="text"
                placeholder="Enter architecture name"
                className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                     focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
              />
            </div>

            {/* Grid starts ONLY on desktop */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">

              <div>
                <label className="text-sm text-black">
                  Memory Size
                </label>
                <input
                  type="text"
                  placeholder="Enter memory size (e.g. 64 B)"
                  className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="text-sm text-black">
                  Bus Size
                </label>
                <input
                  type="text"
                  placeholder="Enter bus size (e.g. 32-bit)"
                  className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="text-sm text-black">
                  Stack Size
                </label>
                <input
                  type="text"
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
                  placeholder="Enter no of Registers"
                  className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                />
              </div>
              <div >
                <label className="text-sm text-black">
                  No of Instruction
                </label>
                <input
                  type="number"
                  placeholder="Enter no of Instruction"
                  className="mt-1 w-full border bg-gray-100 text-black rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 border-gray-400 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full mt-6 bg-blue-900 text-white py-2 rounded-md
                   text-sm font-semibold hover:bg-blue-800 transition"
            >
              Next
            </button>

            {showModal && (
              <AddRegister onClose={() => setShowModal(false)} />
            )}
          </form>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default CpuDesign;