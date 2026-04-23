import {
  Settings,
  Church,
  Users,
  LayoutDashboard,
  Building2,
  CalendarDays,
  BookOpen,
  Heart,
  DollarSign,
  Target,
  CreditCard,
  Megaphone,
  Package,
  Shield,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navGroups = [
  {
    label: "MINISTRY",
    items: [
      { icon: LayoutDashboard, label: "Overview", id: "overview" },
      { icon: Users, label: "Member Directory", id: "members" },
      { icon: Building2, label: "Departments", id: "departments" },
      { icon: CalendarDays, label: "Events & Calendar", id: "events" },
      { icon: BookOpen, label: "Church Records", id: "church-records" },
      { icon: Heart, label: "Welfare & Counseling", id: "welfare" },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { icon: DollarSign, label: "Finance & Offering", id: "tithes" },
      { icon: Target, label: "Projects & Fundraising", id: "fundraising" },
      { icon: CreditCard, label: "Online Giving", id: "online-giving" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { icon: Megaphone, label: "Communications", id: "communications" },
      { icon: Package, label: "Asset & Inventory", id: "assets" },
      { icon: Shield, label: "Access Control", id: "access" },
      { icon: BarChart3, label: "Reports & Analytics", id: "analytics" },
      { icon: GitBranch, label: "Multi-Branch", id: "multi-branch" },
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
      <nav className="flex-1 px-3 space-y-4 mt-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="font-semibold text-muted-foreground tracking-wider px-3 mb-2 text-[11px]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"} w-full`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
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
