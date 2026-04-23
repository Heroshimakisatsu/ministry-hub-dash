import { useState } from "react";
import { BookOpen, Plus, Search, FileText, Download, Printer, User, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

type RecordType = "Baptism" | "Marriage" | "Child Dedication" | "Funeral";

interface ChurchRecord {
  id: string;
  type: RecordType;
  primaryPerson: string;
  secondaryPerson?: string;
  date: string;
  officiant: string;
  location: string;
  witnesses?: string[];
  notes?: string;
}

const initialRecords: ChurchRecord[] = [
  { id: "REC001", type: "Baptism", primaryPerson: "Michael Johnson", date: "2026-03-15", officiant: "Pastor Moyo", location: "Main Sanctuary", notes: "Full immersion baptism" },
  { id: "REC002", type: "Marriage", primaryPerson: "Robert Sibanda", secondaryPerson: "Sarah Banda", date: "2026-02-14", officiant: "Pastor Moyo", location: "Main Sanctuary", witnesses: ["Grace Sibanda", "John Banda"] },
  { id: "REC003", type: "Child Dedication", primaryPerson: "Baby Joy Ncube", secondaryPerson: "Mr & Mrs Ncube", date: "2026-04-05", officiant: "Elder David", location: "Main Sanctuary" },
  { id: "REC004", type: "Baptism", primaryPerson: "Lisa Taylor", date: "2026-01-20", officiant: "Pastor Moyo", location: "Community Pool" },
  { id: "REC005", type: "Funeral", primaryPerson: "Elder Thompson (Late)", date: "2026-03-10", officiant: "Pastor Moyo", location: "Church Cemetery" },
];

export function ChurchRecords() {
  const [records, setRecords] = useState<ChurchRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<RecordType | "All">("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "Baptism" as RecordType, primaryPerson: "", secondaryPerson: "", date: "", officiant: "", location: "", notes: "" });

  const filtered = records.filter((r) => {
    const matchType = activeTab === "All" || r.type === activeTab;
    const matchSearch = r.primaryPerson.toLowerCase().includes(search.toLowerCase()) || 
                       (r.secondaryPerson?.toLowerCase() || "").includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleAdd = () => {
    const newR: ChurchRecord = {
      id: `REC${String(records.length + 1).padStart(3, "0")}`,
      ...form
    };
    setRecords((prev) => [newR, ...prev]);
    setShowAdd(false);
    setForm({ type: "Baptism", primaryPerson: "", secondaryPerson: "", date: "", officiant: "", location: "", notes: "" });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Records", value: records.length, color: "text-primary" },
          { label: "Baptisms", value: records.filter(r => r.type === "Baptism").length, color: "text-blue-400" },
          { label: "Marriages", value: records.filter(r => r.type === "Marriage").length, color: "text-rose-400" },
          { label: "Dedications", value: records.filter(r => r.type === "Child Dedication").length, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card-surface p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search records by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Tabs defaultValue="All" onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
            <TabsList className="grid grid-cols-5 h-9">
              <TabsTrigger value="All" className="text-[10px] px-2">All</TabsTrigger>
              <TabsTrigger value="Baptism" className="text-[10px] px-2">Baptism</TabsTrigger>
              <TabsTrigger value="Marriage" className="text-[10px] px-2">Marriage</TabsTrigger>
              <TabsTrigger value="Child Dedication" className="text-[10px] px-2">Dedication</TabsTrigger>
              <TabsTrigger value="Funeral" className="text-[10px] px-2">Funeral</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />Add Record</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="card-surface p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center border shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{r.primaryPerson}</p>
                    {r.secondaryPerson && <span className="text-xs text-muted-foreground">& {r.secondaryPerson}</span>}
                  </div>
                  <p className="text-xs font-medium text-primary mt-0.5">{r.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Printer className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{r.date}</span>
              <span className="flex items-center gap-1.5"><User className="h-3 w-3" />{r.officiant}</span>
              <span className="flex items-center gap-1.5 col-span-2"><MapPin className="h-3 w-3" />{r.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Record Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Register New Church Record</DialogTitle><DialogDescription>Maintain permanent church historical records.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label className="text-xs">Record Type</Label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RecordType })} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {["Baptism", "Marriage", "Child Dedication", "Funeral"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">{form.type === "Child Dedication" ? "Child's Name" : form.type === "Funeral" ? "Deceased Name" : "Person Name"} *</Label><Input value={form.primaryPerson} onChange={(e) => setForm({ ...form, primaryPerson: e.target.value })} /></div>
            {(form.type === "Marriage" || form.type === "Child Dedication") && (
              <div><Label className="text-xs">{form.type === "Marriage" ? "Spouse Name" : "Parents' Names"}</Label><Input value={form.secondaryPerson} onChange={(e) => setForm({ ...form, secondaryPerson: e.target.value })} /></div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Date *</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label className="text-xs">Officiant</Label><Input value={form.officiant} onChange={(e) => setForm({ ...form, officiant: e.target.value })} placeholder="Pastor/Elder name" /></div>
            </div>
            <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Main Sanctuary" /></div>
            <div><Label className="text-xs">Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd}>Save Record</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
