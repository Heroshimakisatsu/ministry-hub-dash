import { useState } from "react";
import { Heart, Plus, Clock, CheckCircle2, XCircle, Search, User, MessageSquare, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type RequestType = "Financial Assistance" | "Food / Groceries" | "Counseling" | "Hospital Visit" | "Emergency Support";
type RequestStatus = "Pending" | "Approved" | "Declined" | "Completed";

interface WelfareRequest {
  id: string;
  requester: string;
  type: RequestType;
  amount?: number;
  date: string;
  status: RequestStatus;
  description: string;
  assignedTo?: string;
  notes?: string;
}

const initialRequests: WelfareRequest[] = [
  { id: "WF001", requester: "Sarah Banda", type: "Financial Assistance", amount: 150, date: "2026-04-06", status: "Pending", description: "Need help with school fees for son", assignedTo: "Elder Moyo" },
  { id: "WF002", requester: "John Dube", type: "Food / Groceries", date: "2026-04-05", status: "Approved", description: "Unemployed, family of 5 needing basic food items", assignedTo: "Deaconess Sibanda" },
  { id: "WF003", requester: "Maria Phiri", type: "Counseling", date: "2026-04-02", status: "Completed", description: "Grief counseling after loss of spouse", assignedTo: "Pastor Moyo", notes: "Completed 3 sessions" },
  { id: "WF004", requester: "James Ncube", type: "Hospital Visit", date: "2026-04-01", status: "Completed", description: "Hospitalized at Parirenyatwa room 12", assignedTo: "Elder David" },
  { id: "WF005", requester: "Lisa Gumbo", type: "Emergency Support", amount: 300, date: "2026-03-30", status: "Declined", description: "Request for rental assistance", notes: "Member has already received maximum annual support" },
];

const statusColors: Record<RequestStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Declined: "bg-red-500/15 text-red-400 border-red-500/20",
  Completed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

export function WelfareCounseling() {
  const [requests, setRequests] = useState<WelfareRequest[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ requester: "", type: "Financial Assistance" as RequestType, amount: "", description: "" });

  const filtered = requests.filter(r => r.requester.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
  const pendingCount = requests.filter(r => r.status === "Pending").length;

  const handleAdd = () => {
    const newR: WelfareRequest = {
      id: `WF${String(requests.length + 1).padStart(3, "0")}`,
      requester: form.requester, type: form.type, amount: form.amount ? parseFloat(form.amount) : undefined,
      date: new Date().toISOString().split('T')[0], status: "Pending", description: form.description
    };
    setRequests(prev => [newR, ...prev]);
    setShowAdd(false);
    setForm({ requester: "", type: "Financial Assistance", amount: "", description: "" });
  };

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Requests", value: requests.length, color: "text-primary" },
          { label: "Pending Approval", value: pendingCount, color: "text-amber-400" },
          { label: "Supported (YTD)", value: requests.filter(r => r.status === "Approved" || r.status === "Completed").length, color: "text-emerald-400" },
          { label: "Welfare Fund Used", value: `$${requests.filter(r => r.status === "Approved" && r.amount).reduce((s, r) => s + (r.amount || 0), 0)}`, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {pendingCount > 0 && (
        <div className="card-surface p-4 border-l-4 border-amber-500 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-medium">{pendingCount} welfare requests awaiting board approval.</p>
          </div>
        </div>
      )}

      <div className="card-surface p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />New Request</Button>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{r.requester}</p>
                  <Badge variant="outline" className={`text-[10px] font-medium border ${statusColors[r.status]}`}>{r.status}</Badge>
                  <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded-full text-muted-foreground font-medium">{r.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                   {r.amount && <span className="flex items-center gap-1.5 text-foreground font-medium"><DollarSign className="h-3 w-3" />${r.amount}</span>}
                   <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{r.date}</span>
                   {r.assignedTo && <span className="flex items-center gap-1.5"><User className="h-3 w-3" />Assigned: {r.assignedTo}</span>}
                </div>
                {r.notes && <p className="text-xs text-muted-foreground italic bg-accent/30 p-2 rounded">Note: {r.notes}</p>}
              </div>
              {r.status === "Pending" && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="h-8 text-xs border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10" onClick={() => updateStatus(r.id, "Approved")}>Approve</Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => updateStatus(r.id, "Declined")}>Decline</Button>
                </div>
              )}
              {r.status === "Approved" && (
                <Button variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={() => updateStatus(r.id, "Completed")}>Mark Completed</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Request Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Welfare Request</DialogTitle><DialogDescription>Capture details for member assistance or counseling.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Requester Name *</Label><Input value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Request Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as RequestType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Financial Assistance", "Food / Groceries", "Counseling", "Hospital Visit", "Emergency Support"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Amount ($) if applicable</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            </div>
            <div><Label className="text-xs">Description of Need *</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd}>Submit Request</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
