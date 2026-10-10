import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";

/*
|--------------------------------------------------------------------------
| REQUIRE LOGIN
|--------------------------------------------------------------------------
*/

export const requireAuth = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Please login to continue",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({
        success: false,
        message:
          "Your login session is invalid or expired",
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently inactive",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify authentication",
    });
  }
};

/*
|--------------------------------------------------------------------------
| REQUIRE ROLE
|--------------------------------------------------------------------------
*/

export const requireRole = (
  ...allowedRoles
) => {
  return (
    req,
    res,
    next
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource",
      });
    }

    next();
  };
};