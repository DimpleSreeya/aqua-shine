import { Link } from "react-router-dom";
import heroCar from "../assets/carwash.png";

function Home() {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          AquaShine
        </div>

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/login">
            Customer Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link
            to="/admin-login"
            className="admin-link"
          >
            Admin
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <p className="hero-small">
            PREMIUM CAR CARE
          </p>

          <h1>
            Give Your Car
            <span>
              {" "}The Shine It Deserves.
            </span>
          </h1>

          <p className="hero-description">
            Professional car wash services
            with convenient online booking,
            flexible time slots and
            transparent pricing.
          </p>

          <div className="hero-buttons">
            <Link
              to="/login"
              className="primary-button"
            >
              Book a Car Wash
            </Link>

            <Link
              to="/register"
              className="secondary-button"
            >
              Create Account
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <strong>Easy</strong>
              <span>Online Booking</span>
            </div>

            <div>
              <strong>Flexible</strong>
              <span>Time Slots</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Account Access</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
  <div className="hero-image-card">
    <img

  src={heroCar}
  alt="Blue car being professionally washed"
  className="hero-car-image"
/>
    

    <div className="hero-image-overlay">
      <span>
        PREMIUM CAR CARE
      </span>

      <h2>
        Clean. Protect. Shine.
      </h2>
    </div>
  </div>
</div>
      </main>

      <section className="services-preview">
        <p className="section-label">
          WHY CHOOSE US
        </p>

        <h2>
          Everything Your Car Needs
        </h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              💧
            </div>

            <h3>
              Professional Wash
            </h3>

            <p>
              Quality cleaning services
              for every vehicle type.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              📅
            </div>

            <h3>
              Easy Scheduling
            </h3>

            <p>
              Choose a convenient date
              and available time slot.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              💳
            </div>

            <h3>
              Simple Payment
            </h3>

            <p>
              Transparent prices based
              on vehicle and service.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              👨‍🔧
            </div>

            <h3>
              Trained Workers
            </h3>

            <p>
              Professional workers
              assigned to your booking.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>
            AquaShine Car Wash
          </strong>

          <p>
            Premium care for every ride.
          </p>
        </div>

        <p>
          © 2026 AquaShine
        </p>
      </footer>
    </div>
  );
}

export default Home;