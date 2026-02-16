import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Detail from "./pages/Detail.jsx";
import CpuDesign from "./pages/CpuDesign.jsx";
import Instruction from "./pages/Instruction.jsx";
import Editor from "./pages/Editor.jsx";
import Register from "./pages/Register.jsx";
import Compare from "./pages/Compare.jsx";
import RegisterVisualization from "./pages/RegisterVisualization.jsx";
import Memory from "./pages/Memory.jsx";

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
          <Route path="/editor" element={<Editor />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instruction" element={<Instruction />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/registervis" element={<RegisterVisualization />} />
          <Route path="/memory" element={<Memory />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
