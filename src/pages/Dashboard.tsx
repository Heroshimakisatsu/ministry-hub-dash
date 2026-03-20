import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCards } from "@/components/StatCards";
import { GivingChart, FundAllocationChart } from "@/components/Charts";
import { MinistryAlerts } from "@/components/MinistryAlerts";
import { MemberList } from "@/components/MemberList";
import { TithesTable } from "@/components/TithesTable";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";

const tabs = ["Overview", "Members", "Tithes", "Events", "Subscriptions"] as const;
type Tab = (typeof tabs)[number];

const sidebarToTab: Record<string, Tab> = {
  members: "Members",
  tithes: "Tithes",
  events: "Events",
  analytics: "Overview",
  settings: "Subscriptions",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [sidebarTab, setSidebarTab] = useState("analytics");

  const handleSidebarChange = (id: string) => {
    setSidebarTab(id);
    const mapped = sidebarToTab[id];
    if (mapped) setActiveTab(mapped);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar activeTab={sidebarTab} onTabChange={setSidebarTab} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

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
          {activeTab === "Overview" && (
            <>
              <StatCards />
              <div className="flex gap-4">
                <GivingChart />
                <FundAllocationChart />
              </div>
              <MemberList />
            </>
          )}
          {activeTab === "Members" && <MemberList />}
          {activeTab === "Tithes" && (
            <>
              <StatCards />
              <TithesTable />
            </>
          )}
          {activeTab === "Events" && (
            <div className="card-surface p-10 text-center">
              <p className="text-muted-foreground text-sm">Event Calendar — Coming Soon</p>
            </div>
          )}
          {activeTab === "Subscriptions" && <SubscriptionPlans />}
        </div>
      </div>

      <MinistryAlerts />
    </div>
  );
}
