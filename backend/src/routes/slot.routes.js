import express from "express";

import {
  createSlot,
  getSlots,
  updateSlotStatus,
} from "../controllers/slot.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| VIEW SLOTS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  requireAuth,
  getSlots
);

/*
|--------------------------------------------------------------------------
| CREATE SLOT - ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  createSlot
);

/*
|--------------------------------------------------------------------------
| OPEN / CLOSE SLOT - ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  updateSlotStatus
);

export default router;