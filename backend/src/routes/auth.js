import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "E-posta ve şifre gerekli." });
  }

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "E-posta veya şifre hatalı." });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "E-posta veya şifre hatalı." });

  const token = jwt.sign(
    { sub: user.id, role: user.role, name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, email, role, full_name FROM users WHERE id = $1",
    [req.user.sub]
  );
  if (!rows[0]) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  res.json({ id: rows[0].id, email: rows[0].email, role: rows[0].role, fullName: rows[0].full_name });
});
