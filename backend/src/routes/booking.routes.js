import express from "express";

import {
  createBooking,
  getMyBookings,
  payBooking,
} from "../controllers/booking.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| USER ONLY
|--------------------------------------------------------------------------
*/

router.use(
  requireAuth,
  requireRole("USER")
);

/*
|--------------------------------------------------------------------------
| GET MY BOOKINGS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getMyBookings
);

/*
|--------------------------------------------------------------------------
| CREATE BOOKING
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createBooking
);

/*
|--------------------------------------------------------------------------
| MOCK PAYMENT
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/pay",
  payBooking
);

export default router;