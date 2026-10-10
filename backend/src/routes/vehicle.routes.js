import express from "express";

import {
  createVehicle,
  getMyVehicles,
} from "../controllers/vehicle.controller.js";


import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| ALL VEHICLE ROUTES ARE USER ONLY
|--------------------------------------------------------------------------
*/

router.use(
  requireAuth,
  requireRole("USER")
);

/*
|--------------------------------------------------------------------------
| GET MY VEHICLES
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getMyVehicles
);

/*
|--------------------------------------------------------------------------
| ADD VEHICLE
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createVehicle
);

export default router;