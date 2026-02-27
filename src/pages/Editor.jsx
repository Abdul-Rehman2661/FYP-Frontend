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

function Editor() {
  const navigate = useNavigate();
  const [displayModel, setDisplayModel] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />

      <h2 className="text-blue-900 font-bold text-center mb-1 text-2xl lg:mt-20 mt-14">
        Program Editor
      </h2>

      <div className="min-h-screen bg-gray-100">
        <div className="w-full rounded-xl p-5 space-y-4 lg:max-w-full lg:shadow">
          <div className="flex items-center justify-center gap-2 bg-gray-100">
            <button
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
              onClick={() => navigate("/registervis")}
            >
              <PlayIcon className="h-4 w-4" />
              Run
            </button>

            <button
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
              onClick={() => navigate("/debugging")}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Compile
            </button>

            <button
              type="button"
              onClick={() => setDisplayModel(true)}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-blue-900 text-xs rounded hover:bg-blue-900 hover:text-white transition"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Save
            </button>

            {displayModel && (
              <SaveFile onClose={() => setDisplayModel(false)} />
            )}

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 text-blue-900 text-xs rounded hover:bg-blue-900 hover:text-white transition"
            >
              <FolderOpenIcon className="h-4 w-4" />
              Open
            </button>

            {showModal && <OpenFile onClose={() => setShowModal(false)} />}
          </div>

          <div className="flex justify-center bg-gray-100">
            <button
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
              onClick={() => navigate("/compare")}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Compare
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 border rounded-lg bg-white p-3 text-sm font-mono text-gray-500">
            <textarea
              className="p-5 lg:m-5 rounded-xl bg-gray-100 lg:w-* w-full h-64 focus:ring-gray-300"
              placeholder={`Write Assembly code here to Compile and Execute`}
            />

            <div className="bg-blue-50 rounded-lg p-3 h-60 mt-5 lg:w-* w-full">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Error Display
              </p>
              <div className="bg-white border rounded-md p-2 h-40 text-sm text-gray-500">
                No Errors
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default Editor;
