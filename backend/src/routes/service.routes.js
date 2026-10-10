import express from "express";

import {
  createService,
  getServices,
  updateService,
  updateServiceStatus,
} from "../controllers/service.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| VIEW SERVICES
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  requireAuth,
  getServices
);

/*
|--------------------------------------------------------------------------
| CREATE SERVICE - ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  createService
);
/*
|--------------------------------------------------------------------------
| UPDATE SERVICE - ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  updateService
);

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE SERVICE - ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  updateServiceStatus
);

export default router;