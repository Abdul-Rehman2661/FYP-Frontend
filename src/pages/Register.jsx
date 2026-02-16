import React, { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { useNavigate } from "react-router-dom";

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

  const handleAddFlagRegister = () => {
    if (!flagRegister || !flagAction) return;

    setFlagRegisterList([
      ...flagRegisterList,
      {
        id: Date.now(),
        flagRegister,
        flagAction,
      },
    ]);

    setFlagRegister("");
    setFlagAction("");
  };

  const handleAddGPRegister = () => {
    if (!gpRegister) return;

    setGpRegisterList([
      ...gpRegisterList,
      {
        id: Date.now(),
        gpRegister,
      },
    ]);

    setGpRegister("");
  };

  const handleAddAddressingMode = () => {
    if (!addressingMode || !addressingModeCode || !symbol) return;

    setAddressingModeList([
      ...addressingModeList,
      {
        id: Date.now(),
        addressingMode,
        addressingModeCode,
        symbol,
      },
    ]);

    setAddressingMode("");
    setAddressingModeCode("");
    setSymbol("");
  };

  return (
    <>
      <Header />

      <div className="pt-20">
        <h2 className="text-blue-900 text-xl text-center font-bold">
          Register Design
        </h2>
      </div>

      {/* Add Register Card */}
      <div className="m-6 p-6 shadow-md rouded-xl bg-white order border-gray-200 rounded-xl">
        <div className="flex items-center gap-2 mb-6 text-black font-semibold">
          <span>Add Registers</span>
        </div>

        <div>
          <span className="text-black">Flag Register</span>
          <input
            value={flagRegister}
            onChange={(e) => setFlagRegister(e.target.value)}
            className=" mt-2 h-8 mb-4 pl-2 bg-gray-100 w-full rounded-md border border-gray-300 text-black"
            type="text"
            placeholder="Enter Flag Register Name"
          />

          <span className="text-black">Flag Register Action</span>
          <textarea
            value={flagAction}
            onChange={(e) => setFlagAction(e.target.value)}
            className="auto-textarea h-20  mt-2 pl-2 bg-gray-100 w-full rounded-md border border-xl border-gray-300 text-black"
            type="text"
            placeholder="//Write Java Code here for Logic of Flag Register"
          />

          <button
            onClick={handleAddFlagRegister}
            className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
          >
            ADD
          </button>

          {/* FLAG REGISTER OUTPUT */}
          {flagRegisterList.length > 0 && (
            <div className="m-6 p-6 shadow-md rouded-xl bg-white order border-gray-200 rounded-xl">
              {flagRegisterList.map((item) => (
                <div key={item.id} className="mb-4 text-black ">
                  <p><b>Flag Register:</b> {item.flagRegister}</p>
                  <p><b>Action:</b> {item.flagAction}</p>
                </div>
              ))}
            </div>
          )}

          <span className="text-black">GP Register</span>
          <input
            value={gpRegister}
            onChange={(e) => setGpRegister(e.target.value)}
            className=" mt-2 mb-4 pl-2 bg-gray-100 w-full h-8 rounded-md border border-gray-300 text-black"
            type="text"
            placeholder="Enter Flag Register Name"
          />

          <button
            onClick={handleAddGPRegister}
            className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg text-center font-semibold"
          >
            ADD
          </button>
        </div>

        {/* GP REGISTER OUTPUT */}
        {gpRegisterList.length > 0 && (
          <div className="m-6 p-6 shadow-md rouded-xl bg-white order border-gray-200 rounded-xl">
            {gpRegisterList.map((item) => (
              <div key={item.id} className="mb-4 text-black">
                <p><b>GP Register:</b> {item.gpRegister}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Addressing Mode card */}
      <div className="m-6 p-6 shadow-md rouded-xl bg-white order border-gray-200 rounded-xl">
        <div className="flex items-center gap-2 mb-6 text-black font-semibold">
          <span>Add Addressing Modes</span>
        </div>

        <div>
          <span className="text-black">Addressing Mode</span>
          <select
            value={addressingMode}
            onChange={(e) => setAddressingMode(e.target.value)}
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
            value={addressingModeCode}
            onChange={(e) => setAddressingModeCode(e.target.value)}
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

          <span className="text-black">Synbol</span>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="auto-textarea mt-2 pl-2 h-8 bg-gray-100 w-full rounded-md border border-xl border-gray-300 text-black"
            type="text"
            placeholder="Enter Symbol"
          />

          <button
            onClick={handleAddAddressingMode}
            className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
          >
            ADD
          </button>
        </div>

        {/* ADDRESSING MODE OUTPUT */}
        {addressingModeList.length > 0 && (
          <div className="m-6 p-6 shadow-md rouded-xl bg-white order border-gray-200 rounded-xl">
            {addressingModeList.map((item) => (
              <div key={item.id} className="mb-4 text-black">
                <p><b>Mode:</b> {item.addressingMode}</p>
                <p><b>Code:</b> {item.addressingModeCode}</p>
                <p><b>Symbol:</b> {item.symbol}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 mb-14">
        <button
          className="w-full h-8 mb-4 text-white bg-blue-900 rounded-lg mt-4 text-center font-semibold"
          onClick={() => navigate("/instruction")}
        >
          Next
        </button>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Register;
