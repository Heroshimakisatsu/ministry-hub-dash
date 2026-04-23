import { useState } from "react";
import {
  Users, ClipboardCheck, UserPlus, DollarSign, Megaphone, Target,
  CalendarDays, Building2, BookOpen, Heart, Package, Shield, BarChart3,
  CreditCard, GitBranch, ChevronRight
} from "lucide-react";
import { MemberDirectory } from "./MemberDirectory";
import { AttendanceTracking } from "./AttendanceTracking";
import { VisitorFollowUp } from "./VisitorFollowUp";
import { FinanceOffering } from "./FinanceOffering";
import { CommunicationSystem } from "./CommunicationSystem";
import { ProjectsFundraising } from "./ProjectsFundraising";
import { EventsCalendar } from "./EventsCalendar";
import { DepartmentManagement } from "./DepartmentManagement";
import { ChurchRecords } from "./ChurchRecords";
import { WelfareCounseling } from "./WelfareCounseling";
import { AssetInventory } from "./AssetInventory";
import { AccessControl } from "./AccessControl";
import { ReportsAnalytics } from "./ReportsAnalytics";
import { OnlineGiving } from "./OnlineGiving";
import { MultiBranch } from "./MultiBranch";

const navGroups = [
  {
    label: "People",
    items: [
      { id: "members", label: "Member Directory", icon: Users, badge: "" },
      { id: "attendance", label: "Attendance Tracking", icon: ClipboardCheck, badge: "" },
      { id: "visitors", label: "Visitors & Follow-Up", icon: UserPlus, badge: "" },
    ],
  },
  {
    label: "Ministry",
    items: [
      { id: "departments", label: "Departments",            icon: Building2,    badge: "" },
      { id: "events",      label: "Events & Calendar",      icon: CalendarDays, badge: "" },
      { id: "church-records", label: "Church Records",      icon: BookOpen,     badge: "" },
      { id: "welfare",     label: "Welfare & Counseling",   icon: Heart,        badge: "" },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "tithes", label: "Finance & Offering", icon: DollarSign, badge: "" },
      { id: "fundraising", label: "Projects & Fundraising", icon: Target, badge: "" },
      { id: "online-giving", label: "Online Giving", icon: CreditCard, badge: "" },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "communications", label: "Communications",      icon: Megaphone,    badge: "" },
      { id: "assets",     label: "Asset & Inventory",       icon: Package,      badge: "" },
      { id: "access",     label: "Access Control",          icon: Shield,       badge: "" },
      { id: "analytics", label: "Reports & Analytics",      icon: BarChart3,    badge: "" },
      { id: "multi-branch", label: "Multi-Branch",          icon: GitBranch,    badge: "" },
    ],
  },
];

type TabId =
  | "members" | "attendance" | "visitors"
  | "departments" | "events" | "church-records" | "welfare"
  | "tithes" | "fundraising" | "online-giving"
  | "communications" | "assets" | "access" | "analytics" | "multi-branch";

const componentMap: Record<TabId, React.ReactNode> = {
  members:     <MemberDirectory />,
  attendance:  <AttendanceTracking />,
  visitors:    <VisitorFollowUp />,
  tithes:      <FinanceOffering />,
  communications: <CommunicationSystem />,
  fundraising: <ProjectsFundraising />,
  events:      <EventsCalendar />,
  departments: <DepartmentManagement />,
  "church-records": <ChurchRecords />,
  welfare:     <WelfareCounseling />,
  assets:      <AssetInventory />,
  access:      <AccessControl />,
  analytics:   <ReportsAnalytics />,
  "online-giving": <OnlineGiving />,
  "multi-branch": <MultiBranch />,
};

interface MemberManagementProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

export function MemberManagement({ activeTab, onTabChange }: MemberManagementProps) {
  const [internalTab, setInternalTab] = useState<TabId>("members");
  const currentTab = activeTab ?? internalTab;
  const setTab = onTabChange ?? setInternalTab;

  const activeItem = navGroups.flatMap((g) => g.items).find((i) => i.id === currentTab);

  return (
    <div className="min-h-[600px]">
      {/* ── Content Area ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          {activeItem && (
            <>
              {(() => { const Icon = activeItem.icon; return <Icon className="h-4 w-4 text-primary" />; })()}
              <h2 className="text-sm font-semibold">{activeItem.label}</h2>
            </>
          )}
        </div>
        {componentMap[currentTab]}
      </div>
    </div>
  );
}
