import { useEffect, useState } from "react";

export default function OpenFile({ onClose, architectureId, onSelect }) {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      // FIXED: Use correct controller (architecture instead of execution)
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/architecture/${architectureId}/codefile/all`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    if (!selectedFileId) {
      alert("Please select a file");
      return;
    }

    try {
      // FIXED: Use correct controller
      const res = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/codefile/${selectedFileId}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to open file");
        return;
      }

      onSelect(data.Code); // send code back to editor
      onClose();
    } catch (err) {
      console.error(err);
      alert("Open failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 relative">
        <h3 className="text-lg text-black mb-4">Open File</h3>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {loading ? (
          <p className="text-sm text-gray-600">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-gray-600">No saved files found</p>
        ) : (
          <>
            <label className="text-sm font-medium text-black">
              Select File
            </label>

            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="mt-1 bg-white text-black w-full border border-blue-700 rounded-lg px-3 py-2 shadow-md focus:outline-none"
            >
              <option value="">-- Choose File --</option>
              {files.map((file) => (
                <option key={file.FileID} value={file.FileID}>
                  {file.FileName} (Saved: {new Date(file.SavedOn).toLocaleString()})
                </option>
              ))}
            </select>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleOpen}
                disabled={!selectedFileId}
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Open
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}