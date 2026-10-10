import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "../Auth.css";

function AdminLogin() {
  const navigate = useNavigate();

  const {
    refreshUser,
  } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/admin-login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to login"
        );

        return;
      }

      if (
        data.user.role !== "ADMIN"
      ) {
        setError(
          "Admin access required"
        );

        return;
      }

      await refreshUser();

      navigate("/admin");
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <section className="auth-left">
        <div className="auth-brand">
          AquaShine
        </div>

        <h1>
          Manage Your
          <span>
            {" "}Car Wash Business.
          </span>
        </h1>

        <p>
          Secure administration for
          services, bookings, customers,
          workers, slots and revenue.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-card">

          <h2>
            Admin Login
          </h2>

          <p className="auth-subtitle">
            Authorized administrators only.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            <div className="auth-group">
              <label>
                Admin Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="auth-group">
              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Admin Login"}
            </button>
          </form>

          <div className="auth-links">
            Customer?{" "}
            <Link to="/login">
              Customer Login
            </Link>
          </div>

          <Link
            to="/"
            className="auth-home-link"
          >
            ← Back to Home
          </Link>

        </div>
      </section>

    </div>
  );
}

export default AdminLogin;