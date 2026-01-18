import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Detail from "./pages/detail.jsx";
import CpuDesign from "./pages/CpuDesign.jsx";
import InstructionDesign from "./pages/InstructionDesign.jsx";
import Editor from "./pages/Editor.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-400 flex justify-center">
      <div
        className="w-full max-w-[420px] min-h-screen bg-white
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
