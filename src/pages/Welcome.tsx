import { useNavigate } from "react-router-dom";
import { Church, Users, Heart, CalendarDays, BarChart3, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import welcomeBg from "@/assets/welcome-bg.jpg";

const features = [
  { icon: Users, title: "Member Directory", desc: "Track and manage your entire congregation effortlessly." },
  { icon: Heart, title: "Tithes & Giving", desc: "Monitor donations, pledges, and fund allocation in real time." },
  { icon: CalendarDays, title: "Event Calendar", desc: "Plan services, community events, and room bookings." },
  { icon: BarChart3, title: "Growth Analytics", desc: "Visualize attendance trends and ministry health." },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav — glassmorphism */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <Church className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">FaithFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate("/login")}
            className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero with full-bleed background */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={welcomeBg} alt="" className="w-full h-full object-cover" />
          {/* Light mode: 40% white overlay / Dark mode: 60% black overlay */}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60" />
          {/* Gradient fade to background at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-6 py-28 md:py-40">
          {/* Glassmorphism hero card */}
          <div className="inline-block bg-card/30 dark:bg-card/20 backdrop-blur-2xl border border-border/30 rounded-2xl px-8 py-12 md:px-14 md:py-16 shadow-2xl">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
              Church Management System
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Managing Ministry<br />with <span className="text-primary">Grace</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Manage members, track giving, plan events, and grow your congregation — all in one beautifully designed platform.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-6 pb-28 pt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card/70 dark:bg-card/50 backdrop-blur-lg border border-border/50 p-6 rounded-xl text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © 2026 FaithFlow. All rights reserved.
      </footer>
    </div>
  );
}
