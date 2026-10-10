import {
  useEffect,
  useState,
} from "react";

function AdminUsers() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | CREATE USER FORM
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
    });

  /*
  |--------------------------------------------------------------------------
  | PASSWORD RESET
  |--------------------------------------------------------------------------
  */

  const [resetUserId, setResetUserId] =
    useState(null);

  const [newPassword, setNewPassword] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD USERS
  |--------------------------------------------------------------------------
  */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        {
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to load users"
        );

        return;
      }

      setUsers(data.users);
    } catch (error) {
      console.error(
        "Load users error:",
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
    loadUsers();
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
  | ADMIN CREATES USER
  |--------------------------------------------------------------------------
  */

  const createUser = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users`,
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
            "Unable to create user"
        );

        return;
      }

      setMessage(
        "User account created successfully"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
      });

      await loadUsers();
    } catch (error) {
      console.error(
        "Create user error:",
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

  const updateUserStatus =
    async (
      userId,
      isActive
    ) => {
      try {
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/admin/users/${userId}/status`,
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
              "Unable to update user"
          );

          return;
        }

        setMessage(data.message);

        await loadUsers();
      } catch (error) {
        console.error(
          "User status error:",
          error
        );

        setError(
          "Unable to connect to the server"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | RESET PASSWORD
  |--------------------------------------------------------------------------
  */

  const resetPassword =
    async (userId) => {
      if (
        newPassword.length < 8
      ) {
        setError(
          "New password must contain at least 8 characters"
        );

        return;
      }

      try {
        setMessage("");
        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/admin/users/${userId}/reset-password`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify({
                newPassword,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to reset password"
          );

          return;
        }

        setMessage(
          "User password reset successfully"
        );

        setResetUserId(null);
        setNewPassword("");
      } catch (error) {
        console.error(
          "Reset password error:",
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
        User Management
      </h2>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {/* CREATE USER */}

      <h3>
        Create User Account
      </h3>

      <form
        onSubmit={createUser}
      >
        <div>
          <label>
            Name
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
            Email
          </label>

          <br />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>
            Temporary Password
          </label>

          <br />

          <input
            type="password"
            name="password"
            value={
              formData.password
            }
            onChange={handleChange}
            minLength="8"
            required
          />
        </div>

        <br />

        <div>
          <label>
            Phone
          </label>

          <br />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>
            Location
          </label>

          <br />

          <input
            type="text"
            name="location"
            value={
              formData.location
            }
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          Create User
        </button>
      </form>

      <hr />

      <h3>
        Registered Users
      </h3>

      {loading &&
      users.length === 0 ? (
        <p>
          Loading users...
        </p>
      ) : users.length === 0 ? (
        <p>
          No users available.
        </p>
      ) : (
        users.map(
          (user) => (
            <div key={user.id}>
              <h3>
                {user.name}
              </h3>

              <p>
                Email:{" "}
                {user.email}
              </p>

              <p>
                Phone:{" "}
                {user.phone ||
                  "Not provided"}
              </p>

              <p>
                Location:{" "}
                {user.location ||
                  "Not provided"}
              </p>

              <p>
                Status:{" "}
                <strong>
                  {user.isActive
                    ? "ACTIVE"
                    : "INACTIVE"}
                </strong>
              </p>

              <p>
                Total Bookings:{" "}
                {
                  user.bookings
                    .length
                }
              </p>

              <p>
                Total Paid: ₹
                {
                  user.totalSpentRupees
                }
              </p>

              {/* ACTIVATE / DEACTIVATE */}

              {user.isActive ? (
                <button
                  type="button"
                  onClick={() =>
                    updateUserStatus(
                      user.id,
                      false
                    )
                  }
                >
                  Deactivate User
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    updateUserStatus(
                      user.id,
                      true
                    )
                  }
                >
                  Activate User
                </button>
              )}

              {" "}

              {/* RESET PASSWORD */}

              <button
                type="button"
                onClick={() => {
                  setResetUserId(
                    user.id
                  );

                  setNewPassword(
                    ""
                  );

                  setError("");
                }}
              >
                Reset Password
              </button>

              {resetUserId ===
                user.id && (
                <div>
                  <br />

                  <label>
                    New Password
                  </label>

                  <br />

                  <input
                    type="password"
                    value={
                      newPassword
                    }
                    onChange={(
                      event
                    ) =>
                      setNewPassword(
                        event.target
                          .value
                      )
                    }
                    minLength="8"
                    placeholder="Minimum 8 characters"
                  />

                  <br />
                  <br />

                  <button
                    type="button"
                    onClick={() =>
                      resetPassword(
                        user.id
                      )
                    }
                  >
                    Save New Password
                  </button>

                  {" "}

                  <button
                    type="button"
                    onClick={() => {
                      setResetUserId(
                        null
                      );

                      setNewPassword(
                        ""
                      );
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* VEHICLES */}

              <h4>
                Vehicles
              </h4>

              {user.vehicles
                .length === 0 ? (
                <p>
                  No vehicles added.
                </p>
              ) : (
                user.vehicles.map(
                  (vehicle) => (
                    <p
                      key={
                        vehicle.id
                      }
                    >
                      {
                        vehicle.carName
                      }
                      {" | "}
                      {
                        vehicle.carNumber
                      }
                      {" | "}
                      {
                        vehicle.vehicleType
                      }
                    </p>
                  )
                )
              )}

              {/* BOOKINGS */}

              <h4>
                Booking History
              </h4>

              {user.bookings
                .length === 0 ? (
                <p>
                  No bookings yet.
                </p>
              ) : (
                user.bookings.map(
                  (booking) => (
                    <div
                      key={
                        booking.id
                      }
                    >
                      <p>
                        Booking #
                        {
                          booking.id
                        }
                      </p>

                      <p>
                        Service:{" "}
                        {
                          booking
                            .service
                            .name
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
                        Price: ₹
                        {
                          booking
                            .priceRupees
                        }
                      </p>

                      <p>
                        Payment:{" "}
                        {
                          booking
                            .paymentStatus
                        }
                      </p>

                      <p>
                        Status:{" "}
                        {
                          booking.status
                        }
                      </p>

                      <br />
                    </div>
                  )
                )
              )}

              <hr />
            </div>
          )
        )
      )}
    </div>
  );
}

export default AdminUsers;