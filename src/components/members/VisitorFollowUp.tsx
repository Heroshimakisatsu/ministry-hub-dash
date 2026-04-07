import { useState } from "react";
import { UserPlus, Phone, MessageSquare, CheckCircle2, AlertCircle, Clock, X, Search, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  firstVisit: string;
  visits: number;
  assignedTo: string;
  followUpStatus: "Pending" | "Called" | "Visited" | "Joined" | "Not Reachable";
  notes: string;
  isFirstTime: boolean;
}

const initialVisitors: Visitor[] = [
  { id: "V001", name: "Maria Garcia", phone: "+263 71 345 6789", email: "maria@email.com", source: "Friend Invitation", firstVisit: "Mar 2, 2026", visits: 3, assignedTo: "Sarah Johnson", followUpStatus: "Called", notes: "Interested in Youth Ministry", isFirstTime: false },
  { id: "V002", name: "Lisa Taylor", phone: "+263 71 789 0123", email: "lisa@email.com", source: "Social Media", firstVisit: "Feb 16, 2026", visits: 2, assignedTo: "David Kim", followUpStatus: "Visited", notes: "Lives nearby, looking for a church home", isFirstTime: false },
  { id: "V003", name: "Michael Banda", phone: "+263 77 111 2222", email: "michael.b@email.com", source: "Walk-in", firstVisit: "Apr 6, 2026", visits: 1, assignedTo: "Unassigned", followUpStatus: "Pending", notes: "", isFirstTime: true },
  { id: "V004", name: "Ruth Chikwanha", phone: "+263 78 333 4444", email: "ruth@email.com", source: "Crusade", firstVisit: "Mar 23, 2026", visits: 2, assignedTo: "Grace Dube", followUpStatus: "Called", notes: "Wants to join Women's Ministry", isFirstTime: false },
  { id: "V005", name: "Thomas Ndlovu", phone: "+263 77 555 6666", email: "", source: "Community Event", firstVisit: "Mar 30, 2026", visits: 1, assignedTo: "John Moyo", followUpStatus: "Not Reachable", notes: "Phone off. Try again next week.", isFirstTime: true },
  { id: "V006", name: "Alice Mutasa", phone: "+263 71 777 8888", email: "alice.m@email.com", source: "Friend Invitation", firstVisit: "Feb 2, 2026", visits: 6, assignedTo: "Sarah Johnson", followUpStatus: "Joined", notes: "Now a registered member! Joined Choir.", isFirstTime: false },
];

const followUpTeam = ["Sarah Johnson", "David Kim", "Grace Dube", "John Moyo", "Robert Wilson"];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Pending: { color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
  Called: { color: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: Phone },
  Visited: { color: "bg-purple-500/15 text-purple-400 border-purple-500/20", icon: MessageSquare },
  Joined: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  "Not Reachable": { color: "bg-red-500/15 text-red-400 border-red-500/20", icon: AlertCircle },
};

export function VisitorFollowUp() {
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", source: "Walk-in", assignedTo: "Unassigned" });

  const filtered = visitors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.phone.includes(search);
    const matchStatus = filterStatus === "All" || v.followUpStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: visitors.length,
    pending: visitors.filter((v) => v.followUpStatus === "Pending").length,
    inProgress: visitors.filter((v) => ["Called", "Visited"].includes(v.followUpStatus)).length,
    converted: visitors.filter((v) => v.followUpStatus === "Joined").length,
    firstTimers: visitors.filter((v) => v.isFirstTime).length,
  };

  const conversionRate = stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;

  const handleAdd = () => {
    const newVisitor: Visitor = {
      id: `V${String(visitors.length + 1).padStart(3, "0")}`,
      name: formData.name, phone: formData.phone, email: formData.email, source: formData.source,
      firstVisit: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      visits: 1, assignedTo: formData.assignedTo, followUpStatus: "Pending", notes: "", isFirstTime: true,
    };
    setVisitors((prev) => [newVisitor, ...prev]);
    setShowAddDialog(false);
    setFormData({ name: "", phone: "", email: "", source: "Walk-in", assignedTo: "Unassigned" });
  };

  const updateStatus = (id: string, status: Visitor["followUpStatus"]) => {
    setVisitors((prev) => prev.map((v) => v.id === id ? { ...v, followUpStatus: status } : v));
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Visitors", value: stats.total, color: "text-primary" },
          { label: "First-Timers", value: stats.firstTimers, color: "text-blue-400" },
          { label: "Pending Follow-Up", value: stats.pending, color: "text-amber-400" },
          { label: "In Progress", value: stats.inProgress, color: "text-purple-400" },
          { label: "Converted", value: `${stats.converted} (${conversionRate}%)`, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Urgent: Pending follow-ups */}
      {stats.pending > 0 && (
        <div className="card-surface p-4 border-l-4 border-amber-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-medium">⚠ {stats.pending} visitor{stats.pending > 1 ? "s" : ""} awaiting follow-up</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Assign a team member and initiate contact within 48 hours for best retention.</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="card-surface p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search visitors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Called">Called</SelectItem>
              <SelectItem value="Visited">Visited</SelectItem>
              <SelectItem value="Joined">Joined</SelectItem>
              <SelectItem value="Not Reachable">Not Reachable</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddDialog(true)} size="sm"><Plus className="h-4 w-4 mr-1" />Register Visitor</Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((v) => {
          const StatusIcon = statusConfig[v.followUpStatus].icon;
          return (
            <div key={v.id} className="card-surface p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                    {v.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{v.name}</p>
                      {v.isFirstTime && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">NEW</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.source} · {v.visits} visit{v.visits > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig[v.followUpStatus].color}`}>
                  <StatusIcon className="h-3 w-3" />{v.followUpStatus}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" />{v.phone}</p>
                {v.email && <p className="text-muted-foreground">{v.email}</p>}
                <p className="text-muted-foreground">First visit: {v.firstVisit}</p>
                <p className="text-muted-foreground">Assigned: <span className="text-foreground">{v.assignedTo}</span></p>
                {v.notes && <p className="text-muted-foreground italic">"{v.notes}"</p>}
              </div>

              <div className="flex gap-1.5 pt-1 border-t">
                {v.followUpStatus !== "Joined" && (
                  <Select onValueChange={(val) => updateStatus(v.id, val as Visitor["followUpStatus"])}>
                    <SelectTrigger className="h-7 text-[10px] flex-1"><SelectValue placeholder="Update status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Called">Mark Called</SelectItem>
                      <SelectItem value="Visited">Mark Visited</SelectItem>
                      <SelectItem value="Joined">Mark Joined ✓</SelectItem>
                      <SelectItem value="Not Reachable">Not Reachable</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {v.followUpStatus === "Joined" && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Converted to Member
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Visitor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register New Visitor</DialogTitle>
            <DialogDescription>Capture visitor details for follow-up</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Full Name *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Visitor name" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Phone *</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+263 77..." /></div>
              <div><Label className="text-xs">Email</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Optional" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">How they heard about us</Label>
                <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Friend Invitation">Friend Invitation</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Crusade">Crusade</SelectItem>
                    <SelectItem value="Community Event">Community Event</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Assign to</Label>
                <Select value={formData.assignedTo} onValueChange={(v) => setFormData({ ...formData, assignedTo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                    {followUpTeam.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Register Visitor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
