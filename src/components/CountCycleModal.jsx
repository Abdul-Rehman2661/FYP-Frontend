import { useState, useEffect } from 'react';
import { XMarkIcon, DocumentMagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function CountCycleModal({ isOpen, onClose, code, architectureId, architectureData }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showDetailed, setShowDetailed] = useState(false); // Keep state for future use

  useEffect(() => {
    if (isOpen && code && architectureId) {
      calculateCycles();
    }
  }, [isOpen, code, architectureId]);

  const calculateCycles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch instructions for this architecture
      const response = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/get-full/${architectureId}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch architecture instructions');
      }
      
      // Import calculateCountCycle dynamically
      const { calculateCountCycle } = await import('../utils/countCycle');
      
      // Prepare architecture object with instructions
      const selectedArchitecture = {
        ...architectureData,
        ArchitectureID: architectureId,
        Instructions: data?.Instructions || data?.instructions || []
      };
      
      // Calculate cycles
      const cycleResult = calculateCountCycle(code, selectedArchitecture);
      setResult(cycleResult);
    } catch (err) {
      console.error('Cycle calculation error:', err);
      setError(err.message || 'Failed to calculate cycles');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <DocumentMagnifyingGlassIcon className="h-6 w-6 text-blue-900" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Count Cycle Result
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mb-3"></div>
                <p className="text-gray-600 text-sm">Calculating cycles...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 font-semibold text-sm">Error:</p>
                <pre className="text-xs text-red-500 mt-2 whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Simple Result Message */}
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-base mb-1">Program Executed in</p>
                  <p className="text-4xl font-bold text-blue-900 mb-2">{result.totalCycles}</p>
                  <p className="text-gray-500 text-sm">cycle{result.totalCycles !== 1 ? 's' : ''}</p>
                </div>

                {/* Optional: Show instruction count */}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">
                    Total Instructions: <span className="font-semibold text-gray-700">{result.instructionCount}</span>
                  </p>
                </div>

                {/* ============================================================ */}
                {/* DETAILED VIEW - COMMENTED OUT BUT KEPT FOR FUTURE USE */}
                {/* ============================================================ */}
                {/*
                <button
                  onClick={() => setShowDetailed(!showDetailed)}
                  className="w-full flex items-center justify-center gap-2 text-blue-900 hover:text-blue-700 text-sm font-medium py-2 border-t border-gray-100 mt-2"
                >
                  {showDetailed ? (
                    <>
                      <ChevronUpIcon className="h-4 w-4" />
                      Hide Detailed Breakdown
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="h-4 w-4" />
                      Show Detailed Breakdown
                    </>
                  )}
                </button>

                {showDetailed && (
                  <div className="mt-2 space-y-4 border-t pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600">Fetch Cycles</p>
                        <p className="text-xl font-bold text-blue-900">{result.breakdown.fetch}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600">Execute Cycles</p>
                        <p className="text-xl font-bold text-purple-900">{result.breakdown.execute}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Mode: {result.mode}</p>
                      <p className="text-xs text-gray-500">Decode Cycles: {result.breakdown.decode}</p>
                    </div>

                    <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                      <div className="bg-gray-100 px-3 py-2 font-semibold text-xs text-gray-700">
                        Instruction-wise Breakdown
                      </div>
                      <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left">Line</th>
                            <th className="px-2 py-1 text-left">Instruction</th>
                            <th className="px-2 py-1 text-center">F</th>
                            <th className="px-2 py-1 text-center">D</th>
                            <th className="px-2 py-1 text-center">E</th>
                            <th className="px-2 py-1 text-center">T</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.steps.map((step, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-2 py-1 text-gray-500">{step.lineNumber}</td>
                              <td className="px-2 py-1 font-mono text-gray-900 truncate max-w-[120px]">{step.instructionText}</td>
                              <td className="px-2 py-1 text-center text-gray-600">{step.fetchCycles}</td>
                              <td className="px-2 py-1 text-center text-gray-600">{step.decodeCycles}</td>
                              <td className="px-2 py-1 text-center text-gray-600">{step.executeCycles}</td>
                              <td className="px-2 py-1 text-center font-semibold text-blue-900">{step.totalCycles}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="2" className="px-2 py-1 text-xs font-semibold">Total</td>
                            <td className="px-2 py-1 text-center font-semibold">{result.breakdown.fetch}</td>
                            <td className="px-2 py-1 text-center font-semibold">{result.breakdown.decode}</td>
                            <td className="px-2 py-1 text-center font-semibold">{result.breakdown.execute}</td>
                            <td className="px-2 py-1 text-center font-semibold text-blue-900">{result.totalCycles}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
                */}
                {/* ============================================================ */}
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountCycleModal;