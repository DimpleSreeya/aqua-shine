import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum([
      "development",
      "test",
      "production",
    ])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5001),

  FRONTEND_URL: z
    .string()
    .url(),

  DATABASE_URL: z
    .string()
    .min(1),

  JWT_SECRET: z
    .string()
    .min(
      32,
      "JWT_SECRET must contain at least 32 characters"
    ),
});

const result =
  envSchema.safeParse(
    process.env
  );

if (!result.success) {
  console.error(
    "❌ Invalid environment configuration"
  );

  console.error(
    result.error.flatten()
      .fieldErrors
  );

  process.exit(1);
}

export const env =
  result.data;