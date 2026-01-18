import { useState } from "react";
import Header from "../components/Header.jsx"
import BottomNavigation from "../components/BottomNavigation.jsx"
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";

function Editor() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Header />
            <div className="p-4 pt-16 min-h-screen bg-gray-100 pb-16">
                <div className="space-y-4 p-4 bg-white rounded-xl">
                    <div className="flex justify-between bg-gray-100">
                        <button
                            type="button"
                            className="px-6 py-1 bg-blue-900 rounded text-sm text-white "
                        >
                             Run
                        </button>
                        <button
                            type="button"
                            className="px-6 py-1 bg-blue-900 rounded text-sm text-white "
                        >
                            Run Step
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="px-6 py-1 bg-transparent rounded text-sm text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-300"
                        >
                            Save
                        </button>
                               {showModal && (
                                <SaveFile onClose={() => setShowModal(false)} />
                              )}
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="px-6 py-1 bg-transparent rounded text-sm text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white "
                        >
                            Open
                        </button>
                          {showModal && (
                                <OpenFile onClose={() => setShowModal(false)} />
                              )}
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
