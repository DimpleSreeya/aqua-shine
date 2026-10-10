import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | INPUT CHANGE
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | REGISTER USER
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
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
            "Unable to create account"
        );

        return;
      }

      setMessage(
        "Account created successfully. Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
      });

      /*
       * Give the user a moment
       * to see the success message.
       */

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(
        "Registration error:",
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

      {/* LEFT SIDE */}

      <section className="auth-left">
        <div className="auth-brand">
          AquaShine
        </div>

        <h1>
          Your Car Deserves
          <span>
            {" "}Premium Care.
          </span>
        </h1>

        <p>
          Create your AquaShine account,
          add your vehicles, explore car
          wash services, choose convenient
          slots and manage your bookings
          from one place.
        </p>
      </section>

      {/* RIGHT SIDE */}

      <section className="auth-right">
        <div className="auth-card">

          <h2>
            Create Account
          </h2>

          <p className="auth-subtitle">
            Join AquaShine and book your
            next car wash easily.
          </p>

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="auth-group">
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* EMAIL */}

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

            {/* PHONE */}

            <div className="auth-group">
              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />
            </div>

            {/* LOCATION */}

            <div className="auth-group">
              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your city or area"
                required
              />
            </div>

            {/* PASSWORD */}

            <div className="auth-group">
              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength="8"
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            Already have an account?{" "}
            <Link to="/login">
              Login
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

export default Register;