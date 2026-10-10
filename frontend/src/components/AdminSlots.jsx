import {
  useEffect,
  useState,
} from "react";

function AdminSlots() {
  const [formData, setFormData] =
    useState({
      date: "",
      startTime: "",
      endTime: "",
    });

  const [slots, setSlots] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD SLOTS
  |--------------------------------------------------------------------------
  */

  const loadSlots = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/slots`,
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
            "Unable to load slots"
        );

        return;
      }

      setSlots(data.slots);
    } catch (error) {
      console.error(
        "Load slots error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    }
  };

  useEffect(() => {
    loadSlots();
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
  | CREATE SLOT
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
        `${import.meta.env.VITE_API_URL}/slots`,
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
            "Unable to create slot"
        );

        return;
      }

      setMessage(
        "Slot created successfully"
      );

      setFormData({
        date: "",
        startTime: "",
        endTime: "",
      });

      await loadSlots();
    } catch (error) {
      console.error(
        "Create slot error:",
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
  | OPEN / CLOSE SLOT
  |--------------------------------------------------------------------------
  */

  const updateSlotStatus =
    async (slotId, isOpen) => {
      try {
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/slots/${slotId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify({
                isOpen,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to update slot"
          );

          return;
        }

        setMessage(
          isOpen
            ? "Slot opened successfully"
            : "Slot closed successfully"
        );

        await loadSlots();
      } catch (error) {
        console.error(
          "Update slot error:",
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
        Booking Slot Management
      </h2>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
      >
        <div>
          <label>
            Date
          </label>

          <br />

          <input
            type="date"
            name="date"
            value={
              formData.date
            }
            onChange={
              handleChange
            }
            required
          />
        </div>

        <br />

        <div>
          <label>
            Start Time
          </label>

          <br />

          <input
            type="time"
            name="startTime"
            value={
              formData.startTime
            }
            onChange={
              handleChange
            }
            required
          />
        </div>

        <br />

        <div>
          <label>
            End Time
          </label>

          <br />

          <input
            type="time"
            name="endTime"
            value={
              formData.endTime
            }
            onChange={
              handleChange
            }
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Slot"}
        </button>
      </form>

      <hr />

      <h2>
        Created Slots
      </h2>

      {slots.length === 0 ? (
        <p>
          No booking slots
          created yet.
        </p>
      ) : (
        slots.map(
          (slot) => (
            <div key={slot.id}>
              <h3>
                {slot.date}
              </h3>

              <p>
                Time:{" "}
                {slot.startTime}
                {" - "}
                {slot.endTime}
              </p>

              <p>
                Status:{" "}
                <strong>
                  {slot.isOpen
                    ? "OPEN"
                    : "CLOSED"}
                </strong>
              </p>

              {slot.isOpen ? (
                <button
                  type="button"
                  onClick={() =>
                    updateSlotStatus(
                      slot.id,
                      false
                    )
                  }
                >
                  Close Slot
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    updateSlotStatus(
                      slot.id,
                      true
                    )
                  }
                >
                  Open Slot
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

export default AdminSlots;