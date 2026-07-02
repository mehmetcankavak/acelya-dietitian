import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

async function upsertUser({ email, password, role, fullName }) {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, role, full_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id`,
    [email, hash, role, fullName]
  );
  return rows[0].id;
}

async function main() {
  const adminId = await upsertUser({
    email: "acelya@acelyacetin.com",
    password: "degistir123",
    role: "admin",
    fullName: "Açelya Çetin",
  });

  const clientId = await upsertUser({
    email: "danisan@ornek.com",
    password: "danisan123",
    role: "client",
    fullName: "Ayşe Kaya",
  });

  await pool.query(
    `INSERT INTO client_profiles (user_id, plan_type, target_weight, current_weight, status)
     VALUES ($1, 'Kilo Verme', 65, 72, 'Aktif')
     ON CONFLICT (user_id) DO NOTHING`,
    [clientId]
  );

  const meals = [
    ["Pazartesi", "Kahvaltı", "Yulaf ezmesi, yoğurt ve meyve", 380],
    ["Pazartesi", "Öğle", "Izgara tavuk salata", 520],
    ["Pazartesi", "Akşam", "Fırında somon, kinoa, brokoli", 620],
    ["Salı", "Kahvaltı", "Chia puding, yaban mersini", 360],
    ["Salı", "Öğle", "Mercimek çorbası, tam buğday ekmek", 480],
    ["Salı", "Akşam", "Sebzeli tavuk sote, esmer pirinç", 580],
  ];
  for (const [day, meal, desc, cal] of meals) {
    await pool.query(
      `INSERT INTO diet_plan_items (client_id, day_of_week, meal, description, calories)
       VALUES ($1, $2, $3, $4, $5)`,
      [clientId, day, meal, desc, cal]
    );
  }

  await pool.query(
    `INSERT INTO progress_logs (client_id, logged_at, weight, calories_consumed)
     VALUES ($1, CURRENT_DATE - INTERVAL '14 days', 74, 1900),
            ($1, CURRENT_DATE - INTERVAL '7 days', 73, 1850),
            ($1, CURRENT_DATE, 72, 1820)`,
    [clientId]
  );

  await pool.query(
    `INSERT INTO appointments (client_id, type, scheduled_at, duration_minutes)
     VALUES ($1, 'İlerleme Görüşmesi', now() + interval '3 days', 30)`,
    [clientId]
  );

  console.log("Seed tamamlandı.");
  console.log(`Admin girişi: acelya@acelyacetin.com / degistir123`);
  console.log(`Danışan girişi: danisan@ornek.com / danisan123`);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
