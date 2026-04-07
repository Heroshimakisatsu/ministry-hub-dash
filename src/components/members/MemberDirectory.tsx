import { useState } from "react";
import { Search, Plus, Filter, Download, Edit, Trash2, Eye, Phone, Mail, MapPin, ChevronDown, X, Upload, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  status: "Active" | "Visitor" | "Inactive" | "Deceased";
  baptized: boolean;
  joined: string;
  photo: string;
  familyGroup?: string;
  role?: string;
}

const initialMembers: Member[] = [
  { id: "M001", name: "Sarah Johnson", phone: "+263 77 123 4567", email: "sarah@email.com", address: "12 Harare St", department: "Worship Team", status: "Active", baptized: true, joined: "Jan 2024", photo: "", familyGroup: "Johnson Family", role: "Worship Leader" },
  { id: "M002", name: "David Kim", phone: "+263 77 234 5678", email: "david@email.com", address: "45 Bulawayo Rd", department: "Youth Ministry", status: "Active", baptized: true, joined: "Mar 2023", photo: "", familyGroup: "Kim Family", role: "Youth Pastor" },
  { id: "M003", name: "Maria Garcia", phone: "+263 71 345 6789", email: "maria@email.com", address: "78 Mutare Ave", department: "—", status: "Visitor", baptized: false, joined: "Mar 2026", photo: "" },
  { id: "M004", name: "James Brown", phone: "+263 77 456 7890", email: "james@email.com", address: "23 Gweru Cr", department: "Men's Group", status: "Active", baptized: true, joined: "Sep 2022", photo: "", familyGroup: "Brown Family" },
  { id: "M005", name: "Emily Chen", phone: "+263 78 567 8901", email: "emily@email.com", address: "56 Masvingo Ln", department: "Choir", status: "Inactive", baptized: true, joined: "Jun 2021", photo: "" },
  { id: "M006", name: "Robert Wilson", phone: "+263 77 678 9012", email: "robert@email.com", address: "89 Kwekwe Bl", department: "Ushers", status: "Active", baptized: true, joined: "Nov 2023", photo: "", familyGroup: "Wilson Family" },
  { id: "M007", name: "Lisa Taylor", phone: "+263 71 789 0123", email: "lisa@email.com", address: "34 Chinhoyi Pk", department: "—", status: "Visitor", baptized: false, joined: "Feb 2026", photo: "" },
  { id: "M008", name: "John Moyo", phone: "+263 77 890 1234", email: "john.m@email.com", address: "67 Chitungwiza", department: "Deacons", status: "Active", baptized: true, joined: "Jan 2020", photo: "", familyGroup: "Moyo Family", role: "Head Deacon" },
  { id: "M009", name: "Grace Dube", phone: "+263 78 901 2345", email: "grace@email.com", address: "12 Epworth Rd", department: "Women's Ministry", status: "Active", baptized: true, joined: "May 2019", photo: "", familyGroup: "Dube Family", role: "Women's Leader" },
  { id: "M010", name: "Peter Ncube", phone: "+263 71 012 3456", email: "peter@email.com", address: "90 Norton St", department: "Youth Ministry", status: "Deceased", baptized: true, joined: "Aug 2018", photo: "" },
];

const departments = ["All", "Worship Team", "Youth Ministry", "Choir", "Ushers", "Men's Group", "Women's Ministry", "Deacons", "Children's Ministry"];
const statuses = ["All", "Active", "Visitor", "Inactive", "Deceased"];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Visitor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Inactive: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Deceased: "bg-red-500/15 text-red-400 border-red-500/20",
};

export function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", address: "", department: "Worship Team",
    status: "Active" as Member["status"], baptized: false, familyGroup: "", role: "",
  });

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) || m.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "All" || m.department === filterDept;
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "Active").length,
    visitors: members.filter((m) => m.status === "Visitor").length,
    inactive: members.filter((m) => m.status === "Inactive").length,
  };

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ name: "", phone: "", email: "", address: "", department: "Worship Team", status: "Active", baptized: false, familyGroup: "", role: "" });
    setShowAddDialog(true);
  };

  const handleEdit = (m: Member) => {
    setIsEditing(true);
    setSelectedMember(m);
    setFormData({ name: m.name, phone: m.phone, email: m.email, address: m.address, department: m.department, status: m.status, baptized: m.baptized, familyGroup: m.familyGroup || "", role: m.role || "" });
    setShowAddDialog(true);
  };

  const handleSave = () => {
    if (isEditing && selectedMember) {
      setMembers((prev) => prev.map((m) => m.id === selectedMember.id ? { ...m, ...formData, photo: "" } : m));
    } else {
      const newId = `M${String(members.length + 1).padStart(3, "0")}`;
      setMembers((prev) => [...prev, { id: newId, ...formData, photo: "", joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }) }]);
    }
    setShowAddDialog(false);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleView = (m: Member) => {
    setSelectedMember(m);
    setShowViewDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Members", value: stats.total, color: "text-primary" },
          { label: "Active", value: stats.active, color: "text-emerald-400" },
          { label: "Visitors", value: stats.visitors, color: "text-blue-400" },
          { label: "Inactive", value: stats.inactive, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card-surface p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, phone, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-[180px]"><Filter className="h-3.5 w-3.5 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Add Member</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">MEMBER</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">CONTACT</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">DEPARTMENT</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">STATUS</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">BAPTIZED</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">JOINED</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{m.name}</p>
                        {m.familyGroup && <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{m.familyGroup}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{m.phone}</p>
                    <p className="text-xs flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{m.department}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {m.baptized ? <span className="text-emerald-400 text-xs font-medium">✓ Yes</span> : <span className="text-muted-foreground text-xs">No</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{m.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleView(m)} className="p-1.5 rounded-md hover:bg-accent transition-colors"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleEdit(m)} className="p-1.5 rounded-md hover:bg-accent transition-colors"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-sm">No members found matching your search criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t text-xs text-muted-foreground flex justify-between items-center">
          <span>Showing {filtered.length} of {members.length} members</span>
          <span className="text-primary font-medium cursor-pointer hover:underline">View all →</span>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Member" : "Register New Member"}</DialogTitle>
            <DialogDescription>{isEditing ? "Update member information." : "Add a new member to the church directory."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">Upload Photo</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Full Name *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" /></div>
              <div><Label className="text-xs">Phone *</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+263 77..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Email</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" /></div>
              <div><Label className="text-xs">Address</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Home address" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Department</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.filter((d) => d !== "All").map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Member["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.filter((s) => s !== "All").map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Family Group</Label><Input value={formData.familyGroup} onChange={(e) => setFormData({ ...formData, familyGroup: e.target.value })} placeholder="e.g. Johnson Family" /></div>
              <div><Label className="text-xs">Church Role</Label><Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Deacon" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.baptized} onChange={(e) => setFormData({ ...formData, baptized: e.target.checked })} className="rounded" /> Baptized</label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEditing ? "Update" : "Register"} Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
            <DialogDescription>Detailed member information</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                  {selectedMember.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.id} · {selectedMember.department}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${statusColors[selectedMember.status]}`}>{selectedMember.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Phone</p><p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedMember.phone}</p></div>
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Email</p><p className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedMember.email}</p></div>
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Address</p><p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{selectedMember.address}</p></div>
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Baptized</p><p>{selectedMember.baptized ? "✓ Yes" : "No"}</p></div>
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Joined</p><p>{selectedMember.joined}</p></div>
                {selectedMember.familyGroup && <div className="space-y-1"><p className="text-xs text-muted-foreground">Family</p><p>{selectedMember.familyGroup}</p></div>}
                {selectedMember.role && <div className="space-y-1"><p className="text-xs text-muted-foreground">Role</p><p>{selectedMember.role}</p></div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
