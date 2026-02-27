import { useState } from "react";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import SaveFile from "../components/SaveFile.jsx";
import OpenFile from "../components/OpenFile.jsx";
import {
  PlayIcon,
  ArrowPathIcon,
  FolderOpenIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function Compare() {
  const [displayModel, setDisplayModel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Header />
      <h2 className="text-blue-900 font-bold text-center mb-1 text-2xl lg:mt-20 mt-14">
        Compare Editor
      </h2>

      <div className="min-h-screen bg-gray-100">
        <div className="w-full rounded-xl p-5 space-y-4 lg:max-w-full lg:shadow">
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-2">
            {/* Row 1 */}
            <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-blue-900 text-xs rounded hover:bg-blue-900 hover:text-white transition"
                          type="button"
              onClick={() => setDisplayModel(true)}
            >
              <FolderOpenIcon className="h-4 w-4" />
              Open
            </button>

            <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-blue-900 text-xs rounded hover:bg-blue-900 hover:text-white transition"
                          type="button"
              onClick={() => setDisplayModel(true)}
            >
              <FolderOpenIcon className="h-4 w-4" />
              Open
            </button>

            {/* Row 2 */}
            <button
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
            >
              <PlayIcon className="h-4 w-4" />
              Run
            </button>

            <button
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
            >
              <PlayIcon className="h-4 w-4" />
              Run
            </button>

            {displayModel && (
              <SaveFile onClose={() => setDisplayModel(false)} />
            )}
            {showModal && <OpenFile onClose={() => setShowModal(false)} />}
          </div>

          <div className="flex flex-col lg:flex-row gap-2  border rounded-lg bg-gray-100 p-3 text-sm font-mono text-gray-500">
            <textarea
              className="p-5 lg:m-5 rounded-xl bg-gray-100 lg:w-* w-full h-64 bg-white text-black focus:ring-gray-300"
              placeholder={`Write a Program`}
            />

            <textarea
              className="p-5 lg:m-5 rounded-xl bg-gray-100 lg:w-* w-full h-64 bg-white text-black focus:ring-gray-300"
              placeholder={`Write a Program`}
            />
          </div>

          <div className=" p-4 flex flex-col lg:flex-row gap-2 lg:gap-5">
            <div className="bg-blue-100 rounded-lg p-3 h-30  lg:w-* w-full">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Error Display
              </p>
              <div className="bg-white border rounded-md p-2 h-20 text-sm text-gray-500">
                No Errors
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-3 h-30  lg:w-* w-full">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Error Display
              </p>
              <div className="bg-white border rounded-md p-2 h-20 text-sm text-gray-500">
                No Errors
              </div>
            </div>
          </div>

          <div className=" p-4 flex flex-col lg:flex-row gap-2 lg:gap-5 ">
            <div className="bg-blue-50 mb-8  rounded-lg p-3  lg:w-* w-full">
              <div className="bg-white border flex justify-between rounded-md p-2 text-sm text-blue-900 font-semibold">
                <p>Clock Cycle:</p>
                <p></p>
              </div>
            </div>
            <div className="bg-blue-50 mb-8 rounded-lg p-3 lg:w-* w-full">
              <div className="bg-white border flex justify-between rounded-md p-2 text-sm text-blue-900 font-semibold">
                <p>Clock Cycle:</p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

export default Compare;
