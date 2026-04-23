import { useState } from "react";
import { Shield, Lock, Unlock, User, UserCheck, Key, History, AlertTriangle, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type AppRole = "Pastor" | "Secretary" | "Treasurer" | "Department Leader" | "Welfare Committee";

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  lastActive: string;
  status: "Active" | "Suspended";
}

const initialUserRoles: UserRole[] = [
  { id: "UR001", name: "Pastor Moyo", email: "pastor@ministryhub.org", role: "Pastor", lastActive: "Just now", status: "Active" },
  { id: "UR002", name: "Sarah Johnson", email: "sarah@ministryhub.org", role: "Secretary", lastActive: "10 mins ago", status: "Active" },
  { id: "UR003", name: "John Banda", email: "treasurer@ministryhub.org", role: "Treasurer", lastActive: "2 hours ago", status: "Active" },
  { id: "UR004", name: "David Kim", email: "youth@ministryhub.org", role: "Department Leader", lastActive: "Yesterday", status: "Active" },
  { id: "UR005", name: "Grace Sibanda", email: "welfare@ministryhub.org", role: "Welfare Committee", lastActive: "3 days ago", status: "Active" },
];

const auditLogs = [
  { id: "LOG001", user: "Pastor Moyo", action: "Deleted member record #M012", time: "2:15 PM Today", type: "Security" },
  { id: "LOG002", user: "John Banda", action: "Exported Finance Report PDF", time: "11:30 AM Today", type: "Export" },
  { id: "LOG003", user: "Sarah Johnson", action: "Updated Role for David Kim", time: "Yesterday 4:00 PM", type: "Access Control" },
  { id: "LOG004", user: "System", action: "Automatic Backup Complete", time: "Yesterday 12:00 AM", type: "System" },
];

const rolePermissions: Record<AppRole, string[]> = {
  "Pastor": ["Full Access", "All Modules", "Delete Records", "Manage Users"],
  "Secretary": ["Member Management", "Records", "Comms", "Events"],
  "Treasurer": ["Finance", "Giving", "Projects", "Reports"],
  "Department Leader": ["Department Access", "Attendance", "Comms"],
  "Welfare Committee": ["Welfare Requests", "Counseling Notes"],
};

export function AccessControl() {
  const [userRoles, setUserRoles] = useState<UserRole[]>(initialUserRoles);

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card-surface p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Shield className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">Admin Accounts</p><p className="text-2xl font-bold">{userRoles.length}</p></div>
        </div>
        <div className="card-surface p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500"><Lock className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">Security Level</p><p className="text-xl font-bold uppercase text-amber-400 tracking-wide">High</p></div>
        </div>
        <div className="card-surface p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><UserCheck className="h-5 w-5" /></div>
          <div><p className="text-xs text-muted-foreground">Recent Logins</p><p className="text-2xl font-bold">4</p></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* User Roles Table */}
        <div className="md:col-span-2 card-surface overflow-hidden self-start">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-sm font-semibold">Authorized Users</h3>
            <Button size="xs" variant="outline" className="h-7 text-[10px]"><UserCheck className="h-3.5 w-3.5 mr-1" />Manage Roles</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-accent/40">
              <tr className="border-b text-left">
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">USER</th>
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">ROLE</th>
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">STATUS</th>
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[10px] font-medium">{u.role}</Badge></td>
                  <td className="px-4 py-3"><span className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{u.status}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permissions Quick View */}
        <div className="space-y-4">
           <div className="card-surface p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Role Permissions</h3>
              <div className="space-y-3">
                {Object.entries(rolePermissions).map(([role, perms]) => (
                  <div key={role} className="space-y-1">
                    <p className="text-xs font-semibold">{role}</p>
                    <div className="flex flex-wrap gap-1">
                      {perms.map(p => <span key={p} className="text-[9px] px-1.5 py-0.5 bg-accent/50 rounded-full text-muted-foreground">{p}</span>)}
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Audit Log */}
           <div className="card-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audit Log</h3>
                <History className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="border-l-2 border-primary/30 pl-3 space-y-0.5">
                    <p className="text-[11px] font-medium text-foreground">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">{log.user} · {log.time}</p>
                  </div>
                ))}
              </div>
              <Button size="xs" variant="ghost" className="w-full text-[10px] h-6 text-muted-foreground">View Full Log</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
