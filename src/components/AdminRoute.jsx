import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "Admin";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}