import { useState } from "react";
import { AlertTriangle, UserPlus, CalendarX, CreditCard, TrendingUp, CheckCircle2, Clock } from "lucide-react";

type SidebarTab = "Alerts" | "Queue" | "Stats";

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

const pendingTasks = [
  { title: "Follow up with new visitor John Doe", priority: "high", due: "Today" },
  { title: "Confirm choir rehearsal room booking", priority: "medium", due: "Tomorrow" },
  { title: "Send welcome packet to Maria Chen", priority: "high", due: "Today" },
  { title: "Review volunteer applications (3)", priority: "low", due: "This week" },
  { title: "Update prayer request board", priority: "medium", due: "Tomorrow" },
];

const statsData = [
  { label: "Congregation Growth", value: "+12.4%", trend: "up" },
  { label: "Weekly Attendance", value: "78%", trend: "up" },
  { label: "Monthly Giving", value: "+8.1%", trend: "up" },
  { label: "Volunteer Retention", value: "92%", trend: "up" },
  { label: "New Visitors (MTD)", value: "47", trend: "down" },
  { label: "Active Small Groups", value: "18", trend: "up" },
];

interface MinistryAlertsProps {
  onNavigate?: (tab: "Overview" | "Members" | "Tithes" | "Events" | "Subscriptions") => void;
}

export function MinistryAlerts({ onNavigate }: MinistryAlertsProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("Alerts");

  const sidebarTabs: SidebarTab[] = ["Alerts", "Queue", "Stats"];

  const handleViewAll = () => {
    if (activeTab === "Alerts" || activeTab === "Queue") {
      onNavigate?.("Members");
    } else {
      onNavigate?.("Overview");
    }
  };

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
        {sidebarTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "Alerts" && (
          <>
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
            <div className="px-4 pb-4 space-y-3">
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
            </div>
          </>
        )}

        {activeTab === "Queue" && (
          <div className="px-4 py-4 space-y-3">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-wider">
              PENDING TASKS
            </p>
            {pendingTasks.map((task, i) => (
              <div key={i} className="p-3 rounded-xl border bg-accent/50 flex items-start gap-3">
                <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${
                  task.priority === "high" ? "text-destructive" :
                  task.priority === "medium" ? "text-warning" : "text-muted-foreground"
                }`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{task.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Due: {task.due}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Stats" && (
          <div className="px-4 py-4 space-y-3">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-wider">
              MINISTRY GROWTH
            </p>
            {statsData.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/50">
                <span className="text-sm text-foreground">{stat.label}</span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`h-3.5 w-3.5 ${
                    stat.trend === "up" ? "text-trend-up" : "text-trend-down"
                  }`} />
                  <span className={`text-sm font-bold ${
                    stat.trend === "up" ? "text-trend-up" : "text-trend-down"
                  }`}>
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View All */}
      <div className="border-t p-3">
        <button
          onClick={handleViewAll}
          className="w-full text-center text-xs text-primary font-medium py-2 hover:underline active:scale-[0.97] transition-transform"
        >
          {activeTab === "Stats" ? "View Full Analytics →" : "View All Members →"}
        </button>
      </div>
    </aside>
  );
}
