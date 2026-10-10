import {
  useEffect,
  useState,
} from "react";

const emptyPrices = {
  HATCHBACK: "",
  SEDAN: "",
  SUV: "",
  MUV: "",
  LUXURY: "",
};

function AdminServices() {
  const [services, setServices] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      prices: {
        ...emptyPrices,
      },
    });

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      name: "",
      description: "",
      prices: {
        ...emptyPrices,
      },
    });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to load services"
        );

        return;
      }

      setServices(data.services);
    } catch (error) {
      console.error(
        "Load services error:",
        error
      );

      setError(
        "Unable to connect to the server"
      );
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CREATE FORM CHANGE
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

  const handlePriceChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      prices: {
        ...previous.prices,
        [name]: value,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE SERVICE
  |--------------------------------------------------------------------------
  */

  const createService = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services`,
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
            "Unable to create service"
        );

        return;
      }

      setMessage(
        "Service created successfully"
      );

      setFormData({
        name: "",
        description: "",
        prices: {
          ...emptyPrices,
        },
      });

      await loadServices();
    } catch (error) {
      console.error(
        "Create service error:",
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
  | START EDITING
  |--------------------------------------------------------------------------
  */

  const startEditing = (
    service
  ) => {
    const prices = {
      ...emptyPrices,
    };

    service.prices.forEach(
      (price) => {
        prices[
          price.vehicleType
        ] = price.priceRupees;
      }
    );

    setEditingId(service.id);

    setEditData({
      name: service.name,

      description:
        service.description || "",

      prices,
    });

    setMessage("");
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleEditChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditPriceChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setEditData((previous) => ({
      ...previous,

      prices: {
        ...previous.prices,
        [name]: value,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE SERVICE CHANGES
  |--------------------------------------------------------------------------
  */

  const saveService = async (
    serviceId
  ) => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/${serviceId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            editData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update service"
        );

        return;
      }

      setMessage(
        "Service updated successfully"
      );

      setEditingId(null);

      await loadServices();
    } catch (error) {
      console.error(
        "Update service error:",
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
  | ACTIVATE / DEACTIVATE
  |--------------------------------------------------------------------------
  */

  const updateServiceStatus =
    async (
      serviceId,
      isActive
    ) => {
      try {
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/services/${serviceId}/status`,
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
              "Unable to update service"
          );

          return;
        }

        setMessage(data.message);

        await loadServices();
      } catch (error) {
        console.error(
          "Service status error:",
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
        Service Management
      </h2>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      <h3>
        Create Service
      </h3>

      <form
        onSubmit={createService}
      >
        <div>
          <label>
            Service Name
          </label>

          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>
            Description
          </label>

          <br />

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
          />
        </div>

        <br />

        {Object.keys(
          formData.prices
        ).map((type) => (
          <div key={type}>
            <label>
              {type} Price ₹
            </label>

            <br />

            <input
              type="number"
              name={type}
              value={
                formData.prices[
                  type
                ]
              }
              onChange={
                handlePriceChange
              }
              min="1"
              required
            />

            <br />
            <br />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Create Service"}
        </button>
      </form>

      <hr />

      <h3>
        Existing Services
      </h3>

      {services.length === 0 ? (
        <p>
          No services available.
        </p>
      ) : (
        services.map(
          (service) => (
            <div
              key={service.id}
            >
              {editingId ===
              service.id ? (
                <>
                  <h4>
                    Edit Service
                  </h4>

                  <div>
                    <label>
                      Service Name
                    </label>

                    <br />

                    <input
                      type="text"
                      name="name"
                      value={
                        editData.name
                      }
                      onChange={
                        handleEditChange
                      }
                    />
                  </div>

                  <br />

                  <div>
                    <label>
                      Description
                    </label>

                    <br />

                    <textarea
                      name="description"
                      value={
                        editData.description
                      }
                      onChange={
                        handleEditChange
                      }
                    />
                  </div>

                  <br />

                  {Object.keys(
                    editData.prices
                  ).map((type) => (
                    <div
                      key={type}
                    >
                      <label>
                        {type} Price ₹
                      </label>

                      <br />

                      <input
                        type="number"
                        name={type}
                        value={
                          editData.prices[
                            type
                          ]
                        }
                        onChange={
                          handleEditPriceChange
                        }
                        min="1"
                      />

                      <br />
                      <br />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      saveService(
                        service.id
                      )
                    }
                    disabled={loading}
                  >
                    Save Changes
                  </button>

                  {" "}

                  <button
                    type="button"
                    onClick={() =>
                      setEditingId(
                        null
                      )
                    }
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h4>
                    {service.name}
                  </h4>

                  <p>
                    {service.description ||
                      "No description"}
                  </p>

                  <p>
                    Status:{" "}
                    <strong>
                      {service.isActive
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </strong>
                  </p>

                  <strong>
                    Prices
                  </strong>

                  <ul>
                    {service.prices.map(
                      (price) => (
                        <li
                          key={
                            price.id
                          }
                        >
                          {
                            price.vehicleType
                          }
                          {" - ₹"}
                          {
                            price.priceRupees
                          }
                        </li>
                      )
                    )}
                  </ul>

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(
                        service
                      )
                    }
                  >
                    Edit Service
                  </button>

                  {" "}

                  {service.isActive ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateServiceStatus(
                          service.id,
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
                        updateServiceStatus(
                          service.id,
                          true
                        )
                      }
                    >
                      Activate
                    </button>
                  )}
                </>
              )}

              <hr />
            </div>
          )
        )
      )}
    </div>
  );
}

export default AdminServices;