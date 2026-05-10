import { useState, useEffect } from 'react';
import { XMarkIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

function CountCycleModal({ isOpen, onClose, code, architectureId, architectureData }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showDetailed, setShowDetailed] = useState(false);

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

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <DocumentMagnifyingGlassIcon className="h-6 w-6 text-blue-900" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Cycle Count Analysis
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
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
                <p className="text-gray-600">Calculating cycles...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 font-semibold">Error:</p>
                <pre className="text-sm text-red-500 mt-2 whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Cycles</p>
                    <p className="text-2xl font-bold text-blue-900">{result.totalCycles}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Instructions</p>
                    <p className="text-2xl font-bold text-green-900">{result.instructionCount}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Fetch Cycles</p>
                    <p className="text-2xl font-bold text-yellow-900">{result.breakdown.fetch}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Execute Cycles</p>
                    <p className="text-2xl font-bold text-purple-900">{result.breakdown.execute}</p>
                  </div>
                </div>

                {/* Mode info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Mode: {result.mode}</p>
                  <p className="text-xs text-gray-500">Decode Cycles: {result.breakdown.decode}</p>
                </div>

                {/* Toggle Detailed View */}
                <button
                  onClick={() => setShowDetailed(!showDetailed)}
                  className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                >
                  {showDetailed ? 'Hide' : 'Show'} Detailed Breakdown
                </button>

                {/* Detailed Steps */}
                {showDetailed && (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                      Instruction-wise Breakdown
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Line</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instruction</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Fetch</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Decode</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Execute</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.steps.map((step, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-500">{step.lineNumber}</td>
                              <td className="px-4 py-2 text-sm font-mono text-gray-900">{step.instructionText}</td>
                              <td className="px-4 py-2 text-sm text-center text-gray-600">{step.fetchCycles}</td>
                              <td className="px-4 py-2 text-sm text-center text-gray-600">{step.decodeCycles}</td>
                              <td className="px-4 py-2 text-sm text-center text-gray-600">{step.executeCycles}</td>
                              <td className="px-4 py-2 text-sm text-center font-semibold text-blue-900">{step.totalCycles}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="2" className="px-4 py-2 text-sm font-semibold text-gray-900">Total</td>
                            <td className="px-4 py-2 text-sm text-center font-semibold text-gray-900">{result.breakdown.fetch}</td>
                            <td className="px-4 py-2 text-sm text-center font-semibold text-gray-900">{result.breakdown.decode}</td>
                            <td className="px-4 py-2 text-sm text-center font-semibold text-gray-900">{result.breakdown.execute}</td>
                            <td className="px-4 py-2 text-sm text-center font-semibold text-blue-900">{result.totalCycles}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action Steps for first instruction (example) */}
                {result.steps.length > 0 && showDetailed && (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                      Micro-operations Example (Line {result.steps[0].lineNumber}: {result.steps[0].mnemonic})
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="font-mono text-sm">
                        <p className="font-semibold text-blue-900">Fetch Cycles:</p>
                        {result.steps[0].timing.fetch.map((step, i) => (
                          <p key={i} className="ml-4 text-gray-600">{step}</p>
                        ))}
                      </div>
                      <div className="font-mono text-sm">
                        <p className="font-semibold text-blue-900">Decode Cycle:</p>
                        {result.steps[0].timing.decode.map((step, i) => (
                          <p key={i} className="ml-4 text-gray-600">{step}</p>
                        ))}
                      </div>
                      <div className="font-mono text-sm">
                        <p className="font-semibold text-blue-900">Execute Cycles:</p>
                        {result.steps[0].timing.execute.length > 0 ? (
                          result.steps[0].timing.execute.map((step, i) => (
                            <p key={i} className="ml-4 text-gray-600">{step}</p>
                          ))
                        ) : (
                          <p className="ml-4 text-gray-500">No micro-operations defined</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            {result && (
              <button
                type="button"
                onClick={() => {
                  const dataStr = JSON.stringify(result, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = `cycle-count-${Date.now()}.json`;
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Export Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountCycleModal;