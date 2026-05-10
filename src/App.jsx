import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard.jsx";
import Detail from "./pages/Detail.jsx";
import CpuDesign from "./pages/CpuDesign.jsx";
import Instruction from "./pages/Instruction.jsx";
import Editor from "./pages/Editor.jsx";
import Register from "./pages/Register.jsx";
import Compare from "./pages/Compare.jsx";
import RegisterVisualization from "./pages/RegisterVisualization.jsx";
import Memory from "./pages/Memory.jsx";
import BackButton from "./components/BackButton.jsx";
import Debugging from "./pages/Debugging.jsx";
import Update from "./pages/Update.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div
        className="w-full min-h-screen bg-gray-100
        shadow-2xl border"
      >
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
           <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/cpudesign" element={<CpuDesign />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instruction" element={<Instruction />} />
          <Route path="/compare/:id" element={<Compare />} />
          <Route path="/regviz/:id" element={<RegisterVisualization />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/Back" element={<BackButton />} />
          <Route path="/debugging/:id" element={<Debugging />} />
          <Route path="/update/:id" element={<Update />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
