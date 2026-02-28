import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import BottomNavigation from "../components/BottomNavigation.jsx";
import { architectures } from "../Data/architectures.js";
import { CpuChipIcon } from "@heroicons/react/24/outline";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex justify-center pt-14 pb-20">
        <div className="w-full max-w-sm lg:max-w-7xl px-4 lg:px-10">
          <h2 className="text-xl text-blue-900 font-bold text-center mb-1 lg:text-2xl lg:mt-14">
            My Architectures
          </h2>

          <p className="text-center text-gray-600 mb-6 text-sm lg:text-base">
            Manage and explore your computer architecture designs
          </p>

        {/* map */}
          {architectures.length === 0 ? (
            <p className="text-center text-red-500 mt-10">No Architecture</p>
          ) : (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
              {architectures.map((arch) => (
                <div
                  key={arch.id}
                  className="
                    bg-white border rounded-xl shadow p-4
                    lg:p-6 lg:rounded-2xl lg:shadow-sm
                  "
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-900">
                      <CpuChipIcon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-semibold text-blue-900">
                      {arch.name}
                    </h3>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Memory:</span>{" "}
                      {arch.memorySize}
                    </p>
                    <p>
                      <span className="font-medium">Bus:</span> {arch.busSize}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                    onClick={() => navigate('/editor')}
                      className="
                      flex-1 py-1.5 text-sm rounded
                      bg-blue-900 text-white hover:text-gray-400
                    "
                    >
                      Use
                    </button>

                    <button
                      onClick={() => navigate(`/update/${arch.id}`)}
                      className="
                      flex-1 py-1.5 text-sm rounded
                      bg-blue-900 text-white hover:text-gray-400
                      "
                    >
                      Update
                    </button>

                    <button
                      onClick={() => navigate(`/detail/${arch.id}`)}
                      className="
                      flex-1 py-1.5 text-sm rounded
                      bg-blue-900 text-white hover:text-gray-400
                      "
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

export default Dashboard;
