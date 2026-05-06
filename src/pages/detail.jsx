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

  const { setArchitectureData } = useContext(ArchitectureContext);
  const [architecture, setArchitecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/get-full/${id}`,
        );

        const data = res.data;

        setArchitectureData({
          memorySize: data?.Architecture?.MemorySize || 0,
          stackSize: data?.Architecture?.StackSize || 0,
          busSize: data?.Architecture?.BusSize || 0,
          name: data?.Architecture?.Name || "",
        });
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
        {/* <Table
          title="Flag Registers"
          headers={["Name", "Size"]}
          data={architecture.flagRegister}
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
        /> */}

        {/* General Registers */}
        <Table
          title="General Purpose Registers"
          headers={["Name", "Size"]}
          data={architecture.registers}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {architecture.instructions.map((instruction, idx) => (
            <InstructionDetailCard key={idx} instruction={instruction} />
          ))}
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

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      
      {/* Header (NOW SAME STYLE AS TABLE HEADER) */}
      <div className="bg-blue-100 px-4 py-3 flex items-center justify-between">
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
          
          {/* Left */}
          <div className="space-y-2">
            <DetailItem label="Mnemonic" value={instruction.mnemonic} highlight />
            <DetailItem label="Micro Operation" value={instruction.action} />
            <DetailItem label="Opcode" value={instruction.opcode} />
            <DetailItem label="# of Operands" value={instruction.noOfOperands} />

            {instruction.destinationOperand !== null && (
              <DetailItem
                label="Destination Operand"
                value={instruction.destinationOperand}
              />
            )}
          </div>

          {/* Right */}
          <div className="space-y-2">
            <DetailItem
              label="Interrupt Symbol"
              value={formatValue(instruction.interruptSymbol)}
            />

            <DetailItem
              label="Interrupt Registers"
              value={`Out: ${formatValue(instruction.outputRegister)} / In: ${formatValue(instruction.inputRegister)}`}
            />
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
    <span className="text-blue-900 text-sm">
      {label}
    </span>

    <span
      className={`text-sm break-words ${
        highlight ? "font-semibold text-black" : "text-black"
      }`}
    >
      {value !== undefined && value !== null && value !== ""
        ? value
        : "—"}
    </span>
  </div>
);
