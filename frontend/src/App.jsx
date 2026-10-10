import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* HOME PAGE */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* USER LOGIN */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* USER REGISTER */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ADMIN LOGIN */}

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      {/* USER DASHBOARD */}

      <Route
        path="/user"
        element={
          <ProtectedRoute
            allowedRoles={["USER"]}
          >
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* WRONG URL */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;