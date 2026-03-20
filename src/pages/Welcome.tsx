import { useNavigate } from "react-router-dom";
import { Church, Users, Heart, CalendarDays, BarChart3, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import loginBg from "@/assets/login-bg.jpg";

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
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-background/80 backdrop-blur border-b">
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

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={loginBg} alt="" className="w-full h-full object-cover opacity-20 blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-6 py-28 md:py-40">
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
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-6 pb-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-surface p-6 rounded-xl text-center space-y-3">
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
