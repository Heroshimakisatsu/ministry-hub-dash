import { UserPlus, Users, HandCoins, Send, Clock, UserCheck } from "lucide-react";

const quickActions = [
  { icon: UserCheck, label: "Record Attendance", color: "bg-purple-500/10 text-purple-500", id: "record-attendance" },
  { icon: HandCoins, label: "Record Finance", color: "bg-amber-500/10 text-amber-500", id: "record-offering" },
  { icon: Users, label: "Register Visitor", color: "bg-emerald-500/10 text-emerald-500", id: "register-visitor" },
  { icon: UserPlus, label: "Register Member", color: "bg-primary/10 text-primary", id: "register-member" },
  { icon: Send, label: "Send Broadcast", color: "bg-sky-500/10 text-sky-500", id: "send-broadcast" },
];

const recentActivity = [
  { text: "New visitor Maria Garcia registered", time: "2 min ago", dot: "bg-emerald-500" },
  { text: "Tithe of $500 recorded from David Kim", time: "15 min ago", dot: "bg-primary" },
  { text: "Youth Ministry event updated", time: "1 hr ago", dot: "bg-amber-500" },
  { text: "Sarah Johnson joined Worship Team", time: "3 hrs ago", dot: "bg-sky-500" },
  { text: "Sunday Service attendance: 342", time: "Yesterday", dot: "bg-muted-foreground" },
];

interface AdminQuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export function AdminQuickActions({ onActionClick }: AdminQuickActionsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Quick Actions */}
      <div className="card-surface p-5">
        <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onActionClick?.(action.id)}
              className="flex items-center gap-3 p-4 rounded-xl border hover:bg-accent/50 transition-colors text-left flex-[1_0_calc(50%-6px)] min-w-[140px]"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
