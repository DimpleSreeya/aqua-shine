import express from "express";
import {
  authLimiter,
} from "../middleware/security.middleware.js";

import {
  register,
  login,
  adminLogin,
  getMe,
  logout,
} from "../controllers/auth.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  authLimiter,
  register
);


/*
|--------------------------------------------------------------------------
| USER LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  authLimiter,
  login
);

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/admin-login",
  authLimiter,
  adminLogin
);

/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  requireAuth,
  getMe
);

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

router.post(
  "/logout",
  requireAuth,
  logout
);

export default router;