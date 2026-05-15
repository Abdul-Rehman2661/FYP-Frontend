import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";

import {
  CpuChipIcon,
  ServerIcon,
  CodeBracketIcon,
  CubeIcon,
  CircleStackIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { ArchitectureContext } from "../context/ArchitectureContext";

function Detail() {
  const { id } = useParams();

  const { setRegisterData } = useContext(ArchitectureContext);
  const { setArchitectureData } = useContext(ArchitectureContext);
  const [architecture, setArchitecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/architecture/get-full/${id}`,
        );

        const data = res.data;

        setArchitectureData({
          memorySize: data?.Architecture?.MemorySize || 0,
          stackSize: data?.Architecture?.StackSize || 0,
          busSize: data?.Architecture?.BusSize || 0,
          name: data?.Architecture?.Name || "",
        });

        // 🔥 ADD THIS LINE (MAIN FIX)
        setRegisterData(data?.Registers || []);
        // 🔥 Mapping backend → frontend
        setArchitecture({
          name: data?.Architecture?.Name || "",
          memorySize: data?.Architecture?.MemorySize || "",
          busSize: data?.Architecture?.BusSize || "",
          stackSize: data?.Architecture?.StackSize || "",

          registers: (data?.Registers || []).map((r) => ({
            name: r.Name || "",
            size: r.RegisterSize || "",
            action: r.Action || "",
            IsFlagRegister: r.IsFlagRegister,
          })),

          instructions: (data?.Instructions || []).map((i) => ({
            mnemonic: i.Mnemonics || "",
            opcode: i.Opcode || "",
            noOfOperands: i.NumberOfOperands || 2,
            action: i.Action || "",
            // Preserve all original fields for detailed cards
            instructionId: i.InstructionID || null,
            architectureId: i.ArchitectureID || null,
            instructionFormat: i.InstructionFormat || null,
            interruptSymbol: i.InterruptSymbol || null,
            outputRegister: i.OutputRegister || null,
            inputRegister: i.InputRegister || null,
            operands: i.Operands || 0,
            Operand1: i.Operand1 || null,
            Operand2: i.Operand2 || null,
            Operand3: i.Operand3 || null,
            destinationOperand: i.DestinationOperand || null,
          })),

          // Not provided by backend → keep empty
          flagRegister: [],
          addressingModes: (data?.AddressingModes || []).map((i) => ({
            AddressingModeName: i.AddressingModeName || "",
            AddressingModeCode: i.AddressingModeCode || "",
            AddressingModeSymbol: i.AddressingModeSymbol || "",
          })),
        });
      } catch (err) {
        console.error(err);
        setArchitecture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // 🔹 Loading
  if (loading) {
    return <div className="p-4 pt-16 text-center">Loading...</div>;
  }

  // 🔹 Not found
  if (!architecture) {
    return (
      <div className="p-4 pt-16 text-center text-gray-500">
        Architecture Not Found
      </div>
    );
  }

  console.log(architecture.registers);

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24 text-center">
        <h2 className="text-xl text-blue-900 font-bold">Details</h2>
        <p className="pt-3 text-blue-900 text-sm">
          Technical specifications and reference manual.
        </p>
      </div>

      {/* ================= SYSTEM SPEC ================= */}
      <Card
        title="System Specifications"
        icon={<CpuChipIcon className="w-6 h-6" />}
      >
        <div className="grid grid-cols-2 gap-y-6 gap-x-20 text-sm">
          <Info label="Architecture Name" value={architecture.name} />
          <Info label="Memory Size" value={architecture.memorySize} />
          <Info label="Bus Size" value={architecture.busSize} />
          <Info label="Stack Size" value={architecture.stackSize} />
        </div>
      </Card>

      {/* ================= REGISTERS ================= */}
      <Card
        title="Registers File"
        icon={<CircleStackIcon className="w-6 h-6" />}
      >
        {/* Flag Registers */}
        <Table
          title="Flag Registers"
          headers={["Name", "Action"]}
          data={architecture.registers?.filter(
            (reg) => reg.IsFlagRegister === true,
          )}
          renderRow={(item, i) => (
            <tr key={i}>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.name}
              </td>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.action}
              </td>
            </tr>
          )}
        />

        {/* General Purpose Registers */}
        <Table
          title="General Purpose Registers"
          headers={["Name", "Size"]}
          data={architecture.registers?.filter(
            (reg) => reg.IsFlagRegister === false,
          )}
          renderRow={(item, i) => (
            <tr key={i}>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.name}
              </td>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.size}
              </td>
            </tr>
          )}
        />
      </Card>

      {/* ================= NEW: INSTRUCTION DETAILED CARDS ================= */}
      <Card
        title="Instruction Set"
        icon={<DocumentTextIcon className="w-6 h-6" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-blue-200">
            <thead className="bg-blue-100">
              <tr className="border-b border-blue-200">
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Mnemonic
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Opcode
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Micro Operation
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  # of Operands
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Destination Operand
                </th>
                {/* <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">Interrupt Symbol</th>
          <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">Output Register</th>
          <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">Input Register</th> */}
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Operand 1
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Operand 2
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900 border-r border-blue-200">
                  Operand 3
                </th>
                <th className="px-4 py-3 text-center font-semibold text-blue-900">
                  Affected Flags
                  <div className="grid grid-cols-4 gap-1 mt-1 text-xs">
                    <span className="font-medium">Zero</span>
                    <span className="font-medium">Carry</span>
                    <span className="font-medium">Sign</span>
                    <span className="font-medium">Overflow</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {architecture.instructions.map((instruction, idx) => {
                // Function to analyze micro operation and determine affected flags
                const getAffectedFlagsFromMicroOp = (microOp) => {
                  const flags = { Zero: 0, Carry: 0, Sign: 0, OverFlow: 0 };

                  if (!microOp) return flags;

                  const upperMicroOp = microOp.toUpperCase();

                  // Check for ADDITION operations
                  if (
                    upperMicroOp.includes("+") ||
                    upperMicroOp.includes("ADD") ||
                    upperMicroOp.includes("PLUS") ||
                    upperMicroOp.includes("SUM") ||
                    upperMicroOp.includes("INCREMENT")
                  ) {
                    flags.Zero = 1;
                    flags.Carry = 1;
                    flags.Sign = 1;
                    flags.OverFlow = 1;
                  }

                  // Check for SUBTRACTION operations
                  if (
                    upperMicroOp.includes("-") ||
                    upperMicroOp.includes("SUB") ||
                    upperMicroOp.includes("MINUS") ||
                    upperMicroOp.includes("DECREMENT") ||
                    upperMicroOp.includes("DIFFERENCE")
                  ) {
                    flags.Zero = 1;
                    flags.Carry = 1;
                    flags.Sign = 1;
                    flags.OverFlow = 1;
                  }

                  // Check for MULTIPLICATION operations
                  if (
                    upperMicroOp.includes("*") ||
                    upperMicroOp.includes("MUL") ||
                    upperMicroOp.includes("MULTIPLY") ||
                    upperMicroOp.includes("TIMES")
                  ) {
                    flags.Zero = 1;
                    flags.Carry = 1;
                    flags.Sign = 1;
                    flags.OverFlow = 1;
                  }

                  // Check for DIVISION operations
                  if (
                    upperMicroOp.includes("/") ||
                    upperMicroOp.includes("DIV") ||
                    upperMicroOp.includes("DIVIDE")
                  ) {
                    flags.Zero = 1;
                    flags.Carry = 0;
                    flags.Sign = 1;
                    flags.OverFlow = 1;
                  }

                  // Check for LOGICAL operations
                  if (
                    upperMicroOp.includes("AND") ||
                    upperMicroOp.includes("OR") ||
                    upperMicroOp.includes("XOR") ||
                    upperMicroOp.includes("NOT")
                  ) {
                    flags.Zero = 1;
                    flags.Sign = 1;
                    // Carry and Overflow remain 0 for logical operations
                  }

                  // Check for SHIFT operations
                  if (
                    upperMicroOp.includes("SHL") ||
                    upperMicroOp.includes("SHR") ||
                    upperMicroOp.includes("ROL") ||
                    upperMicroOp.includes("ROR") ||
                    upperMicroOp.includes("SHIFT")
                  ) {
                    flags.Carry = 1;
                    flags.Zero = 1;
                    flags.Sign = 1;
                  }

                  // Check for COMPARE operations
                  if (
                    upperMicroOp.includes("CMP") ||
                    upperMicroOp.includes("COMPARE") ||
                    upperMicroOp.includes("EQ") ||
                    upperMicroOp.includes("NE")
                  ) {
                    flags.Zero = 1;
                    flags.Carry = 1;
                    flags.Sign = 1;
                    flags.OverFlow = 1;
                  }

                  // Check for MOVE/LOAD operations
                  if (
                    (upperMicroOp.includes("MOV") ||
                      upperMicroOp.includes("LOAD") ||
                      upperMicroOp.includes("STORE") ||
                      upperMicroOp.includes(":=") ||
                      upperMicroOp.includes("=")) &&
                    !upperMicroOp.includes("+") &&
                    !upperMicroOp.includes("-")
                  ) {
                    flags.Zero = 1;
                    // Only zero flag affected
                  }

                  return flags;
                };

                const affectedFlags = getAffectedFlagsFromMicroOp(
                  instruction.action,
                );

                return (
                  <tr
                    key={idx}
                    className={`border-b border-blue-200 hover:bg-blue-50/50 transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/30"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-black border-r border-blue-200">
                      {instruction.mnemonic}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-black border-r border-blue-200">
                      {instruction.opcode}
                    </td>
                    <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                      {instruction.action || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                      {instruction.noOfOperands || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                      {instruction.destinationOperand !== null
                        ? instruction.destinationOperand
                        : "—"}
                    </td>
                    {/* <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                {instruction.interruptSymbol && instruction.interruptSymbol !== "NULL" 
                  ? instruction.interruptSymbol 
                  : "—"}
              </td>
              <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                {instruction.outputRegister || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                {instruction.inputRegister || "—"}
              </td> */}
                    <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                      {instruction.Operand1 || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                      {instruction.Operand2 || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-black border-r border-blue-200">
                      {instruction.Operand3 || "—"}
                    </td>
                    <td className="px-4 py-3 text-center border-r border-blue-200">
                      <div className="grid grid-cols-4 gap-2">
                        <div
                          className={`text-center font-mono font-bold ${affectedFlags.Zero === 1 ? "text-green-600" : "text-red-500"}`}
                        >
                          {affectedFlags.Zero}
                        </div>
                        <div
                          className={`text-center font-mono font-bold ${affectedFlags.Carry === 1 ? "text-green-600" : "text-red-500"}`}
                        >
                          {affectedFlags.Carry}
                        </div>
                        <div
                          className={`text-center font-mono font-bold ${affectedFlags.Sign === 1 ? "text-green-600" : "text-red-500"}`}
                        >
                          {affectedFlags.Sign}
                        </div>
                        <div
                          className={`text-center font-mono font-bold ${affectedFlags.OverFlow === 1 ? "text-green-600" : "text-red-500"}`}
                        >
                          {affectedFlags.OverFlow}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {/* ================= ADDRESSING ================= */}
      <Card
        title="Addressing Modes"
        icon={<CodeBracketIcon className="w-6 h-6" />}
      >
        <Table
          headers={["Name", "Code", "Symbol"]}
          data={architecture.addressingModes}
          renderRow={(item, i) => (
            <tr key={i}>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.AddressingModeName}
              </td>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.AddressingModeCode}
              </td>
              <td className="px-4 py-3 border border-blue-100 text-black text-left">
                {item.AddressingModeSymbol}
              </td>
            </tr>
          )}
        />
      </Card>

      <BottomNavigation />
    </>
  );
}

export default Detail;

// ================= REUSABLE COMPONENTS =================

const Card = ({ title, icon, children }) => (
  <div className="m-4 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
    <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex flex-col gap-1 py-1">
    <span className="text-blue-900 text-sm">{label}</span>
    <span className="text-black">{value || "-"}</span>
  </div>
);

const Table = ({ title, headers, data, renderRow }) => (
  <div className="mt-5">
    {title && <p className="text-blue-900 mb-2">{title}</p>}

    <div className="overflow-hidden mb-10 rounded-lg border border-blue-100 w-full">
      <table className="w-full table-fixed border-collapse text-sm">
        {/* HEADER */}
        <thead className="bg-blue-100 text-black">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold border border-blue-100"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data?.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center text-gray-400 py-3"
              >
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ================= INSTRUCTION DETAIL CARD COMPONENT =================
const InstructionDetailCard = ({ instruction }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "string" && value.toUpperCase() === "NULL") return "—";
    if (value === "") return "—";
    return String(value);
  };

  // Function to analyze micro operation and determine affected flags
  const getAffectedFlagsFromMicroOp = (microOp) => {
    const flags = { Zero: 0, Carry: 0, Sign: 0, OverFlow: 0 };

    if (!microOp) return flags;

    const upperMicroOp = microOp.toUpperCase();

    // Check for ADDITION operations
    if (
      upperMicroOp.includes("+") ||
      upperMicroOp.includes("ADD") ||
      upperMicroOp.includes("PLUS") ||
      upperMicroOp.includes("SUM") ||
      upperMicroOp.includes("INCREMENT")
    ) {
      flags.Zero = 1;
      flags.Carry = 1;
      flags.Sign = 1;
      flags.OverFlow = 1;
    }

    // Check for SUBTRACTION operations
    if (
      upperMicroOp.includes("-") ||
      upperMicroOp.includes("SUB") ||
      upperMicroOp.includes("MINUS") ||
      upperMicroOp.includes("DECREMENT") ||
      upperMicroOp.includes("DIFFERENCE")
    ) {
      flags.Zero = 1;
      flags.Carry = 1;
      flags.Sign = 1;
      flags.OverFlow = 1;
    }

    // Check for MULTIPLICATION operations
    if (
      upperMicroOp.includes("*") ||
      upperMicroOp.includes("MUL") ||
      upperMicroOp.includes("MULTIPLY") ||
      upperMicroOp.includes("TIMES")
    ) {
      flags.Zero = 1;
      flags.Carry = 1;
      flags.Sign = 1;
      flags.OverFlow = 1;
    }

    // Check for DIVISION operations
    if (
      upperMicroOp.includes("/") ||
      upperMicroOp.includes("DIV") ||
      upperMicroOp.includes("DIVIDE")
    ) {
      flags.Zero = 1;
      flags.Carry = 0;
      flags.Sign = 1;
      flags.OverFlow = 1;
    }

    // Check for LOGICAL operations
    if (
      upperMicroOp.includes("AND") ||
      upperMicroOp.includes("OR") ||
      upperMicroOp.includes("XOR") ||
      upperMicroOp.includes("NOT")
    ) {
      flags.Zero = 1;
      flags.Sign = 1;
    }

    // Check for SHIFT operations
    if (
      upperMicroOp.includes("SHL") ||
      upperMicroOp.includes("SHR") ||
      upperMicroOp.includes("ROL") ||
      upperMicroOp.includes("ROR") ||
      upperMicroOp.includes("SHIFT")
    ) {
      flags.Carry = 1;
      flags.Zero = 1;
      flags.Sign = 1;
    }

    // Check for COMPARE operations
    if (
      upperMicroOp.includes("CMP") ||
      upperMicroOp.includes("COMPARE") ||
      upperMicroOp.includes("EQ") ||
      upperMicroOp.includes("NE")
    ) {
      flags.Zero = 1;
      flags.Carry = 1;
      flags.Sign = 1;
      flags.OverFlow = 1;
    }

    // Check for MOVE/LOAD operations
    if (
      (upperMicroOp.includes("MOV") ||
        upperMicroOp.includes("LOAD") ||
        upperMicroOp.includes("STORE") ||
        upperMicroOp.includes(":=") ||
        upperMicroOp.includes("=")) &&
      !upperMicroOp.includes("+") &&
      !upperMicroOp.includes("-")
    ) {
      flags.Zero = 1;
    }

    return flags;
  };

  const affectedFlags = getAffectedFlagsFromMicroOp(instruction.action);
  const flagsAffectedList = Object.entries(affectedFlags)
    .filter(([_, value]) => value === 1)
    .map(([flag]) => flag);

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-100 px-4 py-3 flex items-center justify-between border-b border-blue-200">
        <div className="flex items-center gap-2 text-blue-900 font-semibold">
          <CodeBracketIcon className="w-5 h-5" />
          <span>{instruction.mnemonic}</span>
        </div>

        <span className="text-xs font-mono text-black">
          Opcode: {instruction.opcode}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {/* Left Column */}
          <div className="space-y-2">
            <DetailItem
              label="Mnemonic"
              value={instruction.mnemonic}
              highlight
            />
            <DetailItem label="Micro Operation" value={instruction.action} />
            <DetailItem label="Opcode" value={instruction.opcode} />
            <DetailItem
              label="# of Operands"
              value={instruction.noOfOperands}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {instruction.destinationOperand !== null && (
              <DetailItem
                label="Destination Operand"
                value={instruction.destinationOperand}
              />
            )}
            <DetailItem
              label="Interrupt Symbol"
              value={formatValue(instruction.interruptSymbol)}
            />

            <DetailItem
              label="Interrupt Registers"
              value={`Out: ${formatValue(instruction.outputRegister)} / In: ${formatValue(instruction.inputRegister)}`}
            />

            <div className="flex flex-col gap-2 py-1">
              <span className="text-blue-900 text-sm font-semibold">
                Affected Flags
              </span>
              <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    Zero
                  </div>
                  <div
                    className={`text-lg font-mono font-bold ${affectedFlags.Zero === 1 ? "text-green-600" : "text-red-500"}`}
                  >
                    {affectedFlags.Zero}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    Carry
                  </div>
                  <div
                    className={`text-lg font-mono font-bold ${affectedFlags.Carry === 1 ? "text-green-600" : "text-red-500"}`}
                  >
                    {affectedFlags.Carry}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    Sign
                  </div>
                  <div
                    className={`text-lg font-mono font-bold ${affectedFlags.Sign === 1 ? "text-green-600" : "text-red-500"}`}
                  >
                    {affectedFlags.Sign}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    Overflow
                  </div>
                  <div
                    className={`text-lg font-mono font-bold ${affectedFlags.OverFlow === 1 ? "text-green-600" : "text-red-500"}`}
                  >
                    {affectedFlags.OverFlow}
                  </div>
                </div>
              </div>
              {flagsAffectedList.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Affected: {flagsAffectedList.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-blue-100 text-xs text-gray-500 flex justify-between">
          <span>📋 Full specification</span>

          {instruction.instructionId && (
            <span className="font-mono text-black">
              ID: {instruction.instructionId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight = false }) => (
  <div className="flex flex-col gap-1 py-1">
    <span className="text-blue-900 text-sm">{label}</span>

    <span
      className={`text-sm break-words ${
        highlight ? "font-semibold text-black" : "text-black"
      }`}
    >
      {value !== undefined && value !== null && value !== "" ? value : "—"}
    </span>
  </div>
);
