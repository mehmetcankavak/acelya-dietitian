import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const clientRouter = Router();

clientRouter.use(requireAuth, requireRole("client"));

clientRouter.get("/plan", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT day_of_week, meal, description, calories
     FROM diet_plan_items WHERE client_id = $1
     ORDER BY id`,
    [req.user.sub]
  );
  res.json(rows);
});

clientRouter.get("/progress", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT logged_at, weight, calories_consumed, notes
     FROM progress_logs WHERE client_id = $1
     ORDER BY logged_at ASC`,
    [req.user.sub]
  );
  res.json(rows);
});

clientRouter.post("/progress", async (req, res) => {
  const { weight, caloriesConsumed, notes } = req.body || {};
  const { rows } = await pool.query(
    `INSERT INTO progress_logs (client_id, weight, calories_consumed, notes)
     VALUES ($1, $2, $3, $4) RETURNING logged_at, weight, calories_consumed, notes`,
    [req.user.sub, weight ?? null, caloriesConsumed ?? null, notes ?? null]
  );
  res.status(201).json(rows[0]);
});

clientRouter.get("/appointments", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, type, scheduled_at, duration_minutes, notes
     FROM appointments WHERE client_id = $1
     ORDER BY scheduled_at ASC`,
    [req.user.sub]
  );
  res.json(rows);
});
