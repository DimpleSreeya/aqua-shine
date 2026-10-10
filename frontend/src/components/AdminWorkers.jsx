import {
  useEffect,
  useState,
} from "react";

function AdminWorkers() {
  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
    });

  const [workers, setWorkers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to load workers"
        );
        return;
      }

      setWorkers(data.workers);
    } catch (error) {
      console.error(
        "Load workers error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

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
      setMessage("");
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/workers`,
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
            "Unable to create worker"
        );
        return;
      }

      setMessage(
        "Worker created successfully"
      );

      setFormData({
        name: "",
        phone: "",
      });

      await loadWorkers();
    } catch (error) {
      console.error(
        "Create worker error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateWorkerStatus =
    async (
      workerId,
      isActive
    ) => {
      try {
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/admin/workers/${workerId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify({
                isActive,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to update worker"
          );
          return;
        }

        setMessage(data.message);

        await loadWorkers();
      } catch (error) {
        console.error(
          "Update worker error:",
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
        Worker Management
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
            Worker Name
          </label>

          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Example: Ravi"
            required
          />
        </div>

        <br />

        <div>
          <label>
            Phone Number
          </label>

          <br />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Example: 9876543210"
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
            : "Add Worker"}
        </button>
      </form>

      <hr />

      <h3>
        Workers
      </h3>

      {workers.length === 0 ? (
        <p>
          No workers created yet.
        </p>
      ) : (
        workers.map(
          (worker) => (
            <div key={worker.id}>
              <h4>
                {worker.name}
              </h4>

              <p>
                Phone: {worker.phone}
              </p>

              <p>
                Status:{" "}
                <strong>
                  {worker.isActive
                    ? "ACTIVE"
                    : "INACTIVE"}
                </strong>
              </p>

              {worker.isActive ? (
                <button
                  type="button"
                  onClick={() =>
                    updateWorkerStatus(
                      worker.id,
                      false
                    )
                  }
                >
                  Deactivate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    updateWorkerStatus(
                      worker.id,
                      true
                    )
                  }
                >
                  Activate
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

export default AdminWorkers;