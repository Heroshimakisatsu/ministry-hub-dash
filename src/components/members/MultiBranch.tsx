import { useState } from "react";
import { GitBranch, Plus, MapPin, Users, DollarSign, ArrowUpRight, Building2, Search, Edit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface Branch {
  id: string;
  name: string;
  location: string;
  pastor: string;
  members: number;
  monthlyRevenue: number;
  growthStatus: "Up" | "Down" | "Stable";
  establishedDate: string;
}

const initialBranches: Branch[] = [
  { id: "BR001", name: "Main Sanctuary (HQ)", location: "Highlands, Harare", pastor: "Senior Pastor Moyo", members: 312, monthlyRevenue: 12500, growthStatus: "Up", establishedDate: "2015-01-10" },
  { id: "BR002", name: "Ministry Hub South", location: "Chitungwiza", pastor: "Pastor Sibanda", members: 145, monthlyRevenue: 4200, growthStatus: "Up", establishedDate: "2020-05-15" },
  { id: "BR003", name: "City Center Chapel", location: "Harare CBD", pastor: "Pastor Banda", members: 88, monthlyRevenue: 2100, growthStatus: "Stable", establishedDate: "2022-11-20" },
  { id: "BR004", name: "Ministry Hub Bulawayo", location: "Hillside, Bulawayo", pastor: "Elder David", members: 56, monthlyRevenue: 1800, growthStatus: "Up", establishedDate: "2024-02-05" },
];

export function MultiBranch() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", pastor: "", members: "" });

  const totalMembers = branches.reduce((s, b) => s + b.members, 0);
  const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);

  const handleAdd = () => {
     const newB: Branch = {
       id: `BR${String(branches.length + 1).padStart(3, "0")}`,
       name: form.name, location: form.location, pastor: form.pastor,
       members: parseInt(form.members) || 0,
       monthlyRevenue: 0, growthStatus: "Stable", establishedDate: new Date().toISOString().split('T')[0]
     };
     setBranches(prev => [...prev, newB]);
     setShowAdd(false);
     setForm({ name: "", location: "", pastor: "", members: "" });
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card-surface p-4 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">Total Branches</p><p className="text-2xl font-bold text-primary">{branches.length}</p></div>
          <GitBranch className="h-8 w-8 text-primary shadow-sm" />
        </div>
        <div className="card-surface p-4 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">Total Ministry Members</p><p className="text-2xl font-bold text-blue-400">{totalMembers}</p></div>
          <Users className="h-8 w-8 text-blue-400 shadow-sm" />
        </div>
        <div className="card-surface p-4 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">Global Monthly Revenue</p><p className="text-2xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p></div>
          <DollarSign className="h-8 w-8 text-emerald-400 shadow-sm" />
        </div>
      </div>

      <div className="card-surface p-4 flex items-center justify-between">
         <h3 className="text-sm font-semibold">Consolidated Branch Oversight</h3>
         <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />Add New Branch</Button>
      </div>

      {/* Branch Table */}
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-accent/40">
            <tr className="border-b text-left">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branch Details</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pastor</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Members</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rev (Est)</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors pointer-cursor">
                <td className="px-4 py-4">
                  <div className="font-bold text-sm text-foreground">{b.name}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{b.location}</div>
                </td>
                <td className="px-4 py-4 text-xs font-medium">{b.pastor}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{b.members}</span>
                    {b.growthStatus === "Up" && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-emerald-400">${b.monthlyRevenue.toLocaleString()}</td>
                <td className="px-4 py-4 text-right">
                   <Button variant="ghost" size="sm" className="h-8 group">
                     Manage <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Branch Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Register New Branch</DialogTitle><DialogDescription>Extend your ministry territory.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label className="text-xs">Branch Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ministry Hub North" /></div>
            <div className="grid gap-2"><Label className="text-xs">Location Address</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Area" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label className="text-xs">Resident Pastor</Label><Input value={form.pastor} onChange={(e) => setForm({ ...form, pastor: e.target.value })} /></div>
              <div className="grid gap-2"><Label className="text-xs">Initial Member Count</Label><Input type="number" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} placeholder="0" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd}>Confirm Branch</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
