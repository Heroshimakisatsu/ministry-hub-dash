import { useState, useEffect } from "react";
import { Megaphone, Send, Users, Bell, MessageSquare, Mail, Phone, Plus, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { getCommunications, addCommunication, addAnnouncement } from "@/data/sharedData";

type Channel = "All Channels" | "Member Portal" | "SMS" | "WhatsApp" | "Email";
type Audience = "All Members" | "Member Portal" | "Youth Ministry" | "Choir" | "Women's Ministry" | "Men's Group" | "Ushers" | "Deacons" | "Leaders Only" | "Visitors";

interface Message {
  id: string;
  date: string;
  channels: Channel[];
  audience: Audience;
  subject: string;
  body: string;
  sent: number;
  status: "Delivered" | "Partial" | "Failed";
  isEmergency: boolean;
}

const initialMessages: Message[] = [
  { id: "MSG001", date: "Apr 6, 2026", channels: ["SMS"], audience: "All Members", subject: "Sunday Reminder", body: "Join us this Sunday at 9AM for our regular service. Come blessed!", sent: 298, status: "Delivered", isEmergency: false },
  { id: "MSG002", date: "Apr 4, 2026", channels: ["WhatsApp"], audience: "Youth Ministry", subject: "Youth Meeting Rescheduled", body: "Youth meeting moved to Saturday 3PM. Venue: Main Hall.", sent: 55, status: "Delivered", isEmergency: false },
  { id: "MSG003", date: "Apr 2, 2026", channels: ["Email"], audience: "Leaders Only", subject: "Elders' Board Meeting", body: "Elders and deacons are requested to attend a board meeting on Thursday 6PM.", sent: 12, status: "Delivered", isEmergency: false },
  { id: "MSG004", date: "Mar 29, 2026", channels: ["SMS"], audience: "All Members", subject: "URGENT: Prayer Alert", body: "Please pray for Sister Grace who is hospitalized. Prayer chain active.", sent: 295, status: "Partial", isEmergency: true },
];

const audiences: Audience[] = ["All Members", "Member Portal", "Youth Ministry", "Choir", "Women's Ministry", "Men's Group", "Ushers", "Deacons", "Leaders Only", "Visitors"];

const channelColors: Record<Channel, string> = {
  "All Channels": "bg-primary/15 text-primary border-primary/20",
  "Member Portal": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  SMS: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  WhatsApp: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Email: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const channelIcons: Record<Channel, typeof Phone> = {
  "All Channels": Megaphone,
  "Member Portal": Users,
  SMS: Phone,
  WhatsApp: MessageSquare,
  Email: Mail,
};

export function CommunicationSystem() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(["All Channels"]);
  const [form, setForm] = useState({ audience: "All Members" as Audience, subject: "", body: "" });

  useEffect(() => {
    const stored = getCommunications();
    if (stored.length > 0) {
      setMessages(stored);
    } else {
      setMessages(initialMessages);
    }
  }, []);

  const handleChannelToggle = (channel: Channel) => {
    if (channel === "All Channels") {
      if (selectedChannels.includes("All Channels")) {
        setSelectedChannels([]);
      } else {
        setSelectedChannels(["All Channels", "Member Portal", "SMS", "WhatsApp", "Email"]);
      }
    } else {
      if (selectedChannels.includes(channel)) {
        const newChannels = selectedChannels.filter(c => c !== channel);
        if (newChannels.length === 0) {
          setSelectedChannels(["All Channels"]);
        } else {
          setSelectedChannels(newChannels.filter(c => c !== "All Channels"));
        }
      } else {
        setSelectedChannels([...selectedChannels.filter(c => c !== "All Channels"), channel]);
      }
    }
  };

  const handleSend = () => {
    const channelsToSend: Channel[] = selectedChannels.includes("All Channels")
      ? ["SMS", "WhatsApp", "Email"]
      : selectedChannels;
    const newMsg: Message = {
      id: `MSG${String(messages.length + 1).padStart(3, "0")}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      channels: channelsToSend, audience: form.audience, subject: form.subject || "(No Subject)",
      body: form.body, sent: Math.floor(Math.random() * 200) + 50,
      status: "Delivered", isEmergency,
    };
    setMessages((prev) => [newMsg, ...prev]);
    addCommunication(newMsg);

    // If Member Portal channel is selected, also create an announcement
    if (channelsToSend.includes("Member Portal")) {
      const announcement = {
        id: `A${String(Date.now()).slice(-3)}`,
        title: form.subject || "(No Subject)",
        content: form.body,
        type: "branch",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        priority: isEmergency ? "high" : "medium"
      };
      addAnnouncement(announcement);
      // Dispatch custom event for same-tab sync
      window.dispatchEvent(new CustomEvent("announcementsUpdated"));
    }

    setShowCompose(false);
    setSelectedChannels(["All Channels"]);
    setForm({ audience: "All Members", subject: "", body: "" });
    setIsEmergency(false);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Sent", value: messages.reduce((s, m) => s + m.sent, 0).toLocaleString(), color: "text-primary" },
          { label: "SMS Campaigns", value: messages.filter((m) => m.channels.includes("SMS")).length, color: "text-blue-400" },
          { label: "WhatsApp Blasts", value: messages.filter((m) => m.channels.includes("WhatsApp")).length, color: "text-emerald-400" },
          { label: "Emergency Alerts", value: messages.filter((m) => m.isEmergency).length, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Compose bar */}
      <div className="card-surface p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 text-sm text-muted-foreground bg-accent/40 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-accent/60 transition-colors" onClick={() => setShowCompose(true)}>
            <MessageSquare className="h-4 w-4" />
            <span>Compose a message to your congregation…</span>
          </div>
          <Button onClick={() => { setIsEmergency(true); setShowCompose(true); }} variant="destructive" size="sm">
            <AlertTriangle className="h-4 w-4 mr-1" /> Emergency Alert
          </Button>
          <Button onClick={() => setShowCompose(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> New Message
          </Button>
        </div>
      </div>

      {/* Recent messages */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b"><h3 className="text-sm font-semibold">Sent Messages</h3><p className="text-xs text-muted-foreground mt-0.5">All outgoing communications</p></div>
        <div className="divide-y">
          {messages.map((m) => {
            const primaryChannel = m.channels[0];
            const Icon = channelIcons[primaryChannel];
            return (
              <div key={m.id} className="p-4 hover:bg-accent/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${channelColors[primaryChannel].split(" ").slice(0,1)[0]}`}>
                      <Icon className={`h-4 w-4 ${channelColors[primaryChannel].split(" ")[1]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{m.subject}</p>
                        {m.isEmergency && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full font-semibold">EMERGENCY</span>}
                        {m.channels.map((ch) => (
                          <span key={ch} className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${channelColors[ch]}`}>{ch}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{m.body}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{m.audience}</span>
                        <span className="flex items-center gap-1"><Send className="h-3 w-3" />{m.sent} recipients</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${
                    m.status === "Delivered" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    : m.status === "Partial" ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                    : "bg-red-500/15 text-red-400 border-red-500/20"
                  }`}>{m.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className={isEmergency ? "text-destructive flex items-center gap-2" : ""}>
              {isEmergency && <AlertTriangle className="h-4 w-4" />}
              {isEmergency ? "Send Emergency Alert" : "Compose Message"}
            </DialogTitle>
            <DialogDescription>{isEmergency ? "This will be sent immediately as a high-priority alert." : "Send a message to your congregation or a specific group."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label className="text-xs mb-2 block">Channels</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["All Channels", "Member Portal", "SMS", "WhatsApp", "Email"] as Channel[]).map((channel) => {
                  const Icon = channelIcons[channel];
                  const isSelected = selectedChannels.includes(channel);
                  return (
                    <label key={channel} className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border-2 transition-colors ${
                      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleChannelToggle(channel)}
                        className="rounded"
                      />
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm truncate">{channel}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v as Audience })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Subject / Title</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Sunday Service Reminder" /></div>
            <div>
              <Label className="text-xs">Message Body *</Label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Type your message here…" rows={4} className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <p className="text-[11px] text-muted-foreground mt-1">{form.body.length}/160 characters</p>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} className="rounded" />
              Mark as Emergency Alert
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompose(false)}>Cancel</Button>
            <Button onClick={handleSend} className={isEmergency ? "bg-destructive hover:bg-destructive/90" : ""}>
              <Send className="h-3.5 w-3.5 mr-1" />{isEmergency ? "Send Emergency Alert" : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
