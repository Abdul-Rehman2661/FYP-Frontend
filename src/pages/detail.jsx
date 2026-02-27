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
                    {architecture.flagRegister}
                  </td>
                  <td className="w-1/2 px-4 py-2 border border-blue-100">
                    {architecture.flagRegisterSize}
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

                {architecture.registers.map((reg, index) => (
                  <tr key={index} className="p-4 text-black">
                    <td className="w-1/2 px-4 py-2 border border-blue-100">
                      {reg.name}
                    </td>
                    <td className="w-1/2 px-4 py-2 border border-blue-100">
                      {reg.Size}
                    </td>
                  </tr>
                ))}
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

                {architecture?.instructions?.map((ins, index) => (
                  <tr key={index} className="p-4 text-black ">
                    <td className="w-1/3 px-4 py-2 border border-blue-100">
                      {ins.mnemonic}
                    </td>
                    <td className="w-1/3 px-4 py-2 border border-blue-100">
                      {ins.opcode}
                    </td>
                    <td className="w-1/3 px-4 py-2 border border-blue-100">
                      {ins.instructionSet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Card */}
      <div className="m-4 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold">
          <CodeBracketIcon className="w-6 h-6" />
          <span>Action</span>
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

                {architecture.action.map((act, index) => (
                  <tr key={index} className=" p-4 text-black">
                    <td className="w-1/2 px-4 py-2 border border-blue-100">
                      {act.nmenonic}
                    </td>
                    <td className="w-1/2 px-4 py-2 border border-blue-100">
                      {act.action}
                    </td>
                  </tr>
                ))}
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

                {architecture.addressingModes.map((mode, index) => (
                  <tr key={index} className=" p-4 text-black">
                    <td className="w-1/2 px-4 py-2 border border-blue-100">
                      {mode.name}
                    </td>
                    <td className="w-1/2 px-4 py-2 border border-blue-100">
                      {mode.instruction}
                    </td>
                  </tr>
                ))}

                {/* <tr className=" p-4 text-black">
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
                </tr> */}
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

export default Detail;
