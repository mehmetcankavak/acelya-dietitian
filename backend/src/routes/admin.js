import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/clients", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.full_name, u.email, cp.plan_type, cp.target_weight,
            cp.current_weight, cp.status, cp.joined_at
     FROM users u
     JOIN client_profiles cp ON cp.user_id = u.id
     WHERE u.role = 'client'
     ORDER BY u.id`
  );
  res.json(rows);
});

adminRouter.post("/clients", async (req, res) => {
  const { email, password, fullName, planType, targetWeight, currentWeight } = req.body || {};
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "E-posta, şifre ve isim gerekli." });
  }
  const hash = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO users (email, password_hash, role, full_name)
       VALUES ($1, $2, 'client', $3) RETURNING id`,
      [email, hash, fullName]
    );
    const userId = rows[0].id;
    await client.query(
      `INSERT INTO client_profiles (user_id, plan_type, target_weight, current_weight)
       VALUES ($1, $2, $3, $4)`,
      [userId, planType || "Kilo Verme", targetWeight ?? null, currentWeight ?? null]
    );
    await client.query("COMMIT");
    res.status(201).json({ id: userId });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      return res.status(409).json({ error: "Bu e-posta zaten kayıtlı." });
    }
    throw err;
  } finally {
    client.release();
  }
});

adminRouter.get("/clients/:id/plan", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, day_of_week, meal, description, calories
     FROM diet_plan_items WHERE client_id = $1 ORDER BY id`,
    [req.params.id]
  );
  res.json(rows);
});

adminRouter.post("/clients/:id/plan", async (req, res) => {
  const { dayOfWeek, meal, description, calories } = req.body || {};
  if (!dayOfWeek || !meal || !description) {
    return res.status(400).json({ error: "Gün, öğün ve açıklama gerekli." });
  }
  const { rows } = await pool.query(
    `INSERT INTO diet_plan_items (client_id, day_of_week, meal, description, calories)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, day_of_week, meal, description, calories`,
    [req.params.id, dayOfWeek, meal, description, calories ?? 0]
  );
  res.status(201).json(rows[0]);
});

adminRouter.delete("/plan-items/:itemId", async (req, res) => {
  await pool.query("DELETE FROM diet_plan_items WHERE id = $1", [req.params.itemId]);
  res.status(204).end();
});

adminRouter.get("/appointments", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT a.id, a.type, a.scheduled_at, a.duration_minutes, u.full_name AS client_name
     FROM appointments a
     JOIN users u ON u.id = a.client_id
     ORDER BY a.scheduled_at ASC`
  );
  res.json(rows);
});
