import React, { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function Register() {
  const [flagRegister, setFlagRegister] = useState("");
  const [flagAction, setFlagAction] = useState("");
  const [flagRegisterList, setFlagRegisterList] = useState([]);

  const navigate = useNavigate();

  const [gpRegister, setGpRegister] = useState("");
  const [gpRegisterList, setGpRegisterList] = useState([]);

  const [addressingMode, setAddressingMode] = useState("");
  const [addressingModeCode, setAddressingModeCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [addressingModeList, setAddressingModeList] = useState([]);

  return (
    <>
      <Header />
      <div className="pt-20 pb-16">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Register Design
        </h2>

        {/* Add Register Card */}
        <div className="m-6 p-6 shadow-md rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-black font-semibold">
            <span>Add Flag Registers</span>
          </div>

          <div>
            <span className="text-black">Flag Register</span>
            <input
              onChange={(e) => setFlagRegister(e.target.value)}
              className={`mt-2 h-8 mb-2 pl-2 bg-gray-100 w-full rounded-md border 'border-gray-300'} text-black`}
              type="text"
              placeholder="Enter Flag Register Name"
            />

            <span className="text-black">Flag Register Action</span>
            <textarea
              value={flagAction}
              onChange={(e) => setFlagAction(e.target.value)}
              className={`auto-textarea h-20 mt-2 pl-2 bg-gray-100 w-full rounded-md border text-black`}
              placeholder="//Write Java Code here for Logic of Flag Register"
            />

            <button className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold hover:bg-blue-800 transition">
              ADD
            </button>
          </div>
        </div>

        {/* GP Register Card */}
        <div className="m-6 p-6 shadow-md rounded-xl bg-white border border-gray-200">
          <div>
            <span className="text-black">GP Register</span>
            <input
              value={gpRegister}
              onChange={(e) => setGpRegister(e.target.value)}
              className={`mt-2 mb-2 pl-2 bg-gray-100 w-full h-8 rounded-md border text-black`}
              type="text"
              placeholder="Enter GP Register Name"
            />

            <button className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg text-center font-semibold hover:bg-blue-800 transition">
              ADD
            </button>
          </div>
        </div>

        {/* Addressing Mode card */}
        <div className="m-6 p-6 shadow-md rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-black font-semibold">
            <span>Add Addressing Modes</span>
          </div>

          <div>
            <span className="text-black">Addressing Mode</span>
            <select
              onChange={(e) => setAddressingMode(e.target.value)}
              className={`mt-2 mb-2 h-8 pl-2 bg-gray-100 w-full rounded-md bordertext-black`}
            >
              <option value="">Select Addressing Mode</option>
              <option value="Direct">Direct Addressing</option>
              <option value="Indirect">Indirect Addressing</option>
              <option value="Indexed">Indexed Addressing</option>
            </select>

            <span className="text-black">Addressing Mode Code</span>
            <select
              onChange={(e) => setAddressingModeCode(e.target.value)}
              className={`mt-2 mb-2 h-8 pl-2 bg-gray-100 w-full rounded-md border  text-black`}
            >
              <option value="">Select Addressing Mode Code</option>
              <option value="00">00</option>
              <option value="01">01</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>

            <span className="text-black">Symbol</span>
            <input
              onChange={(e) => setSymbol(e.target.value)}
              className={`mt-2 mb-2 pl-2 h-8 bg-gray-100 w-full rounded-md border  text-black`}
              type="text"
              placeholder="Enter Symbol (e.g., #, @, etc.)"
            />

            <button className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold hover:bg-blue-800 transition">
              ADD
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            className="w-full h-10 text-white bg-blue-900 rounded-lg text-center font-semibold hover:bg-blue-800 transition"
            onClick={() => navigate("/instruction")}
          >
            Next
          </button>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Register;
