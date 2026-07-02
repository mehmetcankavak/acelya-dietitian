import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, LogOut, Users, Calendar, Plus, X } from "lucide-react";
import { apiFetch, clearSession, getSession } from "../lib/api";

type Client = {
  id: number; full_name: string; email: string; plan_type: string;
  target_weight: string | null; current_weight: string | null; status: string; joined_at: string;
};
type PlanItem = { id: number; day_of_week: string; meal: string; description: string; calories: number };
type Appointment = { id: number; type: string; scheduled_at: string; client_name: string };

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export default function AdminPanelPage() {
  const navigate = useNavigate();
  const user = getSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [error, setError] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newItem, setNewItem] = useState({ dayOfWeek: DAYS[0], meal: "Kahvaltı", description: "", calories: "" });

  useEffect(() => {
    if (!user) { navigate("/giris"); return; }
    loadClients();
    apiFetch("/api/admin/appointments").then(setAppointments).catch(err => setError(err.message));
  }, []);

  function loadClients() {
    apiFetch("/api/admin/clients").then(setClients).catch(err => setError(err.message));
  }

  function openClient(client: Client) {
    setSelected(client);
    apiFetch(`/api/admin/clients/${client.id}/plan`).then(setPlan).catch(err => setError(err.message));
  }

  async function addPlanItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !newItem.description) return;
    try {
      const item = await apiFetch(`/api/admin/clients/${selected.id}/plan`, {
        method: "POST",
        body: JSON.stringify({ ...newItem, calories: newItem.calories ? Number(newItem.calories) : 0 }),
      });
      setPlan(p => [...p, item]);
      setNewItem({ dayOfWeek: DAYS[0], meal: "Kahvaltı", description: "", calories: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eklenemedi.");
    }
  }

  async function removePlanItem(itemId: number) {
    await apiFetch(`/api/admin/plan-items/${itemId}`, { method: "DELETE" });
    setPlan(p => p.filter(i => i.id !== itemId));
  }

  function logout() {
    clearSession();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display font-semibold text-foreground leading-tight">Diyetisyen Paneli</div>
            <div className="text-xs text-muted-foreground">{user?.fullName}</div>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" /> Çıkış
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {error && <p className="text-sm text-red-600 lg:col-span-3">{error}</p>}

        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Danışanlar</h3>
            <button onClick={() => setShowNewClient(true)} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Plus className="w-3.5 h-3.5" /> Yeni Danışan
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                  <th className="pb-2 pr-4">İsim</th>
                  <th className="pb-2 pr-4">Plan</th>
                  <th className="pb-2 pr-4">Kilo</th>
                  <th className="pb-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => openClient(c)}
                    className={`cursor-pointer border-b border-border last:border-0 hover:bg-secondary transition-colors ${selected?.id === c.id ? "bg-secondary" : ""}`}
                  >
                    <td className="py-2.5 pr-4 font-medium text-foreground">{c.full_name}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{c.plan_type}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{c.current_weight ?? "—"} → {c.target_weight ?? "—"} kg</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{c.status}</span>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Henüz danışan yok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Randevular</h3>
          <ul className="space-y-3">
            {appointments.map(a => (
              <li key={a.id} className="text-sm border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="font-medium text-foreground">{a.client_name}</div>
                <div className="text-xs text-muted-foreground">{a.type} — {new Date(a.scheduled_at).toLocaleString("tr-TR")}</div>
              </li>
            ))}
            {appointments.length === 0 && <p className="text-sm text-muted-foreground">Randevu yok.</p>}
          </ul>
        </div>

        {selected && (
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{selected.full_name} — Beslenme Planı</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.map(item => (
                <li key={item.id} className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0">
                  <div className="text-sm">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide mr-2">{item.day_of_week} · {item.meal}</span>
                    <span className="text-foreground">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.calories} kcal</span>
                    <button onClick={() => removePlanItem(item.id)} className="text-muted-foreground hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </li>
              ))}
              {plan.length === 0 && <p className="text-sm text-muted-foreground">Henüz plan girilmemiş.</p>}
            </ul>
            <form onSubmit={addPlanItem} className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Gün</label>
                <select value={newItem.dayOfWeek} onChange={e => setNewItem(n => ({ ...n, dayOfWeek: e.target.value }))} className="px-3 py-2 rounded-xl border border-border bg-background text-sm">
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Öğün</label>
                <select value={newItem.meal} onChange={e => setNewItem(n => ({ ...n, meal: e.target.value }))} className="px-3 py-2 rounded-xl border border-border bg-background text-sm">
                  {["Kahvaltı", "Öğle", "Ara Öğün", "Akşam"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1 flex-1 min-w-[200px]">
                <label className="text-xs text-muted-foreground">Açıklama</label>
                <input value={newItem.description} onChange={e => setNewItem(n => ({ ...n, description: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" placeholder="Örn. Izgara tavuk, sebze" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Kalori</label>
                <input value={newItem.calories} onChange={e => setNewItem(n => ({ ...n, calories: e.target.value }))} type="number" className="w-24 px-3 py-2 rounded-xl border border-border bg-background text-sm" />
              </div>
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Ekle</button>
            </form>
          </div>
        )}
      </main>

      {showNewClient && (
        <NewClientModal onClose={() => setShowNewClient(false)} onCreated={() => { setShowNewClient(false); loadClients(); }} />
      )}
    </div>
  );
}

function NewClientModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", targetWeight: "", currentWeight: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/admin/clients", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
          currentWeight: form.currentWeight ? Number(form.currentWeight) : undefined,
        }),
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
      <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Yeni Danışan</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <input required placeholder="Ad Soyad" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
        <input required type="email" placeholder="E-posta" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
        <input required type="password" placeholder="Geçici şifre" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
        <div className="flex gap-3">
          <input placeholder="Güncel kilo" type="number" value={form.currentWeight} onChange={e => setForm(f => ({ ...f, currentWeight: e.target.value }))} className="w-1/2 px-3 py-2 rounded-xl border border-border bg-background text-sm" />
          <input placeholder="Hedef kilo" type="number" value={form.targetWeight} onChange={e => setForm(f => ({ ...f, targetWeight: e.target.value }))} className="w-1/2 px-3 py-2 rounded-xl border border-border bg-background text-sm" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={saving} type="submit" className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Oluşturuluyor..." : "Danışan Oluştur"}
        </button>
      </form>
    </div>
  );
}
