import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | WAIT WHILE LOGIN IS BEING CHECKED
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <p>
        Checking login...
      </p>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  if (!user) {
    const needsAdmin =
      allowedRoles?.includes(
        "ADMIN"
      );

    return (
      <Navigate
        to={
          needsAdmin
            ? "/admin-login"
            : "/login"
        }
        replace
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | WRONG ROLE
  |--------------------------------------------------------------------------
  */

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {
    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/user"
        replace
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ALLOWED
  |--------------------------------------------------------------------------
  */

  return children;
}

export default ProtectedRoute;