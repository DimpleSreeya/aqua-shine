import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import AdminAnalytics from "../components/AdminAnalytics";
import AdminServices from "../components/AdminServices";
import AdminSlots from "../components/AdminSlots";
import AdminBookings from "../components/AdminBookings";
import AdminUsers from "../components/AdminUsers";
import AdminWorkers from "../components/AdminWorkers";

import "../AdminDashboard.css";

function AdminDashboard() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout =
    async () => {
      await logout();

      navigate(
        "/admin-login"
      );
    };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          AquaShine
        </div>

        <div className="admin-badge">
          ADMIN PORTAL
        </div>

        <p className="admin-section-title">
          MANAGEMENT
        </p>

        <nav className="admin-menu">

          <a href="#analytics">
            Dashboard
          </a>

          <a href="#services">
            Services
          </a>

          <a href="#slots">
            Booking Slots
          </a>

          <a href="#bookings">
            Bookings
          </a>

          <a href="#users">
            Customers
          </a>

          <a href="#workers">
            Workers
          </a>

        </nav>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* TOP BAR */}

        <div className="admin-topbar">

          <div>
            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage your AquaShine
              car-wash business.
            </p>
          </div>

          <button
            className="admin-logout"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        {/* WELCOME */}

        <section className="admin-welcome">

          <h2>
            Welcome, {user?.name}
          </h2>

          <p>
            Monitor bookings,
            customers, workers,
            services and revenue
            from one place.
          </p>

        </section>

        {/* ANALYTICS */}

        <section
          id="analytics"
          className="admin-panel"
        >
          <AdminAnalytics />
        </section>

        {/* SERVICES */}

        <section
          id="services"
          className="admin-panel"
        >
          <AdminServices />
        </section>

        {/* SLOTS */}

        <section
          id="slots"
          className="admin-panel"
        >
          <AdminSlots />
        </section>

        {/* BOOKINGS */}

        <section
          id="bookings"
          className="admin-panel"
        >
          <AdminBookings />
        </section>

        {/* USERS */}

        <section
          id="users"
          className="admin-panel"
        >
          <AdminUsers />
        </section>

        {/* WORKERS */}

        <section
          id="workers"
          className="admin-panel"
        >
          <AdminWorkers />
        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;