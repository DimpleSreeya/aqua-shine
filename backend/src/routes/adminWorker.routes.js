import express from "express";

import {
  createWorker,
  getWorkers,
  updateWorkerStatus,
} from "../controllers/adminWorker.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router =
  express.Router();

router.use(
  requireAuth,
  requireRole("ADMIN")
);

router.get(
  "/",
  getWorkers
);

router.post(
  "/",
  createWorker
);

router.patch(
  "/:id/status",
  updateWorkerStatus
);

export default router;