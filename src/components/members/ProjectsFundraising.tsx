import { useState } from "react";
import { Target, Plus, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface Campaign {
  id: string;
  name: string;
  description: string;
  target: number;
  raised: number;
  donors: number;
  deadline: string;
  status: "Active" | "Completed" | "Paused";
  color: string;
}

interface Contribution {
  id: string; campaignId: string; campaignName: string; donor: string; amount: number; date: string; method: string;
}

const initialCampaigns: Campaign[] = [
  { id: "C001", name: "New Sanctuary Building Fund", description: "Construction of main sanctuary to accommodate 1,000 members", target: 50000, raised: 32500, donors: 148, deadline: "Dec 2027", status: "Active", color: "bg-primary" },
  { id: "C002", name: "Borehole Drilling Project", description: "Clean water access for the church and community", target: 8000, raised: 7800, donors: 62, deadline: "Jun 2026", status: "Active", color: "bg-emerald-500" },
  { id: "C003", name: "Church Bus Purchase", description: "14-seater bus for youth and event transport", target: 15000, raised: 15000, donors: 89, deadline: "Jan 2026", status: "Completed", color: "bg-blue-500" },
  { id: "C004", name: "Missions Trip — Malawi", description: "Annual missions outreach to Malawi (team of 8)", target: 5000, raised: 1200, donors: 18, deadline: "Aug 2026", status: "Active", color: "bg-amber-500" },
];

const contributions: Contribution[] = [
  { id: "D001", campaignId: "C001", campaignName: "New Sanctuary", donor: "James Brown", amount: 500, date: "Apr 6, 2026", method: "EcoCash" },
  { id: "D002", campaignId: "C002", campaignName: "Borehole Drilling", donor: "Anonymous", amount: 200, date: "Apr 4, 2026", method: "Cash" },
  { id: "D003", campaignId: "C001", campaignName: "New Sanctuary", donor: "Sarah Johnson", amount: 1000, date: "Apr 3, 2026", method: "Bank Transfer" },
  { id: "D004", campaignId: "C004", campaignName: "Missions — Malawi", donor: "Choir Group", amount: 300, date: "Apr 1, 2026", method: "Cash" },
  { id: "D005", campaignId: "C001", campaignName: "New Sanctuary", donor: "John Moyo", amount: 750, date: "Mar 30, 2026", method: "EcoCash" },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Completed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function ProjectsFundraising() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showAdd, setShowAdd] = useState(false);
  const [showContrib, setShowContrib] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState({ name: "", description: "", target: "", deadline: "" });
  const [contribForm, setContribForm] = useState({ donor: "", amount: "", method: "Cash" });

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const totalTarget = campaigns.reduce((s, c) => s + c.target, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;

  const handleAddCampaign = () => {
    const newC: Campaign = {
      id: `C${String(campaigns.length + 1).padStart(3, "0")}`,
      name: form.name, description: form.description,
      target: parseFloat(form.target) || 0, raised: 0, donors: 0,
      deadline: form.deadline, status: "Active", color: "bg-violet-500",
    };
    setCampaigns((prev) => [newC, ...prev]);
    setShowAdd(false);
    setForm({ name: "", description: "", target: "", deadline: "" });
  };

  const handleAddContrib = () => {
    if (!selectedCampaign) return;
    const amount = parseFloat(contribForm.amount) || 0;
    setCampaigns((prev) => prev.map((c) =>
      c.id === selectedCampaign.id ? { ...c, raised: c.raised + amount, donors: c.donors + 1 } : c
    ));
    setShowContrib(false);
    setContribForm({ donor: "", amount: "", method: "Cash" });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Raised", value: fmt(totalRaised), color: "text-emerald-400" },
          { label: "Total Target", value: fmt(totalTarget), color: "text-primary" },
          { label: "Active Campaigns", value: activeCampaigns, color: "text-blue-400" },
          { label: "Overall Progress", value: `${Math.round((totalRaised / totalTarget) * 100)}%`, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card-surface p-4 flex justify-between items-center">
        <p className="text-sm font-medium">Fundraising Campaigns</p>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />New Campaign</Button>
      </div>

      {/* Campaign Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {campaigns.map((c) => {
          const pct = Math.min(100, Math.round((c.raised / c.target) * 100));
          return (
            <div key={c.id} className="card-surface p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ml-2 ${statusColors[c.status]}`}>{c.status}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-emerald-400">{fmt(c.raised)}</span>
                  <span className="text-muted-foreground">of {fmt(c.target)} ({pct}%)</span>
                </div>
                <div className="h-2.5 bg-accent rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.donors} donors</span>
                <span>Deadline: {c.deadline}</span>
              </div>
              {c.status === "Active" && (
                <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => { setSelectedCampaign(c); setShowContrib(true); }}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Record Contribution
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Contributions */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b"><h3 className="text-sm font-semibold">Recent Contributions</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left">
              {["DONOR", "CAMPAIGN", "AMOUNT", "METHOD", "DATE"].map((h) =>
                <th key={h} className="px-4 py-2 text-xs font-semibold text-muted-foreground">{h}</th>
              )}
            </tr></thead>
            <tbody>
              {contributions.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-2.5 font-medium">{d.donor}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{d.campaignName}</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-semibold">{fmt(d.amount)}</td>
                  <td className="px-4 py-2.5 text-xs">{d.method}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Fundraising Campaign</DialogTitle><DialogDescription>Set a goal and start collecting contributions.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Campaign Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Building Fund 2026" /></div>
            <div><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Target Amount ($) *</Label><Input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="0.00" /></div>
              <div><Label className="text-xs">Deadline</Label><Input value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} placeholder="e.g. Dec 2027" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAddCampaign}>Create Campaign</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Contribution Dialog */}
      <Dialog open={showContrib} onOpenChange={setShowContrib}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Record Contribution</DialogTitle><DialogDescription>{selectedCampaign?.name}</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Donor Name</Label><Input value={contribForm.donor} onChange={(e) => setContribForm({ ...contribForm, donor: e.target.value })} placeholder="or 'Anonymous'" /></div>
            <div><Label className="text-xs">Amount ($) *</Label><Input type="number" value={contribForm.amount} onChange={(e) => setContribForm({ ...contribForm, amount: e.target.value })} placeholder="0.00" /></div>
            <div><Label className="text-xs">Payment Method</Label>
              <select value={contribForm.method} onChange={(e) => setContribForm({ ...contribForm, method: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {["Cash", "EcoCash", "OneMoney", "Bank Transfer", "Paynow"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowContrib(false)}>Cancel</Button><Button onClick={handleAddContrib}>Save Contribution</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
