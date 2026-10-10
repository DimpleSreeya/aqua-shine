import {
  useEffect,
  useState,
} from "react";

function BookCarWash() {
  const [vehicles, setVehicles] =
    useState([]);

  const [services, setServices] =
    useState([]);

  const [slots, setSlots] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [formData, setFormData] =
    useState({
      vehicleId: "",
      serviceId: "",
      slotId: "",
    });

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

  const loadVehicles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicles`,
        {
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error(
        "Load vehicles error:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD SERVICES
  |--------------------------------------------------------------------------
  */

  const loadServices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services`,
        {
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setServices(
          data.services.filter(
            (service) =>
              service.isActive
          )
        );
      }
    } catch (error) {
      console.error(
        "Load services error:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD AVAILABLE SLOTS
  |--------------------------------------------------------------------------
  */

  const loadSlots = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/slots`,
        {
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const availableSlots =
          data.slots.filter(
            (slot) =>
              slot.isOpen &&
              slot.date >= today
          );

        setSlots(
          availableSlots
        );
      }
    } catch (error) {
      console.error(
        "Load slots error:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD MY BOOKINGS
  |--------------------------------------------------------------------------
  */

  const loadBookings =
    async () => {
      try {
        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/bookings`,
            {
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          setBookings(
            data.bookings
          );
        }
      } catch (error) {
        console.error(
          "Load bookings error:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | LOAD EVERYTHING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadVehicles();
    loadServices();
    loadSlots();
    loadBookings();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
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
  | SELECTED VEHICLE
  |--------------------------------------------------------------------------
  */

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id ===
        Number(
          formData.vehicleId
        )
    );

  /*
  |--------------------------------------------------------------------------
  | SELECTED SERVICE
  |--------------------------------------------------------------------------
  */

  const selectedService =
    services.find(
      (service) =>
        service.id ===
        Number(
          formData.serviceId
        )
    );

  /*
  |--------------------------------------------------------------------------
  | CORRECT PRICE FOR VEHICLE TYPE
  |--------------------------------------------------------------------------
  */

  const selectedPrice =
    selectedService &&
    selectedVehicle
      ? selectedService.prices.find(
          (price) =>
            price.vehicleType ===
            selectedVehicle.vehicleType
        )
      : null;

  /*
  |--------------------------------------------------------------------------
  | CREATE BOOKING
  |--------------------------------------------------------------------------
  */

  const handleBooking =
    async (event) => {
      event.preventDefault();

      setMessage("");
      setError("");

      if (
        !formData.vehicleId ||
        !formData.serviceId ||
        !formData.slotId
      ) {
        setError(
          "Please select car, service and slot"
        );
/*
|--------------------------------------------------------------------------
| MOCK PAYMENT
|--------------------------------------------------------------------------
*/

const handlePayment =
  async (bookingId) => {
    try {
      setMessage("");
      setError("");

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/pay`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Payment failed"
        );

        return;
      }

      setMessage(
        "Payment completed successfully"
      );

      await loadBookings();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    }
  };
        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/bookings`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify({
                vehicleId:
                  Number(
                    formData.vehicleId
                  ),

                serviceId:
                  Number(
                    formData.serviceId
                  ),

                slotId:
                  Number(
                    formData.slotId
                  ),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to create booking"
          );

          await loadSlots();

          return;
        }

        setMessage(
          "Car wash booked successfully"
        );

        setFormData({
          vehicleId: "",
          serviceId: "",
          slotId: "",
        });

        /*
         * Reload because the booked
         * slot is now CLOSED.
         */

        await loadSlots();

        await loadBookings();
      } catch (error) {
        console.error(
          "Booking error:",
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
    <div>
      <hr />

      <h2>
        Book Car Wash
      </h2>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {vehicles.length === 0 ? (
        <p>
          Please add a vehicle
          before booking a wash.
        </p>
      ) : (
        <form
          onSubmit={
            handleBooking
          }
        >
          {/* VEHICLE */}

          <div>
            <label>
              Select Your Car
            </label>

            <br />

            <select
              name="vehicleId"
              value={
                formData.vehicleId
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                Select Car
              </option>

              {vehicles.map(
                (vehicle) => (
                  <option
                    key={
                      vehicle.id
                    }
                    value={
                      vehicle.id
                    }
                  >
                    {
                      vehicle.carName
                    }
                    {" - "}
                    {
                      vehicle.carNumber
                    }
                    {" - "}
                    {
                      vehicle.vehicleType
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <br />

          {/* SERVICE */}

          <div>
            <label>
              Select Wash Service
            </label>

            <br />

            <select
              name="serviceId"
              value={
                formData.serviceId
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                Select Service
              </option>

              {services.map(
                (service) => (
                  <option
                    key={
                      service.id
                    }
                    value={
                      service.id
                    }
                  >
                    {
                      service.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <br />

          {/* PRICE */}

          {selectedVehicle &&
            selectedService && (
              <div>
                <strong>
                  Price:{" "}
                </strong>

                {selectedPrice ? (
                  <span>
                    ₹
                    {
                      selectedPrice.priceRupees
                    }
                  </span>
                ) : (
                  <span>
                    Price unavailable
                  </span>
                )}
              </div>
            )}

          <br />

          {/* SLOT */}

          <div>
            <label>
              Select Available Slot
            </label>

            <br />

            <select
              name="slotId"
              value={
                formData.slotId
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                Select Slot
              </option>

              {slots.map(
                (slot) => (
                  <option
                    key={slot.id}
                    value={slot.id}
                  >
                    {slot.date}
                    {" | "}
                    {
                      slot.startTime
                    }
                    {" - "}
                    {
                      slot.endTime
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {slots.length === 0 && (
            <p>
              No slots are currently
              available.
            </p>
          )}

          <br />

          <button
            type="submit"
            disabled={
              loading ||
              !selectedPrice ||
              slots.length === 0
            }
          >
            {loading
              ? "Booking..."
              : "Book Now"}
          </button>
        </form>
      )}

      <hr />

      <h2>
        My Booking History
      </h2>

      {bookings.length === 0 ? (
        <p>
          You have no bookings yet.
        </p>
      ) : (
        bookings.map(
          (booking) => (
            <div
              key={booking.id}
            >
              <h3>
                {
                  booking.service
                    .name
                }
              </h3>

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

              <p>
                Date:{" "}
                {
                  booking.slot
                    .date
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

              <p>
                Price: ₹
                {
                  booking.priceRupees
                }
              </p>

              <p>
                Booking Status:{" "}
                <strong>
                  {
                    booking.status
                  }
                </strong>
              </p>
<h4>
  Assigned Worker
</h4>

{booking.worker ? (
  <>
    <p>
      Name:{" "}
      {booking.worker.name}
    </p>

    <p>
      Phone:{" "}
      {booking.worker.phone}
    </p>
  </>
) : (
  <p>
    Worker not assigned yet.
  </p>
)}
              <p>
                Payment Status:{" "}
                <strong>
                  {
                    booking.paymentStatus
                  }
                </strong>
              </p>
{booking.paymentStatus ===
  "UNPAID" && (
  <button
    type="button"
    onClick={() =>
      handlePayment(
        booking.id
      )
    }
  >
    Pay ₹
    {booking.priceRupees}
  </button>
)}
              <hr />
            </div>
          )
        )
      )}
    </div>
  );
}

export default BookCarWash;