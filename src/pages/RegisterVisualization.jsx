import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { ArchitectureContext } from "../context/ArchitectureContext";

function RegisterVisualization() {
  const { id } = useParams();

  console.log("Arch Id:", id);

  const { executionResult, userCode } = useContext(ArchitectureContext);
  const [registerMeta, setRegisterMeta] = useState([]);
  const registers = executionResult?.Registers || [];
  const flags = executionResult?.Flags || [];
  const location = useLocation();
  const { code } = location.state || {};

  // Flag Index Mapping (matches backend)
  const FLAG_INDICES = {
    CARRY: 0,
    OVERFLOW: 1,
    SIGN: 2,
    ZERO: 3,
  };

  // Get flag values with correct mapping
  const getFlagValue = (flagName) => {
    if (!flags || flags.length === 0) return 0;

    switch (flagName.toLowerCase()) {
      case "carry":
        return flags[FLAG_INDICES.CARRY] ? 1 : 0;
      case "overflow":
        return flags[FLAG_INDICES.OVERFLOW] ? 1 : 0;
      case "sign":
        return flags[FLAG_INDICES.SIGN] ? 1 : 0;
      case "zero":
        return flags[FLAG_INDICES.ZERO] ? 1 : 0;
      default:
        return 0;
    }
  };

  // 🔥 FETCH FROM API
  useEffect(() => {
    if (!id) return;
    const fetchRegisters = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/architecture/get-full/${id}`,
        );
        console.log("API RESPONSE:", res.data);

        setRegisterMeta(res.data?.Registers || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegisters();
  }, [id]);

  // ✅ FILTER registers based on IsFlagRegister
  const generalRegistersMeta = registerMeta.filter(
    (r) => r.IsFlagRegister === false,
  );

  const flagRegistersMeta = registerMeta.filter(
    (r) => r.IsFlagRegister === true,
  );

  // Sort both arrays by RegisterID
  const sortedGeneralMeta = [...generalRegistersMeta].sort(
    (a, b) => a.RegisterID - b.RegisterID,
  );

  const sortedFlagMeta = [...flagRegistersMeta].sort(
    (a, b) => a.RegisterID - b.RegisterID,
  );

  // Display flag status with color coding
  const getFlagStyle = (value) => {
    return value === 1
      ? "bg-green-100 text-green-700 border-green-300 font-bold"
      : "bg-white text-gray-500 border-gray-200";
  };

  // NEW: Get output value from last affected register
  const getOutputValue = () => {
    if (!executionResult?.Registers || !registerMeta.length) return null;
    
    const generalRegisters = registerMeta.filter(r => r.IsFlagRegister === false);
    
    // Method 1: Get destination register from last instruction (if userCode is available)
    if (userCode && userCode.length > 0) {
      const lastLine = userCode[userCode.length - 1];
      const parts = lastLine.trim().split(/\s+/);
      const operands = parts.slice(1).join(' ').split(',');
      const firstOperand = operands[0]?.trim();
      
      // Check if first operand is a register
      const destRegister = generalRegisters.find(r => r.Name === firstOperand);
      if (destRegister) {
        const index = generalRegisters.findIndex(r => r.Name === firstOperand);
        if (index !== -1 && executionResult.Registers[index] !== undefined) {
          return {
            value: executionResult.Registers[index],
            register: firstOperand,
            description: `${firstOperand} = ${executionResult.Registers[index]}`
          };
        }
      }
    }
    
    // Method 2: Fallback - Get last non-zero register
    for (let i = executionResult.Registers.length - 1; i >= 0; i--) {
      if (executionResult.Registers[i] !== 0) {
        const registerName = generalRegisters[i]?.Name || `R${i+1}`;
        return {
          value: executionResult.Registers[i],
          register: registerName,
          description: `${registerName} = ${executionResult.Registers[i]}`
        };
      }
    }
    
    // Method 3: Get first register with value
    for (let i = 0; i < executionResult.Registers.length; i++) {
      if (executionResult.Registers[i] !== 0) {
        const registerName = generalRegisters[i]?.Name || `R${i+1}`;
        return {
          value: executionResult.Registers[i],
          register: registerName,
          description: `${registerName} = ${executionResult.Registers[i]}`
        };
      }
    }
    
    return null;
  };

  const outputResult = getOutputValue();

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24">
        <h2 className="text-center text-xl font-bold text-blue-900">
          Register Visualization
        </h2>

        <div className="p-4 bg-gray-50 pb-16 min-h-screen">
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN: General Purpose Registers */}
              <div>
                <p className="text-sm text-gray-700 mb-2 font-semibold">
                  General Purpose Registers
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {sortedGeneralMeta.map((register, index) => {
                      // Get the corresponding value from executionResult.Registers
                      const registerValue =
                        registers[index] !== undefined ? registers[index] : 0;

                      return (
                        <div key={register.RegisterID} className="text-center">
                          <p className="text-xs text-gray-700 mb-1 font-medium">
                            {register.Name}
                          </p>
                          <div className="border rounded-md py-2 bg-white text-black text-sm font-mono">
                            {registerValue}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Default Static Flag Registers */}
              <div>
                <p className="text-sm text-gray-700 mb-2 font-semibold">
                  Flag Registers
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Carry Flag (CF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">
                        Carry 
                      </p>
                      <div
                        className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue("carry"))}`}
                      >
                        {getFlagValue("carry")}
                      </div>
                    </div>

                    {/* Overflow Flag (OF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">
                        Overflow 
                      </p>
                      <div
                        className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue("overflow"))}`}
                      >
                        {getFlagValue("overflow")}
                      </div>
                    </div>

                    {/* Sign Flag (SF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">
                        Sign
                      </p>
                      <div
                        className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue("sign"))}`}
                      >
                        {getFlagValue("sign")}
                      </div>
                    </div>

                    {/* Zero Flag (ZF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">
                        Zero
                      </p>
                      <div
                        className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue("zero"))}`}
                      >
                        {getFlagValue("zero")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section - Display result from last affected register */}
            <div className="h-full mt-6">
              <p className="text-gray-800 mb-2 font-semibold">Output / Result</p>
              <div className="border border-gray-300 rounded-lg bg-gray-100 overflow-y-auto">
                <div className="p-4">
                  {outputResult ? (
                    <div className="">
                      <div className="mb-3">
                        {/* <span className="text-gray-500 text-sm font-mono">
                          Last Affected Register: <span className="font-bold text-blue-600">{outputResult.register}</span>
                        </span> */}
                      </div>
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <span className="text-3xl font-semibold text-black">
                          {outputResult.value}
                        </span>
                        {/* <p className="text-gray-600 font-mono text-sm mt-3">
                          {outputResult.description}
                        </p> */}
                      </div>
                      
                      {/* Show last instruction details if available */}
                      {/* {executionResult?.InstructionDetails && executionResult.InstructionDetails.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-mono">
                            Last Instruction: {executionResult.InstructionDetails[executionResult.InstructionDetails.length - 1]?.AssemblyCode || "N/A"}
                          </p>
                        </div>
                      )} */}
                    </div>
                  ) : (
                    <div className="flex h-32">
                      <span className="text-gray-400 font-mono">
                        No output to display.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default RegisterVisualization;