import express from "express";

import {
  getAdminAnalytics,
} from "../controllers/adminAnalytics.controller.js";

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
| ANALYTICS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAdminAnalytics
);

export default router;