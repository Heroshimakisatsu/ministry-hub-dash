import { useState, useEffect } from "react";
import { CalendarDays, Plus, MapPin, Users, DollarSign, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { getEvents, addEvent, updateEvent, deleteEvent } from "@/data/sharedData";

type EventType = "Sunday Service" | "Midweek Service" | "Conference" | "Crusade" | "Wedding" | "Choir Practice" | "Youth Meeting" | "Special Service" | "Funeral" | "Community Outreach";

interface ChurchEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  expectedAttendance: number;
  actualAttendance?: number;
  budgetIncome: number;
  budgetExpense: number;
  notes: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
}

const initialEvents: ChurchEvent[] = [
  { id: "E001", title: "Easter Sunday Service", type: "Sunday Service", date: "2026-04-12", time: "09:00", location: "Main Sanctuary", expectedAttendance: 500, actualAttendance: 487, budgetIncome: 8000, budgetExpense: 1200, notes: "Special communion and baptismal service", status: "Upcoming" },
  { id: "E002", title: "Youth Evangelism Conference", type: "Conference", date: "2026-04-18", time: "10:00", location: "Church Hall", expectedAttendance: 150, budgetIncome: 2000, budgetExpense: 3500, notes: "Guest speaker: Pastor Emmanuel", status: "Upcoming" },
  { id: "E003", title: "Saturday Choir Practice", type: "Choir Practice", date: "2026-04-11", time: "14:00", location: "Choir Room", expectedAttendance: 35, budgetIncome: 0, budgetExpense: 50, notes: "Rehearsal for Easter Sunday", status: "Upcoming" },
  { id: "E004", title: "Community Outreach — Mbare", type: "Community Outreach", date: "2026-03-28", time: "08:00", location: "Mbare Township", expectedAttendance: 80, actualAttendance: 75, budgetIncome: 500, budgetExpense: 1800, notes: "Food distribution and gospel sharing", status: "Completed" },
  { id: "E005", title: "Johnson-Dube Wedding", type: "Wedding", date: "2026-04-25", time: "11:00", location: "Main Sanctuary", expectedAttendance: 200, budgetIncome: 1500, budgetExpense: 800, notes: "Reception in church hall afterwards", status: "Upcoming" },
];

const eventTypes: EventType[] = ["Sunday Service", "Midweek Service", "Conference", "Crusade", "Wedding", "Choir Practice", "Youth Meeting", "Special Service", "Funeral", "Community Outreach"];

const typeColors: Record<string, string> = {
  "Sunday Service": "bg-primary/15 text-primary border-primary/20",
  "Midweek Service": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Conference: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Crusade: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Wedding: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  "Choir Practice": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Youth Meeting": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "Community Outreach": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Funeral: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  "Special Service": "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

const statusColors: Record<string, string> = {
  Upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Ongoing: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Completed: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  Cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
};

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function EventsCalendar() {
  const [events, setEvents] = useState<ChurchEvent[]>(initialEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [form, setForm] = useState({ title: "", type: "Sunday Service" as EventType, date: "", time: "09:00", location: "", expectedAttendance: "", budgetIncome: "", budgetExpense: "", notes: "" });

  // Load events from shared store on mount
  useEffect(() => {
    const sharedEvents = getEvents();
    if (sharedEvents.length > 0) {
      setEvents(sharedEvents);
    }
  }, []);

  const filtered = filterStatus === "All" ? events : events.filter((e) => e.status === filterStatus);
  const upcoming = events.filter((e) => e.status === "Upcoming").length;

  const handleAdd = () => {
    const newE: ChurchEvent = {
      id: `E${String(events.length + 1).padStart(3, "0")}`,
      title: form.title, type: form.type, date: form.date, time: form.time,
      location: form.location, expectedAttendance: parseInt(form.expectedAttendance) || 0,
      budgetIncome: parseFloat(form.budgetIncome) || 0, budgetExpense: parseFloat(form.budgetExpense) || 0,
      notes: form.notes, status: "Upcoming",
    };
    addEvent(newE);
    setEvents((prev) => [newE, ...prev]);
    // Dispatch custom event for same-tab sync
    window.dispatchEvent(new CustomEvent("eventsUpdated"));
    setShowAdd(false);
    setForm({ title: "", type: "Sunday Service", date: "", time: "09:00", location: "", expectedAttendance: "", budgetIncome: "", budgetExpense: "", notes: "" });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: events.length, color: "text-primary" },
          { label: "Upcoming", value: upcoming, color: "text-blue-400" },
          { label: "Completed", value: events.filter((e) => e.status === "Completed").length, color: "text-emerald-400" },
          { label: "This Month", value: events.filter((e) => e.date.startsWith("2026-04")).length, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card-surface p-4 flex flex-col sm:flex-row gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["All", "Upcoming", "Ongoing", "Completed", "Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />Add Event</Button>
      </div>

      {/* Events list */}
      <div className="space-y-3">
        {filtered.sort((a, b) => a.date.localeCompare(b.date)).map((e) => (
          <div key={e.id} className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{e.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${typeColors[e.type] || "bg-gray-500/15 text-gray-400"}`}>{e.type}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[e.status]}`}>{e.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{e.actualAttendance ?? e.expectedAttendance} {e.actualAttendance ? "attended" : "expected"}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1"><DollarSign className="h-3 w-3" />Income: {fmt(e.budgetIncome)}</span>
                  <span className="text-red-400 flex items-center gap-1"><DollarSign className="h-3 w-3" />Expenses: {fmt(e.budgetExpense)}</span>
                  <span className={e.budgetIncome - e.budgetExpense >= 0 ? "text-emerald-400" : "text-red-400"}>Net: {fmt(e.budgetIncome - e.budgetExpense)}</span>
                </div>
                {e.notes && <p className="text-xs text-muted-foreground italic">{e.notes}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded-md hover:bg-accent transition-colors"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button onClick={() => setEvents((prev) => prev.filter((x) => x.id !== e.id))} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Church Event</DialogTitle><DialogDescription>Schedule a new event on the church calendar.</DialogDescription></DialogHeader>
          <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div><Label className="text-xs">Event Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Easter Sunday Service" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Event Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as EventType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Main Sanctuary" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Date *</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label className="text-xs">Time</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Expected Attendance</Label><Input type="number" value={form.expectedAttendance} onChange={(e) => setForm({ ...form, expectedAttendance: e.target.value })} placeholder="0" /></div>
              <div><Label className="text-xs">Budget Income ($)</Label><Input type="number" value={form.budgetIncome} onChange={(e) => setForm({ ...form, budgetIncome: e.target.value })} placeholder="0" /></div>
              <div><Label className="text-xs">Budget Expenses ($)</Label><Input type="number" value={form.budgetExpense} onChange={(e) => setForm({ ...form, budgetExpense: e.target.value })} placeholder="0" /></div>
            </div>
            <div><Label className="text-xs">Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional details…" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={handleAdd}>Add Event</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
