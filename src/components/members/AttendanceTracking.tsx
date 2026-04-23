import { useState } from "react";
import { Calendar, CheckCircle2, TrendingUp, TrendingDown, Users, Clock, ChevronDown, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";

interface AttendanceRecord {
  id: string;
  date: string;
  service: string;
  serviceType: "morning" | "afternoon" | "evening" | "event";
  totalPresent: number;
  totalMembers: number;
  visitors: number;
  checkedIn: string[];
  eventName?: string;
}

const recentAttendance: AttendanceRecord[] = [
  { id: "1", date: "Apr 6, 2026", service: "Sunday Service", serviceType: "morning", totalPresent: 245, totalMembers: 312, visitors: 8, checkedIn: [] },
  { id: "2", date: "Apr 3, 2026", service: "Midweek Service", serviceType: "evening", totalPresent: 128, totalMembers: 312, visitors: 3, checkedIn: [] },
  { id: "3", date: "Mar 30, 2026", service: "Sunday Service", serviceType: "morning", totalPresent: 231, totalMembers: 310, visitors: 12, checkedIn: [] },
  { id: "4", date: "Mar 27, 2026", service: "Midweek Service", serviceType: "evening", totalPresent: 115, totalMembers: 310, visitors: 2, checkedIn: [] },
  { id: "5", date: "Mar 23, 2026", service: "Sunday Service", serviceType: "morning", totalPresent: 256, totalMembers: 308, visitors: 15, checkedIn: [] },
  { id: "6", date: "Mar 20, 2026", service: "Midweek Service", serviceType: "evening", totalPresent: 134, totalMembers: 308, visitors: 4, checkedIn: [] },
];

// Mock member data for verification
const mockMembers = [
  { faithNumber: "J15011995S", name: "John Smith" },
  { faithNumber: "S01021990J", name: "Sarah Johnson" },
  { faithNumber: "D03081985K", name: "David Kim" },
  { faithNumber: "M12061988B", name: "Maria Brown" },
];

const departmentAttendance = [
  { name: "Youth Ministry", present: 45, total: 58, trend: "up" },
  { name: "Choir", present: 28, total: 32, trend: "up" },
  { name: "Women's Ministry", present: 52, total: 65, trend: "down" },
  { name: "Men's Group", present: 38, total: 48, trend: "up" },
  { name: "Ushers", present: 18, total: 20, trend: "up" },
  { name: "Children's Ministry", present: 35, total: 42, trend: "down" },
];

const monthlyTrend = [
  { month: "Oct", sunday: 198, midweek: 95 },
  { month: "Nov", sunday: 215, midweek: 108 },
  { month: "Dec", sunday: 278, midweek: 125 },
  { month: "Jan", sunday: 220, midweek: 112 },
  { month: "Feb", sunday: 235, midweek: 118 },
  { month: "Mar", sunday: 247, midweek: 126 },
];

export function AttendanceTracking() {
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<"morning" | "afternoon" | "evening" | "event">("morning");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [faithNumber, setFaithNumber] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verifiedMember, setVerifiedMember] = useState<{ faithNumber: string; name: string } | null>(null);
  const [checkInError, setCheckInError] = useState("");

  const avgSunday = Math.round(monthlyTrend.reduce((s, m) => s + m.sunday, 0) / monthlyTrend.length);
  const avgMidweek = Math.round(monthlyTrend.reduce((s, m) => s + m.midweek, 0) / monthlyTrend.length);
  const latestSunday = recentAttendance.find((a) => a.service === "Sunday Service");
  const growthRate = latestSunday ? ((latestSunday.totalPresent - monthlyTrend[0].sunday) / monthlyTrend[0].sunday * 100).toFixed(1) : "0";

  // Mock events - in real app these would come from Settings
  const availableEvents = [
    { id: "1", name: "Easter Service", date: "Apr 12, 2026" },
    { id: "2", name: "Christmas Eve", date: "Dec 24, 2026" },
    { id: "3", name: "Church Anniversary", date: "Jun 15, 2026" },
  ];

  const handleCheckIn = () => {
    setCheckInError("");
    const member = mockMembers.find(m => m.faithNumber.toUpperCase() === faithNumber.toUpperCase());
    
    if (!member) {
      setCheckInError("Member not found. Please check your Faith number.");
      return;
    }
    
    setVerifiedMember(member);
    setShowVerificationDialog(true);
  };

  const confirmCheckIn = () => {
    // In real app, this would save to database
    setShowVerificationDialog(false);
    setFaithNumber("");
    setVerifiedMember(null);
    // Show success message
  };

  const cancelCheckIn = () => {
    setShowVerificationDialog(false);
    setFaithNumber("");
    setVerifiedMember(null);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Last Sunday", value: latestSunday?.totalPresent || 0, sub: `of ${latestSunday?.totalMembers} members`, icon: Users, color: "text-primary" },
          { label: "Avg Sunday", value: avgSunday, sub: "6-month average", icon: Calendar, color: "text-emerald-400" },
          { label: "Avg Midweek", value: avgMidweek, sub: "6-month average", icon: Clock, color: "text-blue-400" },
          { label: "Growth Rate", value: `${growthRate}%`, sub: "vs 6 months ago", icon: TrendingUp, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Check-In */}
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Attendance Check-In</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Enter Faith number to check in</p>
            </div>
            <Button size="sm" onClick={() => setShowCheckIn(!showCheckIn)}>
              <UserCheck className="h-4 w-4 mr-1" />{showCheckIn ? "Close" : "Start Check-In"}
            </Button>
          </div>
          {showCheckIn && (
            <div className="space-y-3 border-t pt-3">
              <div>
                <Label className="text-xs">Service Type</Label>
                <Select value={selectedServiceType} onValueChange={(v) => setSelectedServiceType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Service</SelectItem>
                    <SelectItem value="afternoon">Afternoon Service</SelectItem>
                    <SelectItem value="evening">Evening Service</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedServiceType === "event" && (
                <div>
                  <Label className="text-xs">Select Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger><SelectValue placeholder="Choose event" /></SelectTrigger>
                    <SelectContent>
                      {availableEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>{event.name} ({event.date})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label className="text-xs">Faith Number (Registration ID)</Label>
                <Input 
                  value={faithNumber}
                  onChange={(e) => setFaithNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. J15011995S"
                  className="font-mono"
                />
              </div>
              
              {checkInError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{checkInError}
                </p>
              )}
              
              <Button onClick={handleCheckIn} className="w-full" size="sm">
                <CheckCircle2 className="h-4 w-4 mr-1" />Verify & Check In
              </Button>
            </div>
          )}
        </div>

        {/* Department Attendance */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold mb-1">Department Attendance</h3>
          <p className="text-xs text-muted-foreground mb-4">Current week breakdown</p>
          <div className="space-y-3">
            {departmentAttendance.map((d) => (
              <div key={d.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{d.name}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {d.present}/{d.total}
                    {d.trend === "up" ? <TrendingUp className="h-3 w-3 text-emerald-400" /> : <TrendingDown className="h-3 w-3 text-red-400" />}
                  </span>
                </div>
                <Progress value={(d.present / d.total) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend Bar Chart (simple CSS) */}
      <div className="card-surface p-5">
        <h3 className="text-sm font-semibold mb-1">Attendance Trend (6 Months)</h3>
        <p className="text-xs text-muted-foreground mb-4">Sunday vs Midweek service comparison</p>
        <div className="flex items-end gap-3 h-40">
          {monthlyTrend.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end justify-center h-32">
                <div className="w-3 bg-primary/80 rounded-t-sm transition-all" style={{ height: `${(m.sunday / 300) * 100}%` }} title={`Sunday: ${m.sunday}`} />
                <div className="w-3 bg-blue-500/60 rounded-t-sm transition-all" style={{ height: `${(m.midweek / 300) * 100}%` }} title={`Midweek: ${m.midweek}`} />
              </div>
              <span className="text-[10px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm bg-primary/80" />Sunday</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/60" />Midweek</span>
        </div>
      </div>

      {/* Recent Records */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Recent Attendance Records</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Service-by-service breakdown</p>
          </div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="sunday">Sunday Only</SelectItem>
              <SelectItem value="midweek">Midweek Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">DATE</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">SERVICE</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">PRESENT</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">RATE</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-wider">VISITORS</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance
                .filter((a) => serviceFilter === "all" || (serviceFilter === "sunday" && a.service.includes("Sunday")) || (serviceFilter === "midweek" && a.service.includes("Midweek")))
                .map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
                    <td className="px-4 py-3 font-medium">{a.service}</td>
                    <td className="px-4 py-3">{a.totalPresent} / {a.totalMembers}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={(a.totalPresent / a.totalMembers) * 100} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{Math.round((a.totalPresent / a.totalMembers) * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-blue-400 text-xs font-medium">+{a.visitors}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Confirm Check-In
            </DialogTitle>
            <DialogDescription>
              Are you <strong>{verifiedMember?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          {verifiedMember && (
            <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {verifiedMember.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold">{verifiedMember.name}</p>
                <p className="text-xs text-muted-foreground font-mono">Faith Number: {verifiedMember.faithNumber}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1" onClick={cancelCheckIn}>
              No, that's not me
            </Button>
            <Button className="flex-1" onClick={confirmCheckIn}>
              Yes, check me in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
