import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

/*
|--------------------------------------------------------------------------
| USER REGISTRATION
|--------------------------------------------------------------------------
*/

export const register = async (req, res) => {
  try {
    const validationResult =
      registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      name,
      email,
      password,
      phone,
      location,
    } = validationResult.data;

    const normalizedEmail =
      email.toLowerCase();

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const user =
      await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
          phone,
          location,
          role: "USER",
          isActive: true,
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

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account",
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const login = async (req, res) => {
  try {
    const validationResult =
      loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      email,
      password,
    } = validationResult.data;

    const normalizedEmail =
      email.toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently inactive",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie(
      "accessToken",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        maxAge:
          24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

export const adminLogin = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. Validate email and password
    |--------------------------------------------------------------------------
    */

    const validationResult =
      loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details",
        errors:
          validationResult.error
            .flatten()
            .fieldErrors,
      });
    }

    const {
      email,
      password,
    } = validationResult.data;

    const normalizedEmail =
      email.toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | 2. Find account
    |--------------------------------------------------------------------------
    */

    const user =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Account must be active
    |--------------------------------------------------------------------------
    */

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently inactive",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Check ADMIN role
    |--------------------------------------------------------------------------
    */

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message:
          "This account does not have admin access",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Check password
    |--------------------------------------------------------------------------
    */

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Create JWT
    |--------------------------------------------------------------------------
    */

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    /*
    |--------------------------------------------------------------------------
    | 7. Store cookie
    |--------------------------------------------------------------------------
    */

    res.cookie(
      "accessToken",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        maxAge:
          24 * 60 * 60 * 1000,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | 8. Safe admin response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message:
        "Admin login successful",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login as admin",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CURRENT LOGGED-IN USER
|--------------------------------------------------------------------------
*/

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const logout = async (req, res) => {
  res.clearCookie(
    "accessToken",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",
    }
  );

  return res.status(200).json({
    success: true,
    message:
      "Logged out successfully",
  });
};