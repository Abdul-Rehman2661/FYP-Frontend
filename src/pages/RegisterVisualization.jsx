import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { ArchitectureContext } from "../context/ArchitectureContext";

function RegisterVisualization() {
  const { id } = useParams();

  console.log("Arch Id:", id);

  const { executionResult } = useContext(ArchitectureContext);
  const [registerMeta, setRegisterMeta] = useState([]);
  const registers = executionResult?.Registers || [];
  const flags = executionResult?.Flags || [];
  const [output, setOutput] = useState("");

  // Flag Index Mapping (matches backend)
  const FLAG_INDICES = {
    CARRY: 0,
    OVERFLOW: 1,
    SIGN: 2,
    ZERO: 3
  };

  // Get flag values with correct mapping
  const getFlagValue = (flagName) => {
    if (!flags || flags.length === 0) return 0;
    
    switch(flagName.toLowerCase()) {
      case 'carry':
        return flags[FLAG_INDICES.CARRY] ? 1 : 0;
      case 'overflow':
        return flags[FLAG_INDICES.OVERFLOW] ? 1 : 0;
      case 'sign':
        return flags[FLAG_INDICES.SIGN] ? 1 : 0;
      case 'zero':
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

              {/* RIGHT COLUMN: Default Static Flag Registers (Side by Side with General Purpose) */}
              <div>
                <p className="text-sm text-gray-700 mb-2 font-semibold">
                  Flag Registers
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Carry Flag (CF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">Carry (CF)</p>
                      <div className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue('carry'))}`}>
                        {getFlagValue('carry')}
                      </div>
                    </div>

                    {/* Overflow Flag (OF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">Overflow (OF)</p>
                      <div className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue('overflow'))}`}>
                        {getFlagValue('overflow')}
                      </div>
                    </div>

                    {/* Sign Flag (SF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">Sign (SF)</p>
                      <div className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue('sign'))}`}>
                        {getFlagValue('sign')}
                      </div>
                    </div>

                    {/* Zero Flag (ZF) */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 mb-1 font-medium">Zero (ZF)</p>
                      <div className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(getFlagValue('zero'))}`}>
                        {getFlagValue('zero')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* DYNAMIC FLAG REGISTER CODE - COMMENTED FOR FUTURE USE */}
              {/* ============================================================ */}
              
              {/* <div>
                <p className="text-sm text-gray-700 mb-2 font-semibold">
                  Flag Registers (Dynamic)
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sortedFlagMeta.map((register) => {
                      // Map backend flag name to our flag array index
                      let flagValue = 0;
                      const flagName = register.Name.toLowerCase();
                      
                      if (flagName === 'carry' || flagName === 'cf' || flagName === 'c') {
                        flagValue = flags[FLAG_INDICES.CARRY] ? 1 : 0;
                      } else if (flagName === 'overflow' || flagName === 'of' || flagName === 'o') {
                        flagValue = flags[FLAG_INDICES.OVERFLOW] ? 1 : 0;
                      } else if (flagName === 'sign' || flagName === 'sf' || flagName === 's') {
                        flagValue = flags[FLAG_INDICES.SIGN] ? 1 : 0;
                      } else if (flagName === 'zero' || flagName === 'zf' || flagName === 'z') {
                        flagValue = flags[FLAG_INDICES.ZERO] ? 1 : 0;
                      }
                      
                      return (
                        <div key={register.RegisterID} className="text-center">
                          <p className="text-xs text-gray-700 mb-1 font-medium">
                            {register.Name}
                          </p>
                          <div className={`border rounded-md py-2 text-sm font-mono transition-all duration-300 ${getFlagStyle(flagValue)}`}>
                            {flagValue}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div> */}
             
              {/* ============================================================ */}

            </div>

            {/* Flag Status Cards with Descriptions */}
            {/* <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-3 rounded-lg border transition-all duration-300 ${getFlagStyle(getFlagValue('carry'))}`}>
                <p className="text-xs font-semibold">Carry Flag (CF)</p>
                <p className="text-lg font-bold">{getFlagValue('carry')}</p>
                <p className="text-xs text-gray-500 mt-1">Set on unsigned overflow</p>
              </div>
              
              <div className={`p-3 rounded-lg border transition-all duration-300 ${getFlagStyle(getFlagValue('overflow'))}`}>
                <p className="text-xs font-semibold">Overflow Flag (OF)</p>
                <p className="text-lg font-bold">{getFlagValue('overflow')}</p>
                <p className="text-xs text-gray-500 mt-1">Set on signed overflow</p>
              </div>
              
              <div className={`p-3 rounded-lg border transition-all duration-300 ${getFlagStyle(getFlagValue('sign'))}`}>
                <p className="text-xs font-semibold">Sign Flag (SF)</p>
                <p className="text-lg font-bold">{getFlagValue('sign')}</p>
                <p className="text-xs text-gray-500 mt-1">Set when result is negative</p>
              </div>
              
              <div className={`p-3 rounded-lg border transition-all duration-300 ${getFlagStyle(getFlagValue('zero'))}`}>
                <p className="text-xs font-semibold">Zero Flag (ZF)</p>
                <p className="text-lg font-bold">{getFlagValue('zero')}</p>
                <p className="text-xs text-gray-500 mt-1">Set when result is zero</p>
              </div>
            </div> */}

            {/* Output Section */}
            <div className="h-full mt-6">
              <p className="text-gray-800 mb-2 font-semibold">Output</p>
              <div className="border border-gray-300 rounded-lg h-48 w-full bg-gray-100 overflow-y-auto">
                <p className="p-4 text-gray-600 font-mono">
                  {output || "No Output to display..."}
                </p>
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