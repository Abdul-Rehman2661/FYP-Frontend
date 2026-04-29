import { useState, useContext, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { ArchitectureContext } from "../context/ArchitectureContext";

function Editor() {
  const { setArchitectureData } = useContext(ArchitectureContext);
  const [architecture, setArchitecture] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [saveFile, setSaveFile] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const { setExecutionResult } = useContext(ArchitectureContext);

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

  const handleRun = async () => {
    try {
      setLoadingRun(true);
      setError(null);

      const codeArray = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const res = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/execution/execute/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(codeArray),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.Errors || "Execution failed");
        return;
      }

      setExecutionResult(data);
      navigate("/registervis");
    } catch (err) {
      console.error(err);
      setError("Execution failed");
    } finally {
      setLoadingRun(false);
    }
  };

  return (
    <>
      <Header />

      <div className="pt-20 lg:pt-24">
        <h2 className="text-blue-900 font-bold text-center mb-1 text-2xl">
          Program Editor
        </h2>

        <div className="min-h-screen bg-gray-100">
          <div className="w-full rounded-xl p-5 space-y-4 lg:max-w-full lg:shadow">
            <div className="flex items-center justify-center gap-2 bg-gray-100">
              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
                onClick={handleRun}
              >
                {loadingRun ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                Run
              </button>

              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
                onClick={() => navigate(`/debugging/${id}`)}
              >
                <ArrowPathIcon className="h-4 w-4" />
                Compile
              </button>

              <button
                type="button"
                onClick={() => setSaveFile(true)}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 bg-blue-900 text-white text-xs rounded hover:bg-blue-900 hover:text-white transition"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Save
              </button>

              {saveFile && <SaveFile onClose={() => setSaveFile(false)} />}

              <button
                type="button"
                onClick={() => setOpenFile(true)}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 border border-blue-900 bg-blue-900 text-white text-xs rounded hover:bg-blue-900 hover:text-white transition"
              >
                <FolderOpenIcon className="h-4 w-4" />
                Open
              </button>

              {openFile && <OpenFile onClose={() => setOpenFile(false)} />}
            </div>

            <div className="flex justify-center bg-gray-100">
              <button
                className="flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white text-xs rounded"
                onClick={() => navigate(`/compare/${id}`)}
              >
                <ArrowPathIcon className="h-4 w-4" />
                Compare
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 border rounded-lg bg-white p-3 text-sm font-mono text-gray-500">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="p-5 lg:m-5 rounded-xl bg-gray-100 w-full h-64"
                placeholder="Write Assembly code here..."
              />

              <div className="bg-blue-50 rounded-lg p-3 h-60 mt-5 lg:w-* w-full">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Error Display
                </p>
                <div className="bg-white border rounded-md p-2 h-40 text-sm text-red-500">
                  {error
                    ? Array.isArray(error)
                      ? error.map((e, i) => <p key={i}>{e}</p>)
                      : error
                    : "No Errors"}
                </div>
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
