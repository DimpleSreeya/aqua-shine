import {
  useEffect,
  useState,
} from "react";

function AdminAnalytics() {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/analytics`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to load analytics"
        );

        return;
      }

      setAnalytics(
        data.analytics
      );
    } catch (error) {
      console.error(
        "Analytics error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <hr />

        <h2>
          Dashboard Analytics
        </h2>

        <p>
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <hr />

        <h2>
          Dashboard Analytics
        </h2>

        <p>{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div>
      <hr />

      <h2>
        Dashboard Analytics
      </h2>

      <div>
        <h3>
          Total Users
        </h3>

        <p>
          {analytics.totalUsers}
        </p>
      </div>

      <div>
        <h3>
          Total Bookings
        </h3>

        <p>
          {analytics.totalBookings}
        </p>
      </div>

      <div>
        <h3>
          Total Paid Revenue
        </h3>

        <p>
          ₹
          {
            analytics.totalRevenueRupees
          }
        </p>
      </div>

      <hr />

      <h3>
        Booking Status
      </h3>

      <p>
        Pending:{" "}
        {analytics.pendingBookings}
      </p>

      <p>
        Confirmed:{" "}
        {analytics.confirmedBookings}
      </p>

      <p>
        Completed:{" "}
        {analytics.completedBookings}
      </p>

      <p>
        Cancelled:{" "}
        {analytics.cancelledBookings}
      </p>

      <hr />

      <h3>
        Highest-Spending Customer
      </h3>

      {analytics.topCustomer ? (
        <>
          <p>
            Name:{" "}
            {
              analytics.topCustomer
                .name
            }
          </p>

          <p>
            Email:{" "}
            {
              analytics.topCustomer
                .email
            }
          </p>

          <p>
            Paid Bookings:{" "}
            {
              analytics.topCustomer
                .paidBookings
            }
          </p>

          <p>
            Total Spent: ₹
            {
              analytics.topCustomer
                .totalSpentRupees
            }
          </p>
        </>
      ) : (
        <p>
          No paid customer data yet.
        </p>
      )}

      <br />

      <button
        type="button"
        onClick={loadAnalytics}
      >
        Refresh Analytics
      </button>
    </div>
  );
}

export default AdminAnalytics;