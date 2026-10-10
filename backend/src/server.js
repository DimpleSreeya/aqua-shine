import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import helmet from "helmet";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminBookingRoutes from "./routes/adminBooking.routes.js";
import adminUserRoutes from "./routes/adminUser.routes.js";
import adminWorkerRoutes from "./routes/adminWorker.routes.js";
import adminAnalyticsRoutes from "./routes/adminAnalytics.routes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();
app.disable("x-powered-by");

app.use(helmet());

const PORT = env.PORT;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);


app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Basic Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Car Wash API is running",
  });
});

/*
|--------------------------------------------------------------------------
| Health Route
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

/*
|--------------------------------------------------------------------------
| SQLite Database Test
|--------------------------------------------------------------------------
*/

app.get("/api/db-test", async (req, res) => {
  try {
    const userCount =
      await prisma.user.count();

    return res.status(200).json({
      success: true,
      message: "SQLite database connected",
      userCount,
    });
  } catch (error) {
    console.error(
      "Database test error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/vehicles",
  vehicleRoutes
);
app.use(
  "/api/services",
  serviceRoutes
);
app.use(
  "/api/slots",
  slotRoutes
);
app.use(
  "/api/bookings",
  bookingRoutes
);
app.use(
  "/api/admin/bookings",
  adminBookingRoutes
);
app.use(
  "/api/admin/users",
  adminUserRoutes
);
app.use(
  "/api/admin/workers",
  adminWorkerRoutes
);
app.use(
  "/api/admin/analytics",
  adminAnalyticsRoutes
);
/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This must always stay AFTER all real routes.
|
*/

/*
|--------------------------------------------------------------------------
| 404 + GLOBAL ERROR HANDLING
|--------------------------------------------------------------------------
*/

app.use(notFound);

app.use(errorHandler);
/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});