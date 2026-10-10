import rateLimit from "express-rate-limit";

/*
|--------------------------------------------------------------------------
| AUTH RATE LIMITER
|--------------------------------------------------------------------------
|
| Protects login and registration routes
| from repeated automated requests.
|
*/

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 20,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});