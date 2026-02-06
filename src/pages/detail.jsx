import { useParams } from "react-router-dom";
import { architectures } from "../Data/architectures.js"
import Header from "../components/Header.jsx"
import BottomNavigation from "../components/BottomNavigation.jsx"
import {
    Squares2X2Icon,
    CpuChipIcon,
    CodeBracketIcon,
    EyeIcon,
    CircleStackIcon,
} from "@heroicons/react/24/outline";

function Detail() {
    const { id } = useParams();

    // find selected architecture
    const architecture = architectures.find(
        (arch) => arch.id === Number(id)
    );

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
            <div className="p-4 pt-16 min-h-screen bg-gray-100 pb-16">
                <div className="space-y-4 p-4 bg-white rounded-xl">
                    <h2 className="text-xl text-blue-900 text-center font-bold">
                        Details
                    </h2>

                    <p className="text-center text-blue-900 text-sm">Technical specifications and reference manual.</p>

                    {/* BASIC INFO */}
                    <div className="space-y-2 text-sm">
                        <Info label="Architecture Name" value={architecture.name} />
                        <Info label="Memory Size" value={architecture.memorySize} />
                        <Info label="Bus Size" value={architecture.busSize} />
                        <Info label="Total Registers" value={architecture.totalRegisters} />
                        <Info label="Total Instructions" value={architecture.totalInstructions} />
                        <Info label="Created At" value={architecture.createdAt} />
                        <Info label="Updated At" value={architecture.updatedAt} />
                    </div>

                    {/* REGISTERS */}
                    <Section
                        title="Registers"
                        className="text-blue-900 border-b border-gray-200 pb-3"
                    >
                        {architecture.registers.map((reg) => (
                            <Chip key={reg} text={reg} />
                        ))}
                    </Section>


                    {/* INSTRUCTIONS */}
                    <Section className="text-blue-900 border-gray-200" title="Instructions">
                        {architecture.instructions.map((inst) => (
                            <Chip key={inst} text={inst} />
                        ))}
                    </Section>
                </div>
            </div>
            <BottomNavigation />
        </>
    );
}

const Info = ({ label, value }) => (
    <div className=" py-1">
        <span className="text-blue-900">
            {label}
        </span>
        <br />
        <span className="text-black">
            {value}
        </span>
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
