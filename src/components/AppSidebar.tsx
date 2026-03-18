import {
  Users,
  Heart,
  CalendarDays,
  BarChart3,
  Settings,
  Church,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navGroups = [
  {
    label: "MINISTRY",
    items: [
      { icon: Users, label: "Member Directory", id: "members" },
      { icon: Heart, label: "Tithes & Giving", id: "tithes" },
      { icon: CalendarDays, label: "Event Calendar", id: "events" },
      { icon: BarChart3, label: "Growth Analytics", id: "analytics" },
    ],
  },
  {
    label: "CONFIG",
    items: [{ icon: Settings, label: "Settings", id: "settings" }],
  },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="w-64 h-screen flex flex-col bg-card border-r shrink-0">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
          <Church className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">FaithFlow</h1>
          <p className="text-xs text-muted-foreground">MINISTRY CENTER</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-6 mt-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold text-muted-foreground tracking-wider px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={
                    activeTab === item.id
                      ? "sidebar-nav-item-active w-full"
                      : "sidebar-nav-item w-full"
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
            PM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Pastor Marcus</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
