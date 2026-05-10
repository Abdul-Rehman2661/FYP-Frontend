// src/utils/cycleAnimationTrace.js

const DEFAULT_FLAGS = ["Zero", "Carry", "Sign", "Overflow"];
const DEFAULT_BIT_SIZE = 32;

// IMPORTANT: Backend flag index mapping (matches C# ExecutionService)
const BACKEND_FLAG_INDICES = {
  CARRY: 0,
  OVERFLOW: 1,
  SIGN: 2,
  ZERO: 3
};

// Frontend flag names in order
const FLAG_NAMES = ["Carry", "Overflow", "Sign", "Zero"];

const normalize = (value) => String(value || "").trim().toUpperCase();

const isEmptyValue = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "-" ||
    value === "NULL" ||
    value === "null"
  );
};

const cleanValue = (value) => {
  if (isEmptyValue(value)) return 0;
  return value;
};

const cloneObject = (obj = {}) => JSON.parse(JSON.stringify(obj || {}));

// Convert backend flag array to frontend flag object
const convertBackendFlagsToObject = (backendFlagsArray) => {
  if (!backendFlagsArray || !Array.isArray(backendFlagsArray)) {
    return {
      Carry: 0,
      Overflow: 0,
      Sign: 0,
      Zero: 0
    };
  }
  
  return {
    Carry: backendFlagsArray[BACKEND_FLAG_INDICES.CARRY] ? 1 : 0,
    Overflow: backendFlagsArray[BACKEND_FLAG_INDICES.OVERFLOW] ? 1 : 0,
    Sign: backendFlagsArray[BACKEND_FLAG_INDICES.SIGN] ? 1 : 0,
    Zero: backendFlagsArray[BACKEND_FLAG_INDICES.ZERO] ? 1 : 0
  };
};

// Convert frontend flag object to backend flag array
const convertFrontendFlagsToArray = (frontendFlagsObject) => {
  const flagsArray = [false, false, false, false];
  
  flagsArray[BACKEND_FLAG_INDICES.CARRY] = frontendFlagsObject.Carry === 1;
  flagsArray[BACKEND_FLAG_INDICES.OVERFLOW] = frontendFlagsObject.Overflow === 1;
  flagsArray[BACKEND_FLAG_INDICES.SIGN] = frontendFlagsObject.Sign === 1;
  flagsArray[BACKEND_FLAG_INDICES.ZERO] = frontendFlagsObject.Zero === 1;
  
  return flagsArray;
};

const parseNumber = (value) => {
  const text = String(value || "").replace("#", "").trim();
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
};

const parseBitSize = (value) => {
  const match = String(value || "").match(/\d+/);
  const size = match ? Number(match[0]) : DEFAULT_BIT_SIZE;
  return Number.isFinite(size) && size > 0 ? size : DEFAULT_BIT_SIZE;
};

const isMemoryOperand = (operand) => {
  return /^\[.*\]$/.test(String(operand || "").trim());
};

const getMemoryAddress = (operand) => {
  return String(operand || "").replace("[", "").replace("]", "").trim();
};

const parseInstructionLine = (instructionText) => {
  const text = String(instructionText || "").trim();
  const firstSpace = text.search(/\s/);

  if (firstSpace === -1) {
    return {
      mnemonic: text,
      operands: [],
    };
  }

  const mnemonic = text.slice(0, firstSpace).trim();
  const operandText = text.slice(firstSpace + 1).trim();

  const operands = operandText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    mnemonic,
    operands,
  };
};

const looksLikeRegister = (operand) => {
  const text = String(operand || "").trim();

  if (!text) return false;
  if (isMemoryOperand(text)) return false;
  if (parseNumber(text) !== null) return false;

  return /^[A-Za-z][A-Za-z0-9_]*$/.test(text);
};

const getArchitectureRegisters = (architecture = {}) => {
  return (
    architecture?.generalRegisters ||
    architecture?.GeneralRegisters ||
    architecture?.registers ||
    architecture?.Registers ||
    architecture?.ArchitectureRegisters ||
    architecture?.architectureRegisters ||
    []
  );
};

const getRegisterName = (register) => {
  return (
    register?.name ||
    register?.Name ||
    register?.RegisterName ||
    register?.registerName ||
    ""
  );
};

const getRegisterBitSize = (register) => {
  return parseBitSize(
    register?.size ||
      register?.Size ||
      register?.RegisterSize ||
      register?.registerSize ||
      register?.RegisterBitSize ||
      register?.registerBitSize
  );
};

const isFlagRegister = (reg) => {
  const value =
    reg?.isFlagRegister ||
    reg?.IsFlagRegister ||
    reg?.is_flag_register ||
    false;

  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "True"
  );
};

const getRegisterNamesFromArchitecture = (architecture = {}) => {
  return getArchitectureRegisters(architecture)
    .filter((reg) => !isFlagRegister(reg))
    .map(getRegisterName)
    .filter(Boolean);
};

const getRegisterSizesFromArchitecture = (architecture = {}) => {
  const sizes = {};

  getArchitectureRegisters(architecture)
    .filter((reg) => !isFlagRegister(reg))
    .forEach((reg) => {
      const name = getRegisterName(reg);

      if (name) {
        sizes[normalize(name)] = getRegisterBitSize(reg);
      }
    });

  return sizes;
};

const getRegisterNamesFromProgram = (steps = []) => {
  const names = new Set();

  steps.forEach((step) => {
    const { operands } = parseInstructionLine(step?.instructionText || "");

    operands.forEach((operand) => {
      if (looksLikeRegister(operand)) {
        names.add(operand);
      }
    });
  });

  return Array.from(names);
};

const getRegisterNames = (architecture = {}, steps = []) => {
  const fromArchitecture = getRegisterNamesFromArchitecture(architecture);
  const fromProgram = getRegisterNamesFromProgram(steps);

  const merged = new Map();

  [...fromArchitecture, ...fromProgram].forEach((name) => {
    merged.set(normalize(name), name);
  });

  return Array.from(merged.values());
};

const getFlagNames = (architecture = {}) => {
  const flags =
    architecture?.flagRegisters ||
    architecture?.FlagRegisters ||
    architecture?.flags ||
    architecture?.Flags ||
    architecture?.ArchitectureFlags ||
    architecture?.architectureFlags ||
    [];

  const names = flags
    .map(
      (flag) =>
        flag?.name ||
        flag?.Name ||
        flag?.FlagName ||
        flag?.flagName ||
        flag?.RegisterName ||
        flag?.registerName
    )
    .filter(Boolean);

  return names.length > 0 ? names : DEFAULT_FLAGS;
};

// Registers animation - starts with 0
const createInitialRegisters = (architecture = {}, steps = []) => {
  const registerNames = getRegisterNames(architecture, steps);
  const result = {};

  registerNames.forEach((name) => {
    result[name] = 0;
  });

  return result;
};

// FIXED: Create initial flags as OBJECT with proper names (matching backend order)
const createInitialFlags = (architecture = {}) => {
  // Always use the standard flag names in correct order
  return {
    Carry: 0,
    Overflow: 0,
    Sign: 0,
    Zero: 0
  };
};

const findRegisterKey = (registers, operand) => {
  const target = normalize(operand);

  return Object.keys(registers || {}).find((key) => normalize(key) === target);
};

const readOperandValue = (operand, registers, memory) => {
  const text = String(operand || "").trim();

  if (isMemoryOperand(text)) {
    const address = getMemoryAddress(text);
    return cleanValue(memory[address]);
  }

  const registerKey = findRegisterKey(registers, text);

  if (registerKey) {
    return cleanValue(registers[registerKey]);
  }

  const number = parseNumber(text);

  if (number !== null) {
    return number;
  }

  return text;
};

const getOperatorFromAction = (actionStep) => {
  const text = String(actionStep || "");

  if (text.includes("+")) return "+";
  if (text.includes("-")) return "-";
  if (text.includes("*")) return "*";
  if (text.includes("/")) return "/";

  return null;
};

const getRhsExpression = (actionStep) => {
  let rhs = String(actionStep || "").trim();

  if (rhs.includes("<-")) {
    rhs = rhs.split("<-").slice(1).join("<-").trim();
  } else if (rhs.includes("=")) {
    rhs = rhs.split("=").slice(1).join("=").trim();
  }

  return rhs.replace(/;$/g, "").trim();
};

const safeEvaluateExpression = (expression) => {
  const safe = String(expression || "").trim();

  if (!/^[0-9+\-*/().\s]+$/.test(safe)) {
    return safe;
  }

  try {
    const value = Function(`"use strict"; return (${safe});`)();
    return Number.isFinite(value) ? value : safe;
  } catch (e) {
    return safe;
  }
};

const resolveExpressionText = ({ actionStep, operands, registers, memory }) => {
  let rhs = getRhsExpression(actionStep);

  operands.forEach((operand, index) => {
    const token = new RegExp(`\\bA${index + 1}\\b`, "gi");
    const value = readOperandValue(operand, registers, memory);
    rhs = rhs.replace(token, String(value));
  });

  return rhs;
};

const resolveActionResult = ({ actionStep, operands, registers, memory }) => {
  const expressionText = resolveExpressionText({
    actionStep,
    operands,
    registers,
    memory,
  });

  return safeEvaluateExpression(expressionText);
};

const resolveOperandsAsNumbers = ({ operands, registers, memory }) => {
  return operands.map((operand) => {
    const value = readOperandValue(operand, registers, memory);
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  });
};

const getDestinationOperand = (operands = []) => {
  return operands[0] || null;
};

const getSignedRange = (bitSize) => {
  return {
    min: -Math.pow(2, bitSize - 1),
    max: Math.pow(2, bitSize - 1) - 1,
  };
};

const wrapToSigned = (value, bitSize) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return value;

  const modulo = Math.pow(2, bitSize);
  const signLimit = Math.pow(2, bitSize - 1);

  let wrapped = ((numeric % modulo) + modulo) % modulo;

  if (wrapped >= signLimit) {
    wrapped = wrapped - modulo;
  }

  return wrapped;
};

const setFlagValue = (flags, changedFlags, flagName, value) => {
  if (!flagName) return;

  const nextValue = value ? 1 : 0;

  if (flags[flagName] !== nextValue) {
    flags[flagName] = nextValue;
    changedFlags.push(flagName);
  } else {
    flags[flagName] = nextValue;
  }
};

// FIXED: Direct flag name mapping (no need for findFlagKey)
const updateFlags = ({
  flags,
  rawResult,
  storedResult,
  operator,
  operandNumbers,
  bitSize,
}) => {
  const changedFlags = [];

  const rawNumeric = Number(rawResult);
  const storedNumeric = Number(storedResult);

  if (!Number.isFinite(rawNumeric) || !Number.isFinite(storedNumeric)) {
    return changedFlags;
  }

  const zero = storedNumeric === 0;
  const sign = storedNumeric < 0;
  
  let carry = false;
  let overflow = false;
  
  if (operator === "+") {
    carry = rawNumeric > 65535 || rawNumeric < 0;
    overflow = ((operandNumbers[0] > 0 && operandNumbers[1] > 0 && rawNumeric < 0) ||
                (operandNumbers[0] < 0 && operandNumbers[1] < 0 && rawNumeric >= 0));
  } else if (operator === "-") {
    carry = (operandNumbers[0] < operandNumbers[1]);
    overflow = ((operandNumbers[0] > 0 && operandNumbers[1] < 0 && rawNumeric < 0) ||
                (operandNumbers[0] < 0 && operandNumbers[1] > 0 && rawNumeric >= 0));
  } else if (operator === "*") {
    carry = rawNumeric > 65535 || rawNumeric < 0;
  }

  // Set flags directly by name
  setFlagValue(flags, changedFlags, "Zero", zero);
  setFlagValue(flags, changedFlags, "Sign", sign);
  setFlagValue(flags, changedFlags, "Carry", carry);
  setFlagValue(flags, changedFlags, "Overflow", overflow);

  return changedFlags;
};

const applyExecuteStep = ({
  actionStep,
  instructionText,
  registers,
  flags,
  memory,
  registerSizes,
}) => {
  const { operands } = parseInstructionLine(instructionText);
  const destination = getDestinationOperand(operands);

  const changedRegisters = [];
  const changedMemory = [];
  let changedFlags = [];

  if (!destination) {
    return {
      changedRegisters,
      changedMemory,
      changedFlags,
    };
  }

  const operator = getOperatorFromAction(actionStep);

  const operandNumbers = resolveOperandsAsNumbers({
    operands,
    registers,
    memory,
  });

  const rawResult = resolveActionResult({
    actionStep,
    operands,
    registers,
    memory,
  });

  const destinationRegisterKey = findRegisterKey(registers, destination);

  if (destinationRegisterKey) {
    const bitSize =
      registerSizes[normalize(destinationRegisterKey)] || DEFAULT_BIT_SIZE;

    const storedResult = wrapToSigned(rawResult, bitSize);

    const previous = registers[destinationRegisterKey];

    registers[destinationRegisterKey] = storedResult;

    if (previous !== storedResult) {
      changedRegisters.push(destinationRegisterKey);
    }

    changedFlags = updateFlags({
      flags,
      rawResult,
      storedResult,
      operator,
      operandNumbers,
      bitSize,
    });
  } else if (isMemoryOperand(destination)) {
    const address = getMemoryAddress(destination);
    const previous = memory[address];

    memory[address] = rawResult;

    if (previous !== rawResult) {
      changedMemory.push(address);
    }
  }

  return {
    changedRegisters,
    changedMemory,
    changedFlags,
  };
};

const makeCycle = ({
  tIndex,
  stage,
  instructionText,
  microOperation,
  registers,
  flags,
  memory,
  changedRegisters = [],
  changedFlags = [],
  changedMemory = [],
}) => {
  return {
    tState: `T${tIndex}`,
    clockCycle: tIndex + 1,
    stage,
    instruction: instructionText,
    microOperation,
    registers: cloneObject(registers),
    flags: cloneObject(flags),
    memory: cloneObject(memory),
    changedRegisters,
    changedFlags,
    changedMemory,
  };
};

const getFetchOperation = (index, instructionText) => {
  if (index === 0) return "Fetch instruction from program memory";
  if (index === 1) return `Load instruction: ${instructionText}`;
  return `Fetch step ${index + 1}`;
};

const getDecodeOperation = (index) => {
  if (index === 0) return "Decode mnemonic and operands";
  return `Decode step ${index + 1}`;
};

export const buildCycleAnimationTrace = ({
  countResult,
  architecture,
  executionResult,
}) => {
  const steps = countResult?.steps || [];
  const trace = [];

  const registers = createInitialRegisters(architecture, steps);
  const flags = createInitialFlags(architecture);
  const memory = {};
  const registerSizes = getRegisterSizesFromArchitecture(architecture);

  let tIndex = 0;

  steps.forEach((step) => {
    const instructionText = step?.instructionText || "";

    const fetchCycles = Number(step?.fetchCycles || 0);
    const decodeCycles = Number(step?.decodeCycles || 0);

    for (let i = 0; i < fetchCycles; i++) {
      trace.push(
        makeCycle({
          tIndex,
          stage: "Fetch",
          instructionText,
          microOperation: getFetchOperation(i, instructionText),
          registers,
          flags,
          memory,
        })
      );

      tIndex += 1;
    }

    for (let i = 0; i < decodeCycles; i++) {
      trace.push(
        makeCycle({
          tIndex,
          stage: "Decode",
          instructionText,
          microOperation: getDecodeOperation(i),
          registers,
          flags,
          memory,
        })
      );

      tIndex += 1;
    }

    const actionSteps =
      step?.actionSteps?.length > 0 ? step.actionSteps : ["Execute action"];

    actionSteps.forEach((actionStep) => {
      const changes = applyExecuteStep({
        actionStep,
        instructionText,
        registers,
        flags,
        memory,
        registerSizes,
      });

      trace.push(
        makeCycle({
          tIndex,
          stage: "Execute",
          instructionText,
          microOperation: actionStep,
          registers,
          flags,
          memory,
          changedRegisters: changes.changedRegisters,
          changedFlags: changes.changedFlags,
          changedMemory: changes.changedMemory,
        })
      );

      tIndex += 1;
    });
  });

  return trace;
};

// Helper function to merge backend execution results into animation
export const mergeBackendFlagsToAnimation = (animationTrace, backendExecutionResult) => {
  if (!backendExecutionResult || !backendExecutionResult.Flags) {
    return animationTrace;
  }
  
  const backendFlagsArray = backendExecutionResult.Flags;
  const finalFlagsObject = convertBackendFlagsToArray(backendFlagsArray);
  
  // Update the last cycle with actual backend flags
  if (animationTrace.length > 0) {
    const lastCycle = animationTrace[animationTrace.length - 1];
    lastCycle.flags = finalFlagsObject;
  }
  
  return animationTrace;
};