import { createContext, useState, useEffect } from "react";

export const ArchitectureContext = createContext();

export const ArchitectureProvider = ({ children }) => {
  const [architectureData, setArchitectureData] = useState({});
  const [registerData, setRegisterData] = useState([]);
  const [addressingModesData, setAddressingModesData] = useState([]);
  const [instructionData, setInstructionData] = useState([]);
  const [executionResult, setExecutionResult] = useState(null);
  
  const [savedCode, setSavedCode] = useState("");
  const [currentArchitectureId, setCurrentArchitectureId] = useState(null);

  useEffect(() => {
    const lastArchitecture = localStorage.getItem("last_architecture_id");
    if (lastArchitecture) {
      const code = localStorage.getItem(`saved_code_${lastArchitecture}`);
      if (code) {
        setSavedCode(code);
        setCurrentArchitectureId(parseInt(lastArchitecture));
      }
    }
  }, []);

  const saveCodeForArchitecture = (architectureId, code) => {
    if (!architectureId) return;
    const key = `saved_code_${architectureId}`;
    localStorage.setItem(key, code);
    setSavedCode(code);
    setCurrentArchitectureId(architectureId);
    
    localStorage.setItem("last_architecture_id", architectureId);
  };

  const loadCodeForArchitecture = (architectureId) => {
    if (!architectureId) return "";
    const key = `saved_code_${architectureId}`;
    const saved = localStorage.getItem(key);
    return saved || "";
  };

  const clearCodeForArchitecture = (architectureId) => {
    if (!architectureId) return;
    const key = `saved_code_${architectureId}`;
    localStorage.removeItem(key);
    if (currentArchitectureId === architectureId) {
      setSavedCode("");
    }
  };

  const clearAllSavedCodes = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith("saved_code_")) {
        localStorage.removeItem(key);
      }
    });
    setSavedCode("");
    setCurrentArchitectureId(null);
    localStorage.removeItem("last_architecture_id");
  };

  return (
    <ArchitectureContext.Provider
      value={{
        architectureData,
        setArchitectureData,
        registerData,
        setRegisterData,
        addressingModesData,
        setAddressingModesData,
        instructionData,
        setInstructionData,
        executionResult,
        setExecutionResult,
        savedCode,
        setSavedCode,
        currentArchitectureId,
        saveCodeForArchitecture,
        loadCodeForArchitecture,
        clearCodeForArchitecture,
        clearAllSavedCodes,
      }}
    >
      {children}
    </ArchitectureContext.Provider>
  );
};