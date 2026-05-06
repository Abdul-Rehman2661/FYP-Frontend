import { useState } from "react";

export default function SaveFile({ onClose, architectureId, code }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert("Enter file name");
      return;
    }

    if (!code || !code.trim()) {
      alert("No code to save");
      return;
    }

    try {
      setLoading(true);

      // FIXED: Use correct controller (architecture instead of execution)
      const res = await fetch(
        `http://localhost/ComputerArchitectureToolkitAPI/api/architecture/${architectureId}/codefile/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            FileName: fileName,
            Code: code,  // REMOVED ArchitectureID - controller adds it from URL
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Save failed");
        return;
      }

      alert("File saved successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Save failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 relative">
        <h3 className="text-lg text-black mb-4">Save File</h3>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <label className="text-sm font-medium text-black">
          File Name
        </label>

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name (e.g., main.asm)"
          className="mt-1 bg-white text-black w-full border border-blue-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}