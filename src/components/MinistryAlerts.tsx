import { AlertTriangle, UserPlus, CalendarX, CreditCard } from "lucide-react";

const alerts = [
  {
    icon: UserPlus,
    title: "New Member Follow-up",
    desc: "Sarah Johnson — visited 2 weeks ago",
    time: "2h ago",
    type: "warning" as const,
  },
  {
    icon: CalendarX,
    title: "Room Booking Conflict",
    desc: "Fellowship Hall — Mar 22, 10am-12pm",
    time: "5h ago",
    type: "destructive" as const,
  },
  {
    icon: CreditCard,
    title: "Subscription Renewal",
    desc: "Pro plan expires in 5 days",
    time: "1d ago",
    type: "warning" as const,
  },
  {
    icon: AlertTriangle,
    title: "Pledge Shortfall",
    desc: "Building fund below target by $12K",
    time: "2d ago",
    type: "destructive" as const,
  },
];

const queueItems = [
  { label: "Active", value: 4, color: "text-trend-up" },
  { label: "Pending", value: 5, color: "text-warning" },
];

export function MinistryAlerts() {
  return (
    <aside className="w-[300px] h-screen border-l bg-card flex flex-col shrink-0">
      <div className="p-5 border-b flex items-center justify-between">
        <h3 className="font-bold text-sm">Ministry Alerts</h3>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-destructive font-medium">LIVE</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {["Alerts", "Queue", "Stats"].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              i === 0
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Queue summary */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {queueItems.map((q) => (
          <div key={q.label} className="text-center py-3 rounded-xl bg-accent">
            <p className={`text-2xl font-bold ${q.color}`}>{q.value}</p>
            <p className="text-[11px] text-muted-foreground font-medium tracking-wider mt-0.5">
              {q.label.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wider">
          URGENT TASKS
        </p>
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border ${
              alert.type === "destructive"
                ? "border-destructive/30 bg-destructive/5"
                : "border-warning/30 bg-warning/5"
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <alert.icon className={`h-4 w-4 ${
                  alert.type === "destructive" ? "text-destructive" : "text-warning"
                }`} />
                <span className="text-sm font-semibold">{alert.title}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{alert.time}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">{alert.desc}</p>
          </div>
        ))}
        <button className="w-full text-center text-xs text-primary font-medium py-2 hover:underline">
          View All →
        </button>
      </div>
    </aside>
  );
}
