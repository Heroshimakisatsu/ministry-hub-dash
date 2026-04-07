import { Clock, Play, HandCoins, MessageSquareHeart, CalendarCheck, QrCode, Bell, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

function getNextSunday() {
  const now = new Date();
  const daysUntil = (7 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntil);
  next.setHours(9, 0, 0, 0);
  return next;
}

function useCountdown() {
  const [diff, setDiff] = useState(() => getNextSunday().getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(getNextSunday().getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

const sermons = [
  { title: "Walking in Faith", pastor: "Pastor Marcus", date: "Mar 30", type: "Video" },
  { title: "The Power of Prayer", pastor: "Pastor Marcus", date: "Mar 23", type: "Audio" },
  { title: "Grace Abounding", pastor: "Elder Ruth", date: "Mar 16", type: "Video" },
];

const projects = [
  { name: "Building Fund", raised: 45000, goal: 100000, color: "bg-primary" },
  { name: "Mission Trip", raised: 8200, goal: 12000, color: "bg-emerald-500" },
  { name: "Youth Camp", raised: 3100, goal: 5000, color: "bg-amber-500" },
];

const announcements = [
  { title: "Easter Service Schedule", date: "Apr 1", urgent: true },
  { title: "Women's Fellowship this Saturday", date: "Apr 5", urgent: false },
  { title: "New Small Group sign-ups open", date: "Apr 3", urgent: false },
  { title: "Church clean-up day volunteers needed", date: "Apr 12", urgent: false },
];

const communityActions = [
  { icon: MessageSquareHeart, label: "Prayer Request", color: "bg-primary/10 text-primary" },
  { icon: CalendarCheck, label: "Book Counseling", color: "bg-emerald-500/10 text-emerald-500" },
  { icon: QrCode, label: "QR Check-in", color: "bg-amber-500/10 text-amber-500" },
];

export function MemberDashboard() {
  const countdown = useCountdown();

  return (
    <div className="space-y-6">
      {/* Row 1: Countdown + Giving */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Service Countdown */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Next Service Countdown</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Sunday Worship Service • 9:00 AM</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: countdown.d, label: "Days" },
              { val: countdown.h, label: "Hours" },
              { val: countdown.m, label: "Mins" },
              { val: countdown.s, label: "Secs" },
            ].map((u) => (
              <div key={u.label} className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-2xl font-bold text-primary tabular-nums">{String(u.val).padStart(2, "0")}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">{u.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pay Tithe / Offering */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <HandCoins className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Giving Portal</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="p-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              Pay Tithe
            </button>
            <button className="p-3 rounded-xl border text-sm font-semibold hover:bg-accent transition-colors">
              Give Offering
            </button>
          </div>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">
                    ${p.raised.toLocaleString()} / ${p.goal.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color}`}
                    style={{ width: `${(p.raised / p.goal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Sermon Media + Community */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sermon Media */}
        <div className="lg:col-span-2 card-surface p-5">
          <h3 className="text-sm font-semibold mb-4">Sermon Media</h3>
          <div className="space-y-3">
            {sermons.map((s) => (
              <div key={s.title} className="flex items-center gap-4 p-3 rounded-xl border hover:bg-accent/50 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.pastor} • {s.date}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {s.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Actions */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold mb-4">Community</h3>
          <div className="space-y-3">
            {communityActions.map((a) => (
              <button
                key={a.label}
                className="w-full flex items-center gap-3 p-4 rounded-xl border hover:bg-accent/50 transition-colors text-left"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${a.color}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium flex-1">{a.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Announcements */}
      <div className="card-surface p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Branch Announcements</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {announcements.map((a) => (
            <div
              key={a.title}
              className={`p-4 rounded-xl border transition-colors hover:bg-accent/50 ${
                a.urgent ? "border-amber-500/30 bg-amber-500/5" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{a.title}</p>
                {a.urgent && (
                  <span className="text-[10px] font-semibold uppercase bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
