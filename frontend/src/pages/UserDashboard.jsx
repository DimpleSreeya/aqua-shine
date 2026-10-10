import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import BookCarWash from "../components/BookCarWash";

import "../UserDashboard.css";

function UserDashboard() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [formData, setFormData] =
    useState({
      carName: "",
      carNumber: "",
      vehicleType:
        "HATCHBACK",
    });

  const [vehicles, setVehicles] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD VEHICLES
  |--------------------------------------------------------------------------
  */

  const loadVehicles =
    async () => {
      try {
        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/vehicles`,
            {
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to load vehicles"
          );

          return;
        }

        setVehicles(
          data.vehicles
        );
      } catch (error) {
        console.error(
          "Load vehicles error:",
          error
        );

        setError(
          "Unable to connect to the server"
        );
      }
    };

  useEffect(() => {
    loadVehicles();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | INPUT CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ADD VEHICLE
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      try {
        setLoading(true);
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/vehicles`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

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
              "Unable to add vehicle"
          );

          return;
        }

        setMessage(
          "Vehicle added successfully"
        );

        setFormData({
          carName: "",
          carNumber: "",
          vehicleType:
            "HATCHBACK",
        });

        await loadVehicles();
      } catch (error) {
        console.error(
          "Add vehicle error:",
          error
        );

        setError(
          "Unable to connect to the server"
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout =
    async () => {
      await logout();

      navigate("/login");
    };

  return (
    <div className="user-dashboard">

      {/* SIDEBAR */}

      <aside className="user-sidebar">

        <div className="user-logo">
          AquaShine
        </div>

        <nav className="user-sidebar-menu">
          <a href="#overview">
            Overview
          </a>

          <a href="#profile">
            My Profile
          </a>

          <a href="#vehicles">
            My Vehicles
          </a>

          <a href="#booking">
            Book Car Wash
          </a>
        </nav>

      </aside>

      {/* MAIN */}

      <main className="user-main">

        {/* TOP BAR */}

        <div className="user-topbar">
          <div>
            <h1>
              Customer Dashboard
            </h1>

            <p>
              Manage your vehicles
              and car-wash bookings.
            </p>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* WELCOME */}

        <section
          id="overview"
          className="user-welcome-card"
        >
          <h2>
            Welcome, {user?.name}
          </h2>

          <p>
            Your car care is only a
            few clicks away.
          </p>
        </section>

        {/* STATS */}

        <section className="user-stats">

          <div className="user-stat-card">
            <span>
              My Vehicles
            </span>

            <strong>
              {vehicles.length}
            </strong>
          </div>

          <div className="user-stat-card">
            <span>
              Account Status
            </span>

            <strong>
              {user?.isActive
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

          <div className="user-stat-card">
            <span>
              Account Type
            </span>

            <strong>
              Customer
            </strong>
          </div>

        </section>

        {/* PROFILE */}

        <section
          id="profile"
          className="user-section"
        >
          <div className="user-section-header">
            <h2>
              My Profile
            </h2>

            <p>
              Your registered account
              information.
            </p>
          </div>

          <div className="profile-details">

            <div className="profile-item">
              <span>
                Full Name
              </span>

              <strong>
                {user?.name}
              </strong>
            </div>

            <div className="profile-item">
              <span>
                Email
              </span>

              <strong>
                {user?.email}
              </strong>
            </div>

            <div className="profile-item">
              <span>
                Phone
              </span>

              <strong>
                {user?.phone ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-item">
              <span>
                Location
              </span>

              <strong>
                {user?.location ||
                  "Not provided"}
              </strong>
            </div>

          </div>
        </section>

        {/* VEHICLES */}

        <section
          id="vehicles"
          className="user-section"
        >
          <div className="user-section-header">
            <h2>
              My Vehicles
            </h2>

            <p>
              Add and manage the cars
              connected to your account.
            </p>
          </div>

          {message && (
            <div className="user-success">
              {message}
            </div>
          )}

          {error && (
            <div className="user-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            <div>
              <label>
                Car Name
              </label>

              <input
                type="text"
                name="carName"
                value={
                  formData.carName
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Hyundai i20"
                required
              />
            </div>

            <br />

            <div>
              <label>
                Registration Number
              </label>

              <input
                type="text"
                name="carNumber"
                value={
                  formData.carNumber
                }
                onChange={
                  handleChange
                }
                placeholder="Example: AP26AB1234"
                required
              />
            </div>

            <br />

            <div>
              <label>
                Vehicle Type
              </label>

              <select
                name="vehicleType"
                value={
                  formData.vehicleType
                }
                onChange={
                  handleChange
                }
              >
                <option value="HATCHBACK">
                  Hatchback
                </option>

                <option value="SEDAN">
                  Sedan
                </option>

                <option value="SUV">
                  SUV
                </option>

                <option value="MUV">
                  MUV
                </option>

                <option value="LUXURY">
                  Luxury
                </option>
              </select>
            </div>

            <br />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Adding Vehicle..."
                : "Add Vehicle"}
            </button>
          </form>

          <div className="vehicle-grid">

            {vehicles.length === 0 ? (
              <p>
                No vehicles added yet.
              </p>
            ) : (
              vehicles.map(
                (vehicle) => (
                  <div
                    className="vehicle-card"
                    key={vehicle.id}
                  >
                    <h3>
                      {vehicle.carName}
                    </h3>

                    <p>
                      Registration
                    </p>

                    <strong>
                      {
                        vehicle.carNumber
                      }
                    </strong>

                    <br />

                    <span className="vehicle-type">
                      {
                        vehicle.vehicleType
                      }
                    </span>
                  </div>
                )
              )
            )}

          </div>
        </section>

        {/* BOOKING */}

        <section
          id="booking"
          className="user-section booking-shell"
        >
          <BookCarWash />
        </section>

      </main>
    </div>
  );
}

export default UserDashboard;