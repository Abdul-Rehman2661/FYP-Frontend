import { createContext, useState } from "react";

export const ArchitectureContext = createContext(); 

export const ArchitectureProvider = ({ children }) => {
  const [architectureData, setArchitectureData] = useState({});
  const [registerData, setRegisterData] = useState([]);
  const [addressingModesData, setAddressingModesData] = useState([]); 
  const [instructionData, setInstructionData] = useState([]);
  const [executionResult, setExecutionResult] = useState(null);

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
      }}
    >
      {children}
    </ArchitectureContext.Provider>
  );
};