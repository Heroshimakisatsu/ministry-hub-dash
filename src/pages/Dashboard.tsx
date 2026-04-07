import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCards } from "@/components/StatCards";
import { GivingChart, FundAllocationChart } from "@/components/Charts";
import { MinistryAlerts } from "@/components/MinistryAlerts";
import { MemberList } from "@/components/MemberList";
import { TithesTable } from "@/components/TithesTable";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { AdminQuickActions } from "@/components/AdminQuickActions";
import { MemberDashboard } from "@/components/MemberDashboard";

const adminTabs = ["Overview", "Members", "Tithes", "Events", "Subscriptions"] as const;
const memberTabs = ["Home", "Sermons", "Giving", "Events"] as const;

type AdminTab = (typeof adminTabs)[number];
type MemberTab = (typeof memberTabs)[number];

const sidebarToAdminTab: Record<string, AdminTab> = {
  members: "Members",
  tithes: "Tithes",
  events: "Events",
  analytics: "Overview",
  settings: "Subscriptions",
};

export default function Dashboard() {
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [adminTab, setAdminTab] = useState<AdminTab>("Overview");
  const [memberTab, setMemberTab] = useState<MemberTab>("Home");
  const [sidebarTab, setSidebarTab] = useState("analytics");

  const handleSidebarChange = (id: string) => {
    setSidebarTab(id);
    if (role === "admin") {
      const mapped = sidebarToAdminTab[id];
      if (mapped) setAdminTab(mapped);
    }
  };

  const tabs = role === "admin" ? adminTabs : memberTabs;
  const activeTab = role === "admin" ? adminTab : memberTab;
  const setActiveTab = (t: string) => {
    if (role === "admin") setAdminTab(t as AdminTab);
    else setMemberTab(t as MemberTab);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar activeTab={sidebarTab} onTabChange={handleSidebarChange} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader role={role} onRoleChange={setRole} />

        {/* Tabs */}
        <div className="border-b bg-card px-6">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {role === "admin" ? (
            <>
              {adminTab === "Overview" && (
                <>
                  <StatCards />
                  <AdminQuickActions />
                  <div className="flex gap-4">
                    <GivingChart />
                    <FundAllocationChart />
                  </div>
                  <MemberList />
                </>
              )}
              {adminTab === "Members" && <MemberList />}
              {adminTab === "Tithes" && (
                <>
                  <StatCards />
                  <TithesTable />
                </>
              )}
              {adminTab === "Events" && (
                <div className="card-surface p-10 text-center">
                  <p className="text-muted-foreground text-sm">Event Calendar — Coming Soon</p>
                </div>
              )}
              {adminTab === "Subscriptions" && <SubscriptionPlans />}
            </>
          ) : (
            <>
              {memberTab === "Home" && <MemberDashboard />}
              {memberTab === "Sermons" && (
                <div className="card-surface p-10 text-center">
                  <p className="text-muted-foreground text-sm">Sermon Library — Coming Soon</p>
                </div>
              )}
              {memberTab === "Giving" && (
                <div className="card-surface p-10 text-center">
                  <p className="text-muted-foreground text-sm">Giving History — Coming Soon</p>
                </div>
              )}
              {memberTab === "Events" && (
                <div className="card-surface p-10 text-center">
                  <p className="text-muted-foreground text-sm">Event Calendar — Coming Soon</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {role === "admin" && (
        <MinistryAlerts onNavigate={(tab) => setAdminTab(tab as AdminTab)} />
      )}
    </div>
  );
}
