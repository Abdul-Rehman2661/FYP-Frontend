import { useNavigate } from 'react-router-dom'
import Header from "../components/Header.jsx"
import BottomNavigation from "../components/BottomNavigation.jsx"
import {architectures} from "../Data/architectures.js"

function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex justify-center pt-14 pb-14">
        <div className="w-full max-w-sm bg-white p-4">
          <h2 className="text-xl text-blue-900 font-semibold text-center mb-4">
            Architecture Dashboard
          </h2>

          {architectures.length === 0 ? (
            <p className="text-center text-red-500 mt-10">
              No Architecture
            </p>
          ) : (
            <div className="space-y-4">
              {architectures.map((arch) => (
                <div
                  key={arch.id}
                  className="bg-white border rounded-xl shadow p-4"
                >
                  <h3 className="text-lg text-black font-semibold mb-2">
                    {arch.name}
                  </h3>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Memory:</span>{" "}
                    {arch.memorySize}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Bus:</span>{" "}
                    {arch.busSize}
                  </p>

                  <div className="flex justify-between mt-4">
                    <button className="px-7 py-1 text-sm rounded bg-blue-900 text-white">
                      Use
                    </button>

                    <button className="px-7 py-1 text-sm rounded border border-blue-900 text-blue-900 bg-transparent hover:bg-blue-900 hover:text-white transition-colors duration-300">
                      Update
                    </button>

                    <button
                      onClick={() => navigate(`/detail/${arch.id}`)}
                      className="px-7 py-1 text-sm rounded border border-blue-900
                        text-blue-900 hover:bg-blue-900 hover:text-white transition"
                    >
                      Detail
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

  )
}

export default Dashboard