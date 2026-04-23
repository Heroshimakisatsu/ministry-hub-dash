import { useState, useRef, useCallback } from "react";
import {
  Search, Plus, Filter, Download, Edit, Trash2, Eye, Phone, Mail, MapPin,
  Upload, Users, ChevronDown, ChevronUp, FileSpreadsheet, AlertTriangle
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateFaithNumber, MemberForFaithNumber } from "@/utils/faithNumberGenerator";
import { initialMembers as sharedInitialMembers, Member as SharedMember } from "@/data/members";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  status: "Active" | "New Member" | "Visitor" | "Inactive" | "Deceased";
  baptized: boolean;
  joined: string;
  photo: string;
  familyGroup?: string;
  role?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  // Additional details
  baptismDate?: string;
  maritalStatus?: string;
  occupation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  smallGroup?: string;
  spiritualGifts?: string;
  notes?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const initialMembers: Member[] = sharedInitialMembers.map(m => ({
  ...m,
  photo: "",
  baptismDate: "",
  maritalStatus: "",
  occupation: "",
  emergencyContact: "",
  emergencyPhone: "",
  smallGroup: "",
  spiritualGifts: "",
  notes: "",
}));

const departments = ["All", "Worship Team", "Youth Ministry", "Choir", "Ushers", "Men's Group", "Women's Ministry", "Deacons", "Children's Ministry"];
const statuses: Member["status"][] = ["Active", "New Member", "Visitor", "Inactive", "Deceased"];
const filterStatuses = ["All", ...statuses];
const maritalOptions = ["Single", "Married", "Widowed", "Divorced"];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "New Member": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Visitor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Inactive: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Deceased: "bg-red-500/15 text-red-400 border-red-500/20",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSurname(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function generateId(members: Member[], firstName?: string, lastName?: string, dateOfBirth?: string, gender?: 'male' | 'female' | 'other') {
  if (dateOfBirth && firstName && lastName) {
    const existingMembers: MemberForFaithNumber[] = members
      .filter(m => m.dateOfBirth)
      .map(m => {
        const nameParts = m.name.split(/\s+/);
        return {
          firstName: nameParts[0],
          lastName: nameParts[nameParts.length - 1],
          dateOfBirth: m.dateOfBirth!,
          gender: m.gender || 'other'
        };
      });
    return generateFaithNumber(firstName, lastName, dateOfBirth, existingMembers, gender || 'other');
  }
  return `M${String(members.length + 1).padStart(3, "0")}`;
}

function joinedDate() {
  return new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ─── Excel / CSV Import helpers ───────────────────────────────────────────────

function parseCSV(text: string): Partial<Member>[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, ""));
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = cells[i] || ""; });
    return {
      name: obj.name || obj.fullname || "",
      phone: obj.phone || obj.phonenumber || "",
      email: obj.email || "",
      address: obj.address || "",
      department: obj.department || "—",
      status: (statuses.includes(obj.status as Member["status"]) ? obj.status : "Active") as Member["status"],
      baptized: obj.baptized === "true" || obj.baptized === "yes" || obj.baptized === "1",
      familyGroup: obj.familygroup || obj.family || "",
      role: obj.role || "",
      dateOfBirth: obj.dateofbirth || obj.dob || "",
    };
  }).filter((r) => r.name);
}

// ─── blank form helper ────────────────────────────────────────────────────────

const blankForm = (): Omit<Member, "id" | "joined" | "photo"> => ({
  name: "", phone: "", email: "", address: "", department: "Worship Team",
  status: "Active", baptized: false, familyGroup: "", role: "", dateOfBirth: "",
  gender: "other", baptismDate: "", maritalStatus: "", occupation: "", emergencyContact: "",
  emergencyPhone: "", smallGroup: "", spiritualGifts: "", notes: "",
});

// ─── Component ────────────────────────────────────────────────────────────────

export function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Dialogs
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showFamilyPopup, setShowFamilyPopup] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);

  // Family surname detection
  const [matchedFamilyGroup, setMatchedFamilyGroup] = useState("");
  const [pendingSave, setPendingSave] = useState(false);

  // Bulk import
  const [importRows, setImportRows] = useState<Partial<Member>[]>([]);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(blankForm());

  // ── Filtering ──

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
    newMembers: members.filter((m) => m.status === "New Member").length,
    visitors: members.filter((m) => m.status === "Visitor").length,
    inactive: members.filter((m) => m.status === "Inactive").length,
  };

  // ── Surname matching ──

  const checkFamilySurname = useCallback((name: string) => {
    const surname = getSurname(name);
    if (!surname) return "";
    const match = members.find((m) => {
      const mSurname = getSurname(m.name);
      return mSurname === surname && m.familyGroup;
    });
    return match?.familyGroup || "";
  }, [members]);

  // ── Handlers ──

  const handleAdd = () => {
    setIsEditing(false);
    setFormData(blankForm());
    setShowAdditional(false);
    setShowAddDialog(true);
  };

  const handleEdit = (m: Member) => {
    setIsEditing(true);
    setSelectedMember(m);
    setFormData({
      name: m.name, phone: m.phone, email: m.email, address: m.address,
      department: m.department, status: m.status, baptized: m.baptized,
      familyGroup: m.familyGroup || "", role: m.role || "",
      baptismDate: m.baptismDate || "", maritalStatus: m.maritalStatus || "",
      occupation: m.occupation || "", emergencyContact: m.emergencyContact || "",
      emergencyPhone: m.emergencyPhone || "", smallGroup: m.smallGroup || "",
      spiritualGifts: m.spiritualGifts || "", notes: m.notes || "",
      dateOfBirth: m.dateOfBirth || "", gender: m.gender || "other",
    });
    setShowAdditional(false);
    setShowAddDialog(true);
  };

  const commitSave = (fg?: string) => {
    const data = { ...formData };
    if (fg !== undefined) data.familyGroup = fg;

    if (isEditing && selectedMember) {
      setMembers((prev) => prev.map((m) => m.id === selectedMember.id ? { ...m, ...data } : m));
    } else {
      const firstName = formData.name.split(' ')[0];
      const lastName = getSurname(formData.name);
      const id = generateId(members, firstName, lastName, formData.dateOfBirth, formData.gender);
      setMembers((prev) => [...prev, { id, ...data, photo: "", joined: joinedDate() }]);
    }
    setShowAddDialog(false);
    setPendingSave(false);
  };

  const handleSave = () => {
    if (!isEditing && formData.name) {
      const matched = checkFamilySurname(formData.name);
      if (matched && !formData.familyGroup) {
        setMatchedFamilyGroup(matched);
        setShowFamilyPopup(true);
        setPendingSave(true);
        return;
      }
    }
    commitSave();
  };

  const handleFamilyAnswer = (isRelated: boolean) => {
    setShowFamilyPopup(false);
    if (isRelated) {
      commitSave(matchedFamilyGroup);
    } else {
      // Use surname + "Family" as new group
      const surname = getSurname(formData.name);
      const newGroup = surname ? `${surname.charAt(0).toUpperCase() + surname.slice(1)} Family` : formData.familyGroup;
      commitSave(newGroup);
    }
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleView = (m: Member) => {
    setSelectedMember(m);
    setShowViewDialog(true);
  };

  // ── Excel/CSV Import ──

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setImportError("No valid data found. Make sure the file has headers: name, phone, email, address, department, status, baptized, familyGroup, role");
          return;
        }
        setImportRows(rows);
        setShowImportDialog(true);
      } catch {
        setImportError("Could not read the file. Please use a CSV format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const commitImport = () => {
    setMembers((prev) => {
      let next = [...prev];
      importRows.forEach((row) => {
        const firstName = row.name?.split(' ')[0] || "";
        const lastName = getSurname(row.name || "");
        const id = generateId(next, firstName, lastName, row.dateOfBirth, row.gender as 'male' | 'female' | 'other');
        next = [...next, { id, photo: "", joined: joinedDate(), department: "—", status: "Active", baptized: false, ...row } as Member];
      });
      return next;
    });
    setShowImportDialog(false);
    setImportRows([]);
  };

  // ── Form field helper ──
  const setField = <K extends keyof typeof formData>(key: K, val: typeof formData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Members", value: stats.total, color: "text-primary" },
          { label: "Active", value: stats.active, color: "text-emerald-400" },
          { label: "New Members", value: stats.newMembers, color: "text-violet-400" },
          { label: "Visitors", value: stats.visitors, color: "text-blue-400" },
          { label: "Inactive", value: stats.inactive, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="card-surface p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, phone, or ID…" value={search}
              onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-[180px]"><Filter className="h-3.5 w-3.5 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>{filterStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Add Member</Button>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <FileSpreadsheet className="h-4 w-4 mr-1" />Import Excel/CSV
            </Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          </div>
        </div>
        {importError && (
          <p className="mt-2 text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{importError}</p>
        )}
      </div>

      {/* ── Table ── */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                {["ID", "MEMBER", "CONTACT", "DEPARTMENT", "STATUS", "BAPTIZED", "JOINED", "ACTIONS"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">{h}</th>
                ))}
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
                        {m.familyGroup && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />{m.familyGroup}
                          </p>
                        )}
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

      {/* ══════════════════════════════════════════════════════════
          Add / Edit Member Dialog
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Member" : "Register New Member"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update member information." : "Add a new member to the church directory."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto pr-2">

            {/* Photo upload */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">Upload Photo</Button>
            </div>

            {/* ── Core fields ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Full Name *</Label>
                <Input value={formData.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <Label className="text-xs">Date of Birth *</Label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => setField("dateOfBirth", e.target.value)} />
              </div>
            </div>

            <div>
              <Label className="text-xs">Gender</Label>
              <Select value={formData.gender || "other"} onValueChange={(v) => setField("gender", v as 'male' | 'female' | 'other')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="other">Prefer not to say</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Phone *</Label>
                <Input value={formData.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+263 77…" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={formData.email} onChange={(e) => setField("email", e.target.value)} placeholder="email@example.com" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Address</Label>
              <Input value={formData.address} onChange={(e) => setField("address", e.target.value)} placeholder="Home address" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Status *</Label>
                <Select value={formData.status} onValueChange={(v) => setField("status", v as Member["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className={`inline-flex items-center gap-1.5`}>{s}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Department</Label>
                <Select value={formData.department} onValueChange={(v) => setField("department", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.filter((d) => d !== "All").map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Family Group</Label>
                <Input value={formData.familyGroup} onChange={(e) => setField("familyGroup", e.target.value)} placeholder="e.g. Johnson Family" />
              </div>
              <div>
                <Label className="text-xs">Church Role</Label>
                <Input value={formData.role} onChange={(e) => setField("role", e.target.value)} placeholder="e.g. Deacon" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.baptized} onChange={(e) => setField("baptized", e.target.checked)} className="rounded" />
              Baptized
            </label>

            {/* ── Additional Details toggle ── */}
            <button
              type="button"
              onClick={() => setShowAdditional((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-1"
            >
              {showAdditional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAdditional ? "Hide" : "Add"} Additional Member Details
            </button>

            {showAdditional && (
              <div className="border rounded-lg p-4 space-y-3 bg-accent/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Additional Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Baptism Date</Label>
                    <Input type="date" value={formData.baptismDate} onChange={(e) => setField("baptismDate", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Marital Status</Label>
                    <Select value={formData.maritalStatus || ""} onValueChange={(v) => setField("maritalStatus", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>{maritalOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Occupation</Label>
                    <Input value={formData.occupation} onChange={(e) => setField("occupation", e.target.value)} placeholder="e.g. Teacher" />
                  </div>
                  <div>
                    <Label className="text-xs">Small Group</Label>
                    <Input value={formData.smallGroup} onChange={(e) => setField("smallGroup", e.target.value)} placeholder="e.g. Cell Group A" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Emergency Contact Name</Label>
                    <Input value={formData.emergencyContact} onChange={(e) => setField("emergencyContact", e.target.value)} placeholder="Full name" />
                  </div>
                  <div>
                    <Label className="text-xs">Emergency Contact Phone</Label>
                    <Input value={formData.emergencyPhone} onChange={(e) => setField("emergencyPhone", e.target.value)} placeholder="+263 77…" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Spiritual Gifts</Label>
                  <Input value={formData.spiritualGifts} onChange={(e) => setField("spiritualGifts", e.target.value)} placeholder="e.g. Teaching, Evangelism" />
                </div>
                <div>
                  <Label className="text-xs">Notes / Pastoral Notes</Label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    placeholder="Any relevant notes…"
                    rows={3}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEditing ? "Update" : "Register"} Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Family Surname Match Popup
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={showFamilyPopup} onOpenChange={(o) => { if (!o) { setShowFamilyPopup(false); setPendingSave(false); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Family Match Found
            </DialogTitle>
            <DialogDescription>
              A family group with a similar surname already exists: <strong>{matchedFamilyGroup}</strong>.
              Is <strong>{formData.name}</strong> related to this family?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1" onClick={() => handleFamilyAnswer(false)}>
              No, separate family
            </Button>
            <Button className="flex-1" onClick={() => handleFamilyAnswer(true)}>
              Yes, same family
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          View Member Dialog
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
            <DialogDescription>Detailed member information</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Baptized</p><p>{selectedMember.baptized ? "✓ Yes" : "No"}{selectedMember.baptismDate ? ` (${selectedMember.baptismDate})` : ""}</p></div>
                <div className="space-y-1"><p className="text-xs text-muted-foreground">Joined</p><p>{selectedMember.joined}</p></div>
                {selectedMember.familyGroup && <div className="space-y-1"><p className="text-xs text-muted-foreground">Family</p><p>{selectedMember.familyGroup}</p></div>}
                {selectedMember.role && <div className="space-y-1"><p className="text-xs text-muted-foreground">Role</p><p>{selectedMember.role}</p></div>}
                {selectedMember.maritalStatus && <div className="space-y-1"><p className="text-xs text-muted-foreground">Marital Status</p><p>{selectedMember.maritalStatus}</p></div>}
                {selectedMember.occupation && <div className="space-y-1"><p className="text-xs text-muted-foreground">Occupation</p><p>{selectedMember.occupation}</p></div>}
                {selectedMember.smallGroup && <div className="space-y-1"><p className="text-xs text-muted-foreground">Small Group</p><p>{selectedMember.smallGroup}</p></div>}
                {selectedMember.spiritualGifts && <div className="space-y-1 col-span-2"><p className="text-xs text-muted-foreground">Spiritual Gifts</p><p>{selectedMember.spiritualGifts}</p></div>}
                {selectedMember.emergencyContact && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p>{selectedMember.emergencyContact}{selectedMember.emergencyPhone ? ` · ${selectedMember.emergencyPhone}` : ""}</p>
                  </div>
                )}
                {selectedMember.notes && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm whitespace-pre-wrap">{selectedMember.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Bulk Import Preview Dialog
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Import Members Preview
            </DialogTitle>
            <DialogDescription>
              {importRows.length} member(s) found in the file. Review before importing.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  {["Name", "Phone", "Email", "Department", "Status", "Baptized", "Family Group"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importRows.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-accent/20">
                    <td className="px-3 py-1.5">{r.name}</td>
                    <td className="px-3 py-1.5">{r.phone}</td>
                    <td className="px-3 py-1.5">{r.email}</td>
                    <td className="px-3 py-1.5">{r.department}</td>
                    <td className="px-3 py-1.5">
                      <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] border ${statusColors[r.status || "Active"]}`}>{r.status}</span>
                    </td>
                    <td className="px-3 py-1.5">{r.baptized ? "Yes" : "No"}</td>
                    <td className="px-3 py-1.5">{r.familyGroup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowImportDialog(false); setImportRows([]); }}>Cancel</Button>
            <Button onClick={commitImport}>
              <Upload className="h-4 w-4 mr-1" />Import {importRows.length} Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
