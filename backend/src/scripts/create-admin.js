import "dotenv/config";
import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";

const createAdmin = async () => {
  try {
    const name =
      process.env.ADMIN_NAME?.trim();

    const email =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      console.error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
      );

      process.exit(1);
    }

    if (password.length < 8) {
      console.error(
        "Admin password must contain at least 8 characters"
      );

      process.exit(1);
    }

    if (password.length > 72) {
      console.error(
        "Admin password is too long"
      );

      process.exit(1);
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      console.error(
        "An account with this email already exists"
      );

      process.exit(1);
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const admin =
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,

          role: "ADMIN",
          isActive: true,

          phone: null,
          location: null,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

    console.log(
      "Admin created successfully:"
    );

    console.log(admin);
  } catch (error) {
    console.error(
      "Create admin error:",
      error
    );

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();