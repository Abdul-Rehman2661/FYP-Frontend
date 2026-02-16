import { useParams } from "react-router-dom";
import { architectures } from "../Data/architectures.js";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import {
  Squares2X2Icon,
  CpuChipIcon,
  ServerIcon,
  CodeBracketIcon,
  EyeIcon,
  CubeIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

function Detail() {
  const { id } = useParams();

  // find selected architecture
  const architecture = architectures.find((arch) => arch.id === Number(id));

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
      <div className="pt-20 text-center">
        <h2 className="text-xl text-blue-900 font-bold">Details</h2>

        <p className="pt-3 text-blue-900 text-sm">
          Technical specifications and reference manual.
        </p>
      </div>

      {/* Architecture Card */}
      <div className="m-4 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
          <CpuChipIcon className="w-6 h-6" />
          <span>System Specifications</span>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-20 text-sm">
          <Info
            icon={<CpuChipIcon className="w-4 h-4 text-blue-900 " />}
            label="Architecture Name"
            value={architecture.name}
          />
          <Info
            icon={<CircleStackIcon className="w-4 h-4 text-blue-900 " />}
            label="Memory Size"
            value={architecture.memorySize}
          />

          <Info
            icon={<ServerIcon className="w-4 h-4 text-blue-900 " />}
            label="Bus Size"
            value={architecture.busSize}
          />
          <Info
            icon={<CubeIcon className="w-4 h-4 text-blue-900 " />}
            label="Stack Size"
            value={architecture.stackSize}
          />
        </div>
      </div>

      {/* Register Card */}
      <div className="m-4 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
          <CircleStackIcon className="w-6 h-6" />
          <span>Registers File</span>
        </div>

        <div className="mt-5">
          <p className="text-blue-900">Flag Registers</p>
          <div className="overflow-hidden rounded-lg border border-blue-100 w-full">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="bg-blue-100 text-black font-semibold">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Name
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Size
                  </td>
                </tr>

                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Zero
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    1 bit
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-blue-900">General Purpose Registers</p>
          <div className="overflow-hidden rounded-lg border border-blue-100 w-full">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="bg-blue-100 text-black font-semibold">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Name
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Size
                  </td>
                </tr>

                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">R1</td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    16-bits
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">R2</td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    16-bits
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">R3</td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    16-bits
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">R4</td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    16-bits
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Instruction Card */}
      <div className="m-4 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
          <CodeBracketIcon className="w-6 h-6" />
          <span>Instruction Set</span>
        </div>

        <div className="mt-5">
          <div className="overflow-hidden rounded-lg border border-blue-100 w-full">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="bg-blue-100 text-black font-semibold">
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    Mnemonic
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    Opcode
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    Instruction Set
                  </td>
                </tr>

                <tr className=" p-4 text-black">
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    LOAD
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    10100001
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    LOAD - M[addr]
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    STORE
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    10110010
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    STORE - M[addr]
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    ADD
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    11000011
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    ADD - R1, R3
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    SUB
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    11010100
                  </td>
                  <td className="w-1/3 px-4 py-2 border border-blue-100">
                    SUB - R3, R4
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Card */}
      <div className="m-4 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
          <CodeBracketIcon className="w-6 h-6" />
          <span>Instruction Set</span>
        </div>

        <div className="mt-5">
          <div className="overflow-hidden rounded-lg border border-blue-100 w-full">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="bg-blue-100 text-black font-semibold">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Mnemonic
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Action
                  </td>
                </tr>

                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    LOAD
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    R[dr] - M[addr]
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    STORE
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    M[addr] - R[sr]
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    ADD
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    R[dr] - R[sr1] + R[sr2]
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    SUB
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    R[dr] - R[sr1] - R[sr2]
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Addressing Modes Card */}
      <div className="m-4 p-6 mb-20 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
          <CodeBracketIcon className="w-6 h-6" />
          <span>Addressing Modes</span>
        </div>

        <div className="mt-5">
          <div className="overflow-hidden rounded-lg border border-blue-100 w-full">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="bg-blue-100 text-black font-semibold">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Name
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Instruction
                  </td>
                </tr>

                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Direct
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    LOAD $10
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Indirect
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    LOAD &10
                  </td>
                </tr>
                <tr className=" p-4 text-black">
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    Indexed
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    LOAD *10
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

const Info = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1 py-1">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-blue-900 text-sm font-small">{label}</span>
    </div>

    {/* Value */}
    <span className="text-black font-small">{value}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-6">
    <h3 className=" text-blue-900 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const Chip = ({ text }) => (
  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-900">
    {text}
  </span>
);

export default Detail;
