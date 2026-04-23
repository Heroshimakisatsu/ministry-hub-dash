import { Check, Plus, Trash2, Calendar, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/mo",
    desc: "For small churches getting started",
    features: [
      "Up to 200 members",
      "Basic reporting",
      "Email support",
      "1 admin user",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    desc: "For growing congregations",
    features: [
      "Up to 2,000 members",
      "Advanced analytics",
      "Priority support",
      "5 admin users",
      "Custom branding",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    desc: "For multi-campus organizations",
    features: [
      "Unlimited members",
      "Multi-campus support",
      "24/7 phone support",
      "Unlimited admins",
      "API access",
      "Custom integrations",
    ],
    current: false,
  },
];

interface EventConfig {
  id: string;
  name: string;
  date: string;
  description?: string;
}

const initialEvents: EventConfig[] = [
  { id: "1", name: "Easter Service", date: "2026-04-12", description: "Annual Easter celebration service" },
  { id: "2", name: "Christmas Eve", date: "2026-12-24", description: "Christmas Eve candlelight service" },
  { id: "3", name: "Church Anniversary", date: "2026-06-15", description: "50th Church Anniversary celebration" },
];

export function SubscriptionPlans() {
  const [activeTab, setActiveTab] = useState<"subscription" | "events">("subscription");
  const [events, setEvents] = useState<EventConfig[]>(initialEvents);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventConfig | null>(null);
  const [eventForm, setEventForm] = useState({ name: "", date: "", description: "" });

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ name: "", date: "", description: "" });
    setShowEventDialog(true);
  };

  const handleEditEvent = (event: EventConfig) => {
    setEditingEvent(event);
    setEventForm({ name: event.name, date: event.date, description: event.description || "" });
    setShowEventDialog(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...editingEvent, ...eventForm } : e)));
    } else {
      const newEvent: EventConfig = {
        id: String(events.length + 1),
        ...eventForm,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setShowEventDialog(false);
    setEventForm({ name: "", date: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "subscription"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Subscription Plans
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "events"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Event Configuration
        </button>
      </div>

      {activeTab === "subscription" ? (
        <>
          <div className="mb-6">
            <h3 className="text-sm font-semibold">Subscription Plans</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Choose the right plan for your ministry</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card-surface p-5 flex flex-col ${
                  plan.current ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.current && (
                  <span className="text-[11px] font-semibold text-primary tracking-wider mb-2">
                    CURRENT PLAN
                  </span>
                )}
                <h4 className="text-lg font-bold">{plan.name}</h4>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{plan.desc}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-trend-up shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-5 h-9 rounded-xl text-sm font-medium transition-colors ${
                    plan.current
                      ? "bg-accent text-muted-foreground cursor-default"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Event Configuration</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Configure events for attendance tracking</p>
              </div>
              <Button size="sm" onClick={handleAddEvent}>
                <Plus className="h-4 w-4 mr-1" />Add Event
              </Button>
            </div>
          </div>
          <div className="card-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">EVENT NAME</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">DATE</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">DESCRIPTION</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {event.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{event.date}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{event.description || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEditEvent(event)}
                        >
                          <SettingsIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground text-sm">
                      No events configured. Click "Add Event" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update event details" : "Configure a new event for attendance tracking"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs">Event Name *</Label>
              <Input
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                placeholder="e.g. Easter Service"
              />
            </div>
            <div>
              <Label className="text-xs">Event Date *</Label>
              <Input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Event description..."
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent}>{editingEvent ? "Update" : "Add"} Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
