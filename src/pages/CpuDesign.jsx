import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import AddRegister from "../components/AddRegister.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function CpuDesign() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [archName, setArchName] = useState("");
  const [memorySize, setMemorySize] = useState("");
  const [busSize, setBusSize] = useState("");
  const [stackSize, setStackSize] = useState("");
  const [noOfRegisters, setNoOfRegisters] = useState("");
  const [noOfInstructions, setNoOfInstructions] = useState("");

  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    if (location.state) {
      const data = location.state;

      setArchName(data.archName || "");
      setMemorySize(data.memorySize || "");
      setBusSize(data.busSize || "");
      setStackSize(data.stackSize || "");
      setNoOfRegisters(data.noOfRegisters || "");
      setNoOfInstructions(data.noOfInstructions || "");

      setSavedData(data);
    }
  }, [location.state]);

  return (
    <>
      <Header />
      <div className="p-4 pt-24 min-h-screen bg-gray-100 pb-16 flex justify-center">
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

            {/* PREVIEW DATA */}
            {savedData && (
              <div className="border rounded-md p-3 bg-gray-50 text-sm">
                <h3 className="font-semibold mb-2">Entered Data</h3>
                <p><b>Architecture Name:</b> {savedData.archName}</p>
                <p><b>Memory Size:</b> {savedData.memorySize}</p>
                <p><b>Bus Size:</b> {savedData.busSize}</p>
                <p><b>Stack Size:</b> {savedData.stackSize}</p>
                <p><b>No of Registers:</b> {savedData.noOfRegisters}</p>
                <p><b>No of Instructions:</b> {savedData.noOfInstructions}</p>
              </div>
            )}

            {/* Button */}
            <button
              type="button"
              onClick={() => {
                const data = {
                  archName,
                  memorySize,
                  busSize,
                  stackSize,
                  noOfRegisters,
                  noOfInstructions,
                };

                setSavedData(data);
                navigate("/register", { state: data });
              }}
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
