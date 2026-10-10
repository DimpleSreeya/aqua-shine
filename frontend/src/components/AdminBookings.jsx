import {
  
  useEffect,
  useState,
} from "react";

function AdminBookings() {
  const [bookings, setBookings] =
    useState([]);
    const [workers, setWorkers] =
  useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD ALL BOOKINGS
  |--------------------------------------------------------------------------
  */

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/bookings`,
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
            "Unable to load bookings"
        );

        return;
      }

      setBookings(
        data.bookings
      );
    } catch (error) {
      console.error(
        "Load admin bookings error:",
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
  | LOAD WHEN COMPONENT OPENS
  |--------------------------------------------------------------------------
  */
const loadWorkers = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/workers`,
      {
        credentials: "include",
      }
    );

    const data =
      await response.json();

    if (response.ok) {
      setWorkers(
        data.workers.filter(
          (worker) =>
            worker.isActive
        )
      );
    }
  } catch (error) {
    console.error(
      "Load workers error:",
      error
    );
  }
};
  useEffect(() => {
  loadBookings();
  loadWorkers();
}, []);

  /*
  |--------------------------------------------------------------------------
  | UPDATE BOOKING STATUS
  |--------------------------------------------------------------------------
  */

  const updateBookingStatus =
    async (
      bookingId,
      status
    ) => {
      try {
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/admin/bookings/${bookingId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify({
                status,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to update booking"
          );

          return;
        }

        setMessage(
          "Booking status updated successfully"
        );

        await loadBookings();
      } catch (error) {
        console.error(
          "Update booking error:",
          error
        );

        setError(
          "Unable to connect to the server"
        );
      }
    };
const assignWorker = async (
  bookingId,
  workerId
) => {
  try {
    setMessage("");
    setError("");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/bookings/${bookingId}/worker`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          workerId:
            Number(workerId),
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.message ||
          "Unable to assign worker"
      );
      return;
    }

    setMessage(
      "Worker assigned successfully"
    );

    await loadBookings();
  } catch (error) {
    console.error(
      "Assign worker error:",
      error
    );

    setError(
      "Unable to connect to the server"
    );
  }
};
  return (
    
    <div>
      <hr />

      <h2>
        Booking Management
      </h2>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {loading ? (
        <p>
          Loading bookings...
        </p>
      ) : bookings.length === 0 ? (
        <p>
          No bookings available.
        </p>
      ) : (
        bookings.map(
          (booking) => (
            <div
              key={booking.id}
            >
              <h3>
                Booking #
                {booking.id}
              </h3>

              <h4>
                Customer Details
              </h4>

              <p>
                Name:{" "}
                {booking.user.name}
              </p>

              <p>
                Email:{" "}
                {booking.user.email}
              </p>

              <p>
                Phone:{" "}
                {booking.user.phone ||
                  "Not provided"}
              </p>

              <p>
                Location:{" "}
                {booking.user.location ||
                  "Not provided"}
              </p>

              <h4>
                Vehicle Details
              </h4>

              <p>
                Car:{" "}
                {
                  booking.vehicle
                    .carName
                }
              </p>

              <p>
                Car Number:{" "}
                {
                  booking.vehicle
                    .carNumber
                }
              </p>

              <p>
                Vehicle Type:{" "}
                {
                  booking.vehicle
                    .vehicleType
                }
              </p>

              <h4>
                Service Details
              </h4>

              <p>
                Service:{" "}
                {
                  booking.service
                    .name
                }
              </p>

              <p>
                Price: ₹
                {
                  booking.priceRupees
                }
              </p>

              <h4>
                Slot Details
              </h4>

              <p>
                Date:{" "}
                {
                  booking.slot.date
                }
              </p>

              <p>
                Time:{" "}
                {
                  booking.slot
                    .startTime
                }
                {" - "}
                {
                  booking.slot
                    .endTime
                }
              </p>

              <h4>
                Payment
              </h4>

              <p>
                Payment Status:{" "}
                <strong>
                  {
                    booking.paymentStatus
                  }
                </strong>
              </p>

              <h4>
                Booking Status
              </h4>

              <p>
                Current Status:{" "}
                <strong>
                  {
                    booking.status
                  }
                </strong>
              </p>

              <select
                value={
                  booking.status
                }
                onChange={(
                  event
                ) =>
                  updateBookingStatus(
                    booking.id,
                    event.target.value
                  )
                }
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>

              <hr />
            </div>
          )
        )
      )}
    </div>
  );
}

export default AdminBookings;