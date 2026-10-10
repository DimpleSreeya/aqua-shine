import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "../Auth.css";

function Login() {
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
        `${import.meta.env.VITE_API_URL}/auth/login`,
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

      if (data.user.role !== "USER") {
        setError(
          "Please use the Admin Login page"
        );

        return;
      }

      await refreshUser();

      navigate("/user");
    } catch (error) {
      console.error(
        "Login error:",
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
          Welcome Back to
          <span>
            {" "}Premium Car Care.
          </span>
        </h1>

        <p>
          Login to manage your vehicles,
          book car wash services and track
          your bookings.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-card">

          <h2>
            Customer Login
          </h2>

          <p className="auth-subtitle">
            Sign in to your AquaShine account.
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
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
                : "Login"}
            </button>
          </form>

          <div className="auth-links">
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>

            <br />
            <br />

            Admin?{" "}
            <Link to="/admin-login">
              Admin Login
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

export default Login;