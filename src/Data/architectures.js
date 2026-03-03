export const architectures = [
  {
    id: 1,
    name: "Architecture A",
    memorySize: "128 Bytes",
    busSize: "8-bit",
    stackSize: "16 bytes",
    registers: [
      {
        name: "R1",
        Size: "16-bits",
      },
      {
        name: "R2",
        Size: "16-bits",
      },
      {
        name: "R3",
        Size: "16-bits",
      },
      {
        name: "R4",
        Size: "16-bits",
      },
    ],
    instructions: [
      {
        mnemonic: "LOAD",
        opcode: "00",
        instructionSet: "LOAD R1, M[0x02]",
        action: "	R1 = M[0X01]",
      },
      {
        mnemonic: "STORE",
        opcode: "00",
        instructionSet: "M[0x04] = R3",
        action: "M[0X05] = R3",
      },
    ],
    addressingModes: [
      {
        name: "Direct",
        instruction: "	LOAD $10",
      },
    ],
    totalRegisters: 4,
    totalInstructions: 4,
    flagRegister: [
      {
        name: "Zero",
        size: "1 bit",
      },
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-02-15",
  },
  {
    id: 2,
    name: "Architecture B",
    memorySize: "256 Bytes",
    busSize: "16-bit",
    stackSize: "16-bit",
    registers: [
      {
        name: "R1",
        Size: "16-bits",
      },
      {
        name: "R2",
        Size: "16-bits",
      },
      {
        name: "R3",
        Size: "16-bits",
      },
      {
        name: "R4",
        Size: "16-bits",
      },
    ],
    instructions: [
      {
        mnemonic: "LOAD",
        opcode: "00",
        instructionSet: "LOAD R1, M[0x02]",
        action: "	R1 = M[0X01]",
      },
      {
        mnemonic: "STORE",
        opcode: "00",
        instructionSet: "M[0x04] = R3",
        action: "M[0X05] = R3",
      },
    ],
    addressingModes: [
      {
        name: "Direct",
        instruction: "	LOAD $10",
      },
    ],
    flagRegister: [
      {
        name: "Zero",
        size: "1 bit",
      },
    ],
    totalRegisters: 6,
    totalInstructions: 4,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01",
  },
  {
    id: 3,
    name: "Architecture C",
    memorySize: "256 Bytes",
    busSize: "16-bit",
    stackSize: "16-bit",
    registers: [
      {
        name: "R1",
        Size: "16-bits",
      },
      {
        name: "R2",
        Size: "16-bits",
      },
      {
        name: "R3",
        Size: "16-bits",
      },
      {
        name: "R4",
        Size: "16-bits",
      },
    ],
    instructions: [
      {
        mnemonic: "LOAD",
        opcode: "00",
        instructionSet: "LOAD R1, M[0x02]",
        action: "	R1 = M[0X01]",
      },
      {
        mnemonic: "STORE",
        opcode: "00",
        instructionSet: "M[0x04] = R3",
        action: "M[0X05] = R3",
      },
    ],
    addressingModes: [
      {
        name: "Direct",
        instruction: "	LOAD $10",
      },
    ],
    flagRegister: [
      {
        name: "Zero",
        size: "1 bit",
      },
    ],
    totalRegisters: 6,
    totalInstructions: 4,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01",
  },
  {
    id: 4,
    name: "Architecture D",
    memorySize: "256 Bytes",
    busSize: "16-bit",
    stackSize: "16-bit",
    registers: [
      {
        name: "R1",
        Size: "16-bits",
      },
      {
        name: "R2",
        Size: "16-bits",
      },
      {
        name: "R3",
        Size: "16-bits",
      },
      {
        name: "R4",
        Size: "16-bits",
      },
    ],
    instructions: [
      {
        mnemonic: "LOAD",
        opcode: "00",
        instructionSet: "LOAD R1, M[0x02]",
        action: "	R1 = M[0X01]",
      },
      {
        mnemonic: "STORE",
        opcode: "00",
        instructionSet: "M[0x04] = R3",
        action: "M[0X05] = R3",
      },
    ],
    addressingModes: [
      {
        name: "Direct",
        instruction: "	LOAD $10",
      },
    ],
    flagRegister: [
      {
        name: "Zero",
        size: "1 bit",
      },
    ],
    totalRegisters: 6,
    totalInstructions: 4,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01",
  },
  {
    id: 5,
    name: "Architecture E",
    memorySize: "256 Bytes",
    busSize: "16-bit",
    stackSize: "16-bit",
    registers: [
      {
        name: "R1",
        Size: "16-bits",
      },
      {
        name: "R2",
        Size: "16-bits",
      },
      {
        name: "R3",
        Size: "16-bits",
      },
      {
        name: "R4",
        Size: "16-bits",
      },
    ],
    instructions: [
      {
        mnemonic: "LOAD",
        opcode: "00",
        instructionSet: "LOAD R1, M[0x02]",
        action: "	R1 = M[0X01]",
      },
      {
        mnemonic: "STORE",
        opcode: "00",
        instructionSet: "M[0x04] = R3",
        action: "M[0X05] = R3",
      },
    ],
    addressingModes: [
      {
        name: "Direct",
        instruction: "LOAD $10",
      },
    ],
    flagRegister: [
      {
        name: "Zero",
        size: "1 bit",
      },
    ],
    totalRegisters: 6,
    totalInstructions: 4,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01",
  },
  {
    id: 6,
    name: "Architecture F",
    memorySize: "256 Bytes",
    busSize: "16-bit",
    stackSize: "16-bit",
    registers: [
      {
        name: "R1",
        Size: "16-bits",
      },
      {
        name: "R2",
        Size: "16-bits",
      },
      {
        name: "R3",
        Size: "16-bits",
      },
      {
        name: "R4",
        Size: "16-bits",
      },
    ],
    instructions: [
      {
        mnemonic: "LOAD",
        opcode: "00",
        instructionSet: "LOAD R1, M[0x02]",
        action: "	R1 = M[0X01]",
      },
      {
        mnemonic: "STORE",
        opcode: "00",
        instructionSet: "M[0x04] = R3",
        action: "M[0X05] = R3",
      },
    ],
    addressingModes: [
      {
        name: "Direct",
        instruction: "	LOAD $10",
      },
    ],
    flagRegister: [
      {
        name: "Zero",
        size: "1 bit",
      },
    ],
    totalRegisters: 6,
    totalInstructions: 4,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01",
  },
];
