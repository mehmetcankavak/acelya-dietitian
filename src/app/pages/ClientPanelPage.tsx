import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Leaf, LogOut, Weight, Flame, Calendar, TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { apiFetch, clearSession, getSession } from "../lib/api";

type PlanItem = { day_of_week: string; meal: string; description: string; calories: number };
type ProgressLog = { logged_at: string; weight: number | null; calories_consumed: number | null; notes: string | null };
type Appointment = { id: number; type: string; scheduled_at: string; duration_minutes: number };

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export default function ClientPanelPage() {
  const navigate = useNavigate();
  const user = getSession();
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [progress, setProgress] = useState<ProgressLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeDay, setActiveDay] = useState(DAYS[0]);
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/giris"); return; }
    Promise.all([
      apiFetch("/api/client/plan"),
      apiFetch("/api/client/progress"),
      apiFetch("/api/client/appointments"),
    ]).then(([p, pr, a]) => {
      setPlan(p);
      setProgress(pr);
      setAppointments(a);
    }).catch(err => setError(err.message));
  }, []);

  async function logProgress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const entry = await apiFetch("/api/client/progress", {
        method: "POST",
        body: JSON.stringify({
          weight: weight ? Number(weight) : undefined,
          caloriesConsumed: calories ? Number(calories) : undefined,
        }),
      });
      setProgress(p => [...p, entry]);
      setWeight("");
      setCalories("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt eklenemedi.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearSession();
    navigate("/");
  }

  const latestWeight = [...progress].reverse().find(p => p.weight != null)?.weight;
  const dayItems = plan.filter(p => p.day_of_week === activeDay);
  const chartData = progress.map(p => ({
    date: new Date(p.logged_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
    weight: p.weight,
  }));

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display font-semibold text-foreground leading-tight">Danışan Paneli</div>
            <div className="text-xs text-muted-foreground">{user?.fullName}</div>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" /> Çıkış
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Güncel Kilo</span>
            </div>
            <div className="font-display text-3xl font-semibold text-foreground">
              {latestWeight ?? "—"}<span className="text-base font-normal text-muted-foreground"> kg</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">Kayıt Sayısı</span>
            </div>
            <div className="font-display text-3xl font-semibold text-foreground">{progress.length}</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Yaklaşan Randevu</span>
            </div>
            <div className="text-sm text-foreground">
              {appointments[0]
                ? `${appointments[0].type} — ${new Date(appointments[0].scheduled_at).toLocaleDateString("tr-TR")}`
                : "Planlanmış randevu yok"}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Kilo İlerlemesi</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3D6B4F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3D6B4F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(61,107,79,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="weight" stroke="#3D6B4F" fill="url(#wGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <form onSubmit={logProgress} className="flex flex-wrap items-end gap-3 mt-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Kilo (kg)</label>
              <input value={weight} onChange={e => setWeight(e.target.value)} type="number" step="0.1" className="w-28 px-3 py-2 rounded-xl border border-border bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Kalori</label>
              <input value={calories} onChange={e => setCalories(e.target.value)} type="number" className="w-28 px-3 py-2 rounded-xl border border-border bg-background text-sm" />
            </div>
            <button disabled={saving} type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
              {saving ? "Kaydediliyor..." : "Kayıt Ekle"}
            </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Haftalık Beslenme Planım</h3>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeDay === day ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {day}
              </button>
            ))}
          </div>
          {dayItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bu gün için henüz plan girilmemiş.</p>
          ) : (
            <ul className="space-y-3">
              {dayItems.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-xs font-medium text-primary uppercase tracking-wide mb-0.5">{item.meal}</div>
                    <div className="text-sm text-foreground">{item.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{item.calories} kcal</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
