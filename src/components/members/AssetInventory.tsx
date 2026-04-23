import { useState } from "react";
import { Package, Plus, Search, Tag, MapPin, ClipboardList, PenTool, CheckCircle2, History, AlertTriangle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type AssetCondition = "New" | "Good" | "Fair" | "Needs Repair" | "Damaged";

interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber?: string;
  condition: AssetCondition;
  location: string;
  status: "Stored" | "In Use" | "Borrowed" | "Repairing";
  assignedTo?: string;
  purchaseDate?: string;
  value?: number;
}

const initialAssets: Asset[] = [
  { id: "AST001", name: "Yamaha Digital Drum Kit", category: "Instruments", serialNumber: "YAM-88219", condition: "Good", location: "Main Sanctuary", status: "In Use" },
  { id: "AST002", name: "JBL EON Speakers (Pair)", category: "Audio Gear", serialNumber: "JBL-7712", condition: "Fair", location: "Storage Room A", status: "Stored" },
  { id: "AST003", name: "High-Back Plastic Chairs", category: "Furniture", condition: "Good", location: "Church Hall", status: "In Use", assignedTo: "Choir (30 units)" },
  { id: "AST004", name: "BenQ Projector", category: "Electronics", serialNumber: "BQ-9910", condition: "Needs Repair", location: "Office", status: "Repairing" },
  { id: "AST005", name: "Honda Generator 5KVA", category: "Maintenance", condition: "Fair", location: "Generator Shed", status: "Stored" },
];

const conditionColors: Record<AssetCondition, string> = {
  New: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Good: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Fair: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Needs Repair": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Damaged: "bg-red-500/15 text-red-400 border-red-500/20",
};

export function AssetInventory() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Instruments", serialNumber: "", condition: "Good" as AssetCondition, location: "", status: "Stored" as Asset["status"] });

  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    const newA: Asset = {
      id: `AST${String(assets.length + 1).padStart(3, "0")}`,
      ...form
    };
    setAssets(prev => [...prev, newA]);
    setShowAdd(false);
    setForm({ name: "", category: "Instruments", serialNumber: "", condition: "Good", location: "", status: "Stored" });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Assets", value: assets.length, color: "text-primary" },
          { label: "Needs Repair", value: assets.filter(a => a.condition === "Needs Repair").length, color: "text-orange-400" },
          { label: "Currently Stored", value: assets.filter(a => a.status === "Stored").length, color: "text-blue-400" },
          { label: "Asset Value", value: `$${assets.reduce((s, a) => s + (a.value || 0), 12500)}`, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card-surface p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assets by name or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />Register Asset</Button>
      </div>

      <div className="overflow-x-auto card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset Item</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm">{a.name}</div>
                  {a.serialNumber && <div className="text-[10px] text-muted-foreground uppercase">{a.serialNumber}</div>}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.category}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-[10px] font-medium border ${conditionColors[a.condition]}`}>{a.condition}</Badge>
                </td>
                <td className="px-4 py-3 text-xs flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" />{a.location}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
                    a.status === 'In Use' ? 'text-blue-400' : a.status === 'Repairing' ? 'text-orange-400' : 'text-muted-foreground'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Tag className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><History className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Register New Asset</DialogTitle><DialogDescription>Add equipment or furniture to the church inventory.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Asset Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Roland Keyboard" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Instruments", "Audio Gear", "Furniture", "Electronics", "Maintenance", "Vehicles", "Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Serial Number</Label><Input value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} placeholder="Optional" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Condition</Label>
                <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v as AssetCondition })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["New", "Good", "Fair", "Needs Repair", "Damaged"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Current Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Storage A" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd}>Add to Inventory</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
