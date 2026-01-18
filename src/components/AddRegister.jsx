import { useNavigate } from "react-router-dom";

export default function AddRegisterModal({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 relative">

        <h3 className="text-lg text-black mb-4">
          Add Register
        </h3>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <label className="text-sm text-black">
          Register Name
        </label>

        <input
          type="text"
          placeholder="Enter register Name"
          className="mt-1 bg-white text-black w-full border border-blue-700 rounded-lg px-3 py-2 
             shadow-md shadow-gray-400/50 focus:outline-none"
        />


        <div className="flex gap-4 mt-6">
          <button className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-md">
            ADD
          </button>
          <button
            onClick={() => navigate("/InstructionDesign")}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-md ">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
