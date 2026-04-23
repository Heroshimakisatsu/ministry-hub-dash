import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCards } from "@/components/StatCards";
import { GivingChart, FundAllocationChart } from "@/components/Charts";
import { MinistryAlerts } from "@/components/MinistryAlerts";
import { MemberManagement } from "@/components/members/MemberManagement";
import { TithesTable } from "@/components/TithesTable";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { AdminQuickActions } from "@/components/AdminQuickActions";
import { initialMembers } from "@/data/members";

const adminTabs = [
  "Members",
  "Attendance Tracking",
  "Visitors & Follow-Up",
] as const;
type AdminTab = (typeof adminTabs)[number];

const sidebarToAdminTab: Record<string, AdminTab> = {
  members:   "Members",
  attendance: "Attendance Tracking",
  visitors: "Visitors & Follow-Up",
};

const sidebarLabel: Record<string, string> = {
  overview: "Overview",
  members: "Member Directory",
  departments: "Departments",
  events: "Events & Calendar",
  "church-records": "Church Records",
  welfare: "Welfare & Counseling",
  tithes: "Finance & Offering",
  fundraising: "Projects & Fundraising",
  "online-giving": "Online Giving",
  communications: "Communications",
  assets: "Asset & Inventory",
  access: "Access Control",
  analytics: "Reports & Analytics",
  "multi-branch": "Multi-Branch",
  settings: "Settings",
};

const memberManagementTabs = new Set([
  "members",
  "attendance",
  "visitors",
  "departments",
  "events",
  "church-records",
  "welfare",
  "tithes",
  "fundraising",
  "online-giving",
  "communications",
  "assets",
  "access",
  "analytics",
  "multi-branch",
]);

const adminTabToSidebarTab: Record<AdminTab, string> = {
  Members: "members",
  "Attendance Tracking": "attendance",
  "Visitors & Follow-Up": "visitors",
};

export default function Dashboard() {
  const [adminTab, setAdminTab]   = useState<AdminTab>("Members");
  const [sidebarTab, setSidebarTab] = useState("members");

  const handleSidebarChange = (id: string) => {
    setSidebarTab(id);
    const mapped = sidebarToAdminTab[id];
    setAdminTab(mapped ?? "Members");
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "register-member":
        setSidebarTab("members");
        break;
      case "register-visitor":
        setSidebarTab("visitors");
        break;
      case "record-attendance":
        setSidebarTab("attendance");
        break;
      case "record-offering":
        setSidebarTab("tithes");
        break;
      case "send-broadcast":
        setSidebarTab("communications");
        break;
    }
  };

  const activeLabel = sidebarLabel[sidebarTab] ?? sidebarTab;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        activeTab={sidebarTab}
        onTabChange={handleSidebarChange}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader role="admin" onRoleChange={() => {}} />

        {/* Horizontal Tabs for Member Management */}
        {(sidebarTab === "members" || sidebarTab === "attendance" || sidebarTab === "visitors") && (
          <div className="border-b bg-card px-6 shrink-0">
            <div className="flex gap-0">
              {adminTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleSidebarChange(adminTabToSidebarTab[tab])}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    adminTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sidebarTab === "overview" && (
            <>
              <StatCards memberCount={initialMembers.length} />
              <AdminQuickActions onActionClick={handleQuickAction} />
              <div className="flex gap-4">
                <GivingChart />
                <FundAllocationChart />
              </div>
            </>
          )}

          {sidebarTab === "settings" && <SubscriptionPlans />}

          {sidebarTab !== "overview" &&
            sidebarTab !== "settings" &&
            memberManagementTabs.has(sidebarTab) && (
            <MemberManagement
              activeTab={sidebarTab as never}
              onTabChange={(tab) => handleSidebarChange(tab as string)}
            />
          )}

          {sidebarTab !== "overview" &&
            sidebarTab !== "settings" &&
            !memberManagementTabs.has(sidebarTab) && (
              <div className="card-surface p-10 text-center">
                <p className="text-muted-foreground text-sm">{activeLabel} — Coming Soon</p>
              </div>
            )}
        </div>
      </div>

      <MinistryAlerts onNavigate={(tab) => setAdminTab(tab as AdminTab)} />
    </div>
  );
}
