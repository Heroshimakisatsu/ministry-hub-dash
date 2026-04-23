import { useState } from "react";
import { Building2, Plus, Users, Crown, ClipboardCheck, DollarSign, Edit, Trash2, ChevronDown, ChevronUp, UserPlus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialMembers } from "@/data/members";

interface Department {
  id: string;
  name: string;
  leader: string;
  members: number;
  meetingDay: string;
  meetingTime: string;
  lastAttendance: number;
  monthlyContribution: number;
  description: string;
  color: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  joinedDate: string;
}

const initialDepartments: Department[] = [
  { id: "D001", name: "Worship Team", leader: "Sarah Johnson", members: 0, meetingDay: "Wednesday", meetingTime: "18:00", lastAttendance: 15, monthlyContribution: 320, description: "Leads worship during all services and special events", color: "bg-primary" },
  { id: "D002", name: "Youth Ministry", leader: "David Kim", members: 0, meetingDay: "Friday", meetingTime: "17:00", lastAttendance: 45, monthlyContribution: 580, description: "Discipleship and evangelism for ages 13-35", color: "bg-blue-500" },
  { id: "D003", name: "Women's Ministry", leader: "Grace Dube", members: 0, meetingDay: "Thursday", meetingTime: "14:00", lastAttendance: 52, monthlyContribution: 750, description: "Empowerment, prayer and fellowship for women", color: "bg-pink-500" },
  { id: "D004", name: "Men's Group", leader: "James Brown", members: 0, meetingDay: "Saturday", meetingTime: "07:00", lastAttendance: 38, monthlyContribution: 620, description: "Men's prayer, accountability and community service", color: "bg-emerald-500" },
  { id: "D005", name: "Choir", leader: "Maria Garcia", members: 0, meetingDay: "Saturday", meetingTime: "14:00", lastAttendance: 28, monthlyContribution: 180, description: "Special music and choral performances", color: "bg-amber-500" },
  { id: "D006", name: "Ushers", leader: "Robert Wilson", members: 0, meetingDay: "Sunday", meetingTime: "08:00", lastAttendance: 18, monthlyContribution: 120, description: "Welcome, seating and hospitality during services", color: "bg-cyan-500" },
  { id: "D007", name: "Deacons", leader: "John Moyo", members: 0, meetingDay: "Monday", meetingTime: "19:00", lastAttendance: 7, monthlyContribution: 450, description: "Pastoral care, welfare administration and church governance", color: "bg-purple-500" },
  { id: "D008", name: "Children's Ministry", leader: "Emily Chen", members: 0, meetingDay: "Sunday", meetingTime: "09:00", lastAttendance: 35, monthlyContribution: 280, description: "Sunday school, children's church and holiday programs", color: "bg-orange-500" },
];

// Convert initialMembers to Member format for department management
const allMembers: Member[] = initialMembers.map(m => ({
  id: m.id,
  name: m.name,
  role: m.status === "Visitor" ? "Visitor" : "Member",
  joinedDate: m.joined,
}));

// Mock department members mapping - assign members to departments based on their department field
const departmentMembers: Record<string, Member[]> = {
  "D001": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Worship Team"),
  "D002": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Youth Ministry"),
  "D003": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Women's Ministry"),
  "D004": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Men's Group"),
  "D005": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Choir"),
  "D006": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Ushers"),
  "D007": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Deacons"),
  "D008": allMembers.filter(m => initialMembers.find(im => im.id === m.id)?.department === "Children's Ministry"),
};

// Calculate actual member counts for each department
const getDepartmentMemberCount = (deptId: string) => departmentMembers[deptId]?.length || 0;

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", leader: "", meetingDay: "Sunday", meetingTime: "09:00", description: "" });
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deptMembers, setDeptMembers] = useState<Member[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState<string>("");

  // Calculate total members from actual member data
  const totalMembers = initialMembers.length;
  const totalContributions = departments.reduce((s, d) => s + d.monthlyContribution, 0);
  const totalDepartmentMembers = departments.reduce((s, d) => s + getDepartmentMemberCount(d.id), 0);

  const handleAdd = () => {
    const newD: Department = {
      id: `D${String(departments.length + 1).padStart(3, "0")}`,
      name: form.name, leader: form.leader, members: 0,
      meetingDay: form.meetingDay, meetingTime: form.meetingTime,
      lastAttendance: 0, monthlyContribution: 0, description: form.description,
      color: "bg-violet-500",
    };
    setDepartments((prev) => [...prev, newD]);
    setShowAdd(false);
    setForm({ name: "", leader: "", meetingDay: "Sunday", meetingTime: "09:00", description: "" });
  };

  const handleViewMembers = (department: Department) => {
    setSelectedDepartment(department);
    setDeptMembers(departmentMembers[department.id] || []);
    setShowMembersDialog(true);
  };

  const handleAddMember = () => {
    if (!selectedDepartment || !selectedMemberToAdd) return;
    
    const memberToAdd = allMembers.find(m => m.id === selectedMemberToAdd);
    if (!memberToAdd) return;
    
    // Check if member is already in department
    if (deptMembers.some(m => m.id === memberToAdd.id)) return;
    
    const updatedMembers = [...deptMembers, memberToAdd];
    setDeptMembers(updatedMembers);
    
    // Update department member count
    setDepartments(prev => prev.map(d => 
      d.id === selectedDepartment.id 
        ? { ...d, members: updatedMembers.length }
        : d
    ));
    
    setShowAddMember(false);
    setSelectedMemberToAdd("");
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedDepartment) return;
    
    const updatedMembers = deptMembers.filter(m => m.id !== memberId);
    setDeptMembers(updatedMembers);
    
    // Update department member count
    setDepartments(prev => prev.map(d => 
      d.id === selectedDepartment.id 
        ? { ...d, members: updatedMembers.length }
        : d
    ));
  };

  const availableMembersToAdd = allMembers.filter(
    m => !deptMembers.some(dm => dm.id === m.id)
  ).filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Departments", value: departments.length, color: "text-primary" },
          { label: "Total Members", value: totalMembers, color: "text-blue-400" },
          { label: "Dept Members", value: totalDepartmentMembers, color: "text-purple-400" },
          { label: "Monthly Contributions", value: fmt(totalContributions), color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card-surface p-4 flex justify-between items-center">
        <p className="text-sm font-medium">{departments.length} Departments / Ministries</p>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />New Department</Button>
      </div>

      {/* Department Cards */}
      <div className="grid md:grid-cols-2 gap-3">
        {departments.map((d) => {
          const actualMemberCount = getDepartmentMemberCount(d.id);
          const attendRate = actualMemberCount > 0 ? Math.round((d.lastAttendance / actualMemberCount) * 100) : 0;
          const isExpanded = expandedId === d.id;
          return (
            <div key={d.id} className="card-surface overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg ${d.color}/20 flex items-center justify-center shrink-0`}>
                      <Building2 className={`h-4 w-4 ${d.color.replace("bg-", "text-")}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Crown className="h-3 w-3" />{d.leader}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setExpandedId(isExpanded ? null : d.id)} className="p-1.5 rounded-md hover:bg-accent transition-colors">
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>
                    <button onClick={() => setDepartments((prev) => prev.filter((x) => x.id !== d.id))} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-accent/40 rounded-lg p-2"><p className="text-muted-foreground">Members</p><p className="font-bold text-sm mt-0.5">{actualMemberCount}</p></div>
                  <div className="bg-accent/40 rounded-lg p-2"><p className="text-muted-foreground">Attendance</p><p className="font-bold text-sm mt-0.5 text-emerald-400">{attendRate}%</p></div>
                  <div className="bg-accent/40 rounded-lg p-2"><p className="text-muted-foreground">Contribution</p><p className="font-bold text-sm mt-0.5 text-primary">{fmt(d.monthlyContribution)}</p></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Attendance Rate</span><span>{d.lastAttendance}/{actualMemberCount}</span>
                  </div>
                  <Progress value={attendRate} className="h-1.5" />
                </div>
              </div>
              {isExpanded && (
                <div className="border-t p-4 space-y-2 bg-accent/10">
                  <p className="text-xs text-muted-foreground">{d.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Meeting: <span className="text-foreground">{d.meetingDay} at {d.meetingTime}</span></span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 flex-1" onClick={() => handleViewMembers(d)}>View Members</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 flex-1">Record Meeting</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Department / Ministry</DialogTitle><DialogDescription>Add a new ministry department to the church.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Department Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Prayer Warriors" /></div>
            <div><Label className="text-xs">Department Leader</Label><Input value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} placeholder="Leader's full name" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Meeting Day</Label>
                <select value={form.meetingDay} onChange={(e) => setForm({ ...form, meetingDay: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div><Label className="text-xs">Meeting Time</Label><Input type="time" value={form.meetingTime} onChange={(e) => setForm({ ...form, meetingTime: e.target.value })} /></div>
            </div>
            <div><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of ministry" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd}>Create Department</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {selectedDepartment?.name} - Members
            </DialogTitle>
            <DialogDescription>
              Manage members for this department. Total: {deptMembers.length}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Add Member Section */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members to add..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button size="sm" onClick={() => setShowAddMember(true)}>
                <UserPlus className="h-4 w-4 mr-1" />Add Member
              </Button>
            </div>

            {/* Members Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-accent/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">NAME</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">ROLE</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">JOINED</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {deptMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground text-sm">
                        No members in this department yet. Click "Add Member" to add members.
                      </td>
                    </tr>
                  ) : (
                    deptMembers.map((member) => (
                      <tr key={member.id} className="border-t hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{member.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            member.role === "Member" ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-500"
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{member.joinedDate}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowMembersDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member to Department</DialogTitle>
            <DialogDescription>
              Select a member to add to {selectedDepartment?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
              {availableMembersToAdd.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No available members found
                </p>
              ) : (
                availableMembersToAdd.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMemberToAdd(member.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedMemberToAdd === member.id ? "bg-primary/10 border border-primary" : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role} • {member.joinedDate}</p>
                    </div>
                    {selectedMemberToAdd === member.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <X className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddMember(false); setSelectedMemberToAdd(""); }}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={!selectedMemberToAdd}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
