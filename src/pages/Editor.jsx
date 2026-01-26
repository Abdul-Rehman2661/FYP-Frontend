import { useState } from "react";
import Header from "../components/Header.jsx"
import BottomNavigation from "../components/BottomNavigation.jsx"
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";
import {
    PlayIcon,
    ArrowPathIcon,
    FolderOpenIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline";


function Editor() {
    const [displayModel, setDisplayModel] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Header />
            <div className="p-4 pt-16 min-h-screen bg-gray-100 pb-16">
                <div className="space-y-4 p-4 bg-white rounded-xl">
                    <div className="flex items-center gap-2 bg-white p-2">

                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded">
                            <PlayIcon className="h-4 w-4" />
                            Run
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded">
                            <ArrowPathIcon className="h-4 w-4" />
                            Compile
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-900 text-blue-900 text-xs rounded hover:bg-blue-900 hover:text-white transition"
                            type="button" onClick={() => setDisplayModel(true)}
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Save
                        </button>
                        {displayModel && (<SaveFile onClose={() => setDisplayModel(false)} />)}

                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-900 text-blue-900 text-xs rounded hover:bg-blue-900 hover:text-white transition"
                            type="button" onClick={() => setShowModal(true)}>
                            <FolderOpenIcon className="h-4 w-4" />
                            Open
                        </button>
                        {showModal && (<OpenFile onClose={() => setShowModal(false)} />)}
                    </div>

                    {/* Code Editor Box */}
                    <div className="border rounded-lg bg-white p-3 h-80 overflow-auto text-sm font-mono text-gray-500">
                        <p>LOAD R1, [0x13]</p>
                        <p>LOAD R2, [0x0D]</p>
                        <p>ADD R1, R2</p>
                        <p>SUB R3, R1</p>
                        <p>STORE [0x00], R1</p>
                        <p>STORE [0x01], R3</p>
                    </div>

                    {/* Error Display */}
                    <div className="bg-blue-50 rounded-lg p-3 h-60">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            Error Display
                        </p>
                        <div className="bg-white border rounded-md p-2 h-40 text-sm text-gray-500">
                            No Errors
                        </div>
                    </div>


                </div>
            </div>
            <BottomNavigation />
        </>
    );
}

export default Editor;
