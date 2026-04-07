import { useState } from "react";
import { Users, ClipboardCheck, UserPlus, DollarSign, Building2, Shield } from "lucide-react";
import { MemberDirectory } from "./MemberDirectory";
import { AttendanceTracking } from "./AttendanceTracking";
import { VisitorFollowUp } from "./VisitorFollowUp";
import { FinanceOffering } from "./FinanceOffering";

const subTabs = [
  { id: "directory", label: "Directory", icon: Users },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "visitors", label: "Visitors & Follow-Up", icon: UserPlus },
  { id: "finance", label: "Finance & Giving", icon: DollarSign },
] as const;

type SubTab = (typeof subTabs)[number]["id"];

export function MemberManagement() {
  const [activeTab, setActiveTab] = useState<SubTab>("directory");

  return (
    <div className="space-y-4">
      {/* Sub-navigation */}
      <div className="card-surface">
        <div className="flex items-center gap-1 p-1.5 overflow-x-auto">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === "directory" && <MemberDirectory />}
      {activeTab === "attendance" && <AttendanceTracking />}
      {activeTab === "visitors" && <VisitorFollowUp />}
      {activeTab === "finance" && <FinanceOffering />}
    </div>
  );
}
