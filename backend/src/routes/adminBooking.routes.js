import express from "express";
import {
  getAllBookings,
  updateBookingStatus,
  assignWorker,
} from "../controllers/adminBooking.controller.js";

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
| GET ALL BOOKINGS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAllBookings
);

/*
|--------------------------------------------------------------------------
| UPDATE BOOKING STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  updateBookingStatus
);
router.patch(
  "/:id/worker",
  assignWorker
);
export default router;