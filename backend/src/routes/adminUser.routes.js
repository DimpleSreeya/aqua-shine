import express from "express";

import {
  getAllUsers,
  updateUserStatus,
} from "../controllers/adminUser.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.use(
  requireAuth,
  requireRole("ADMIN")
);

/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAllUsers
);

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE USER
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  updateUserStatus
);

export default router;