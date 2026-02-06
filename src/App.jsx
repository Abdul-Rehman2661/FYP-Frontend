import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Detail from "./pages/detail.jsx";
import CpuDesign from "./pages/CpuDesign.jsx";
import InstructionDesign from "./pages/InstructionDesign.jsx";
import Editor from "./pages/Editor.jsx";

function App() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div
        className="w-full min-h-screen bg-gray-100
        shadow-2xl border"
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/cpudesign" element={<CpuDesign />} />
          <Route path="/InstructionDesign" element={<InstructionDesign />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
