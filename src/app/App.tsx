import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  Leaf, Menu, X, CheckCircle2, Star, ArrowRight, TrendingUp, Clock, Phone, Instagram, Mail,
} from "lucide-react";
import LoginPage from "./pages/LoginPage";
import ClientPanelPage from "./pages/ClientPanelPage";
import AdminPanelPage from "./pages/AdminPanelPage";

// ─── Shared Components ────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warn" | "muted" }) {
  const cls = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warn: "bg-amber-100 text-amber-700",
    muted: "bg-muted text-muted-foreground",
  }[variant];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
}

function Btn({ children, variant = "primary", size = "md", onClick, href, className = "" }: {
  children: React.ReactNode; variant?: "primary" | "outline" | "ghost"; size?: "sm" | "md" | "lg"; onClick?: () => void; href?: string; className?: string;
}) {
  const base = "inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
    outline: "border border-border text-foreground hover:bg-secondary bg-card",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

const WHATSAPP_URL = "https://wa.me/905514140961?text=Merhaba%2C%20%C3%BCcretsiz%20g%C3%B6r%C3%BC%C5%9Fme%20i%C3%A7in%20randevu%20almak%20istiyorum.";

const NAV_LINKS = [
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Sonuçlar", href: "#sonuclar" },
  { label: "Blog", href: "#blog" },
  { label: "Hakkımda", href: "#hakkimda" },
];

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block font-display text-xl font-semibold text-foreground tracking-tight">Açelya Çetin</span>
              <span className="block text-[11px] text-muted-foreground/70 tracking-wide">Diyetisyen &amp; Fizyoterapist</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            {/* Giriş Yap: backend henüz canlı değil, hazır olunca geri aç */}
            <Btn size="sm" href={WHATSAPP_URL}>Ücretsiz Görüşme Ayırt</Btn>
          </div>
          <button
            className="md:hidden inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-foreground border border-border rounded-full px-3.5 py-1.5"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-3.5 h-3.5" /> Menu
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`md:hidden fixed inset-0 z-[100] bg-foreground text-background transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Açelya Çetin</span>
          </div>
          <button
            className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase border border-background/30 rounded-full px-3.5 py-1.5"
            onClick={() => setMenuOpen(false)}
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>

        <nav className="flex flex-col justify-center h-[calc(100%-140px)] px-8 gap-2">
          {NAV_LINKS.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-baseline gap-4 py-3 border-b border-background/10"
            >
              <span className="font-mono text-xs text-background/40">0{i + 1}</span>
              <span className="font-display text-4xl font-normal group-hover:text-primary transition-colors">{label}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 px-8 pb-10 space-y-3">
          {/* Giriş Yap: backend henüz canlı değil, hazır olunca geri aç */}
          <Btn href={WHATSAPP_URL} size="lg" className="w-full justify-center">
            Ücretsiz Görüşme Ayırt <ArrowRight className="w-4 h-4" />
          </Btn>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-accent/30 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Leaf className="w-3.5 h-3.5" /> Bilime dayalı beslenme danışmanlığı
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-normal leading-[1.1] text-foreground">
            Sınırlar koyma,<br />
            <em className="text-primary">dengeyi</em> keşfet.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            Uzman diyetisyen ve fizyoterapist Açelya Çetin ile kişiye özel beslenme planları. Hedeflerine ulaşmak için ihtiyacın olan takip ve destek tek bir yerde.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn size="lg" href={WHATSAPP_URL}>
              Ücretsiz Görüşme Ayırt <ArrowRight className="w-4 h-4" />
            </Btn>
            <Btn variant="outline" size="lg">Nasıl Çalışır?</Btn>
          </div>
          <div className="flex items-center gap-6 pt-2">
            {[["500+", "Danışan"], ["%98", "Memnuniyet Oranı"], ["4.9★", "Ortalama Puan"]].map(([num, label]) => (
              <div key={label}>
                <div className="font-display text-2xl font-semibold text-foreground">{num}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-accent/20">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=750&fit=crop&auto=format"
              alt="Sağlıklı hazır yemek kapları"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-lg border border-border w-48">
            <div className="text-xs text-muted-foreground mb-1">Günlük Hedef</div>
            <div className="font-semibold text-foreground text-sm">1.900 kcal</div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "72%" }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">%72 tamamlandı</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-card rounded-2xl p-4 shadow-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">İlerleme</span>
            </div>
            <div className="text-2xl font-display font-semibold text-primary">−4,2 kg</div>
            <div className="text-xs text-muted-foreground">6 haftada</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="hizmetler" className="scroll-mt-24 bg-card border-y border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Neler Sunuyoruz</p>
            <h2 className="font-display text-4xl text-foreground">Hizmetler & Paketler</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Leaf className="w-5 h-5" />, title: "Kişiye Özel Beslenme Planı",
                price: "₺999/ay", desc: "Hedeflerine, tercihlerine ve yaşam tarzına göre hazırlanan, aylık güncellenen haftalık beslenme planları.",
                features: ["7 günlük dönüşümlü menüler", "Alışveriş listesi dahil", "Kültürel tercihler gözetilir", "Aylık güncelleme"],
              },
              {
                icon: <TrendingUp className="w-5 h-5" />, title: "Online Danışmanlık",
                price: "₺1.499/ay", desc: "Uzman diyetisyen ile birebir görüşmeler, sürekli mesajlaşma desteği ve ilerleme takibi.",
                features: ["Ayda 2 görüntülü görüşme", "Sınırsız mesajlaşma", "Haftalık kontrol", "İlerleme analizi"], featured: true,
              },
              {
                icon: <Star className="w-5 h-5" />, title: "Fizyoterapi Destekli Program",
                price: "₺2.199/ay", desc: "Beslenme danışmanlığı ve fizyoterapi desteğini bir arada sunan kapsamlı 3 aylık dönüşüm programı.",
                features: ["Danışmanlık paketinin tümü", "Fizyoterapi değerlendirmesi", "Egzersiz & yaşam tarzı planı", "Öncelikli destek"],
              },
            ].map(({ icon, title, price, desc, features, featured }) => (
              <div key={title} className={`rounded-2xl p-8 border transition-shadow hover:shadow-lg ${featured ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${featured ? "bg-white/20" : "bg-accent/40 text-primary"}`}>
                  {icon}
                </div>
                <div className={`text-sm font-medium mb-1 ${featured ? "text-white/70" : "text-muted-foreground"}`}>{title}</div>
                <div className={`font-display text-3xl mb-4 ${featured ? "text-white" : "text-foreground"}`}>{price}</div>
                <p className={`text-sm mb-6 leading-relaxed ${featured ? "text-white/80" : "text-muted-foreground"}`}>{desc}</p>
                <ul className="space-y-2 mb-8">
                  {features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${featured ? "text-white/90" : "text-foreground"}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${featured ? "text-white/60" : "text-primary"}`} /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${featured ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"}`}>
                  Başlayın
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="sonuclar" className="scroll-mt-24 py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Başarı Hikayeleri</p>
          <h2 className="font-display text-4xl text-foreground">Gerçek dönüşümler,<br /><em>gerçek sonuçlar.</em></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Elif T.", result: "4 ayda −18 kg", plan: "Fizyoterapi Destekli Program", quote: "Açelya Hanım'la beslenme alışkanlıklarım tamamen değişti. Planlar hiç kısıtlayıcı hissettirmedi.", rating: 5, img: "photo-1438761681033-6461ffad8d80" },
            { name: "Kerem A.", result: "+8 kg kas kütlesi", plan: "Online Danışmanlık", quote: "Sadece 6 haftada spor performansım ciddi şekilde arttı. Beslenme yönlendirmesi harikaydı.", rating: 5, img: "photo-1507003211169-0a1dd7228f2d" },
            { name: "Defne M.", result: "Kolesterol normale döndü", plan: "Kişiye Özel Beslenme Planı", quote: "Yıllarca uğraştıktan sonra sonunda yaşam tarzıma uygun bir plan buldum. Doktorum bile şaşırdı.", rating: 5, img: "photo-1544005313-94ddf0286df2" },
          ].map(({ name, result, plan, quote, rating, img }) => (
            <div key={name} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {Array(rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6 italic">"{quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <img src={`https://images.unsplash.com/photo-${img}?w=80&h=80&fit=crop&auto=format`} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{plan}</div>
                  </div>
                </div>
                <Badge variant="success">{result}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="scroll-mt-24 bg-secondary py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Beslenme İpuçları</p>
              <h2 className="font-display text-4xl text-foreground">Blogdan</h2>
            </div>
            <a href="#" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Tümünü gör <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tag: "Kilo Verme", title: "Şok diyetler neden işe yaramaz — peki ne işe yarar?", mins: 5, img: "photo-1512621776951-a57141f2eefd" },
              { tag: "Bağırsak Sağlığı", title: "Mikrobiyomumu değiştiren 10 besin", mins: 7, img: "photo-1490645935967-10de6ba17061" },
              { tag: "Spor Beslenmesi", title: "Antrenman öncesi ve sonrası beslenme: kesin rehber", mins: 9, img: "photo-1547592180-85f173990554" },
            ].map(({ tag, title, mins, img }) => (
              <div key={title} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={`https://images.unsplash.com/photo-${img}?w=500&h=280&fit=crop&auto=format`}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <Badge variant="default">{tag}</Badge>
                  <h3 className="font-display text-lg text-foreground mt-3 mb-2 leading-snug">{title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {mins} dk okuma
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="hakkimda" className="scroll-mt-24 py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-accent/20">
          <img
            src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=750&fit=crop&auto=format"
            alt="Açelya Çetin"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <p className="text-sm text-primary font-medium tracking-widest uppercase">Hakkımda</p>
          <h2 className="font-display text-4xl text-foreground">Merhaba, ben Açelya Çetin.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Diyetisyenlik ve fizyoterapi alanlarında çift ana dal eğitimimi sürdürüyorum. Beslenme ve hareketi bir arada ele alarak, danışanlarıma sürdürülebilir ve kişiye özel çözümler sunmayı hedefliyorum.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Amacım kısıtlayıcı diyetler değil, yaşam tarzına uyum sağlayan, bilime dayalı ve uzun vadede sonuç veren bir yaklaşım sunmak.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-6xl mx-auto px-6 text-center">
        <div className="bg-primary rounded-3xl px-8 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative">
            <h2 className="font-display text-4xl text-white mb-4">Yolculuğuna bugün başla.</h2>
            <p className="text-white/75 text-lg mb-8 max-w-md mx-auto">Ücretsiz 30 dakikalık görüşme ayırt, 48 saat içinde kişiye özel planını al.</p>
            <Btn size="lg" variant="outline" href={WHATSAPP_URL} className="bg-white text-primary border-white hover:bg-white/90 hover:text-primary mx-auto">
              Ücretsiz Görüşme Ayırt <ArrowRight className="w-4 h-4" />
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Leaf className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-foreground">Açelya Çetin</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4">
          <a href="tel:+905514140961" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Phone className="w-3.5 h-3.5" /> 0551 414 09 61
          </a>
          <span className="hidden sm:inline text-border">•</span>
          <a href="https://instagram.com/dyt.acelyacetin" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Instagram className="w-3.5 h-3.5" /> @dyt.acelyacetin
          </a>
          <span className="hidden sm:inline text-border">•</span>
          <a href="mailto:dytacelyacetin@hotmail.com" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail className="w-3.5 h-3.5" /> dytacelyacetin@hotmail.com
          </a>
        </div>
        <p>© 2026 Açelya Çetin. Tüm hakları saklıdır. Bilime dayalı beslenme ile daha sağlıklı bir yaşam.</p>
      </footer>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" } as React.CSSProperties}>
        <style>{`
          .font-display { font-family: 'DM Serif Display', serif; }
          .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
          .font-mono { font-family: 'DM Mono', monospace; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(61,107,79,0.2); border-radius: 9999px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(61,107,79,0.4); }
          * { scrollbar-width: thin; scrollbar-color: rgba(61,107,79,0.2) transparent; }
        `}</style>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/giris" element={<LoginPage />} />
          <Route path="/panel" element={<ClientPanelPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
