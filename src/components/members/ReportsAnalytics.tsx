import { useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar, Filter, FileBarChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const statsCards = [
  { label: "Active Members", val: 312, trend: "+12%", sub: "Since last month", color: "text-primary" },
  { label: "Visitor Conversion", val: "22%", trend: "+5%", sub: "Visitors to members", color: "text-emerald-400" },
  { label: "Net Giving (MTD)", val: "$8,120", trend: "-2%", sub: "Vs last month", color: "text-blue-400" },
  { label: "Attendance Rate", val: "78%", trend: "+3%", sub: "Avg per Sunday", color: "text-amber-400" },
];

const growthData = [
  { month: "Nov", members: 245, visitors: 30 },
  { month: "Dec", members: 260, visitors: 45 },
  { month: "Jan", members: 280, visitors: 35 },
  { month: "Feb", members: 295, visitors: 28 },
  { month: "Mar", members: 305, visitors: 42 },
  { month: "Apr", members: 312, visitors: 15 },
];

export function ReportsAnalytics() {
  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsCards.map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              <span className={`text-[10px] font-bold ${s.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{s.trend}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Growth Analytics */}
        <div className="card-surface p-5">
           <div className="flex items-center justify-between mb-4">
             <div><h3 className="text-sm font-semibold">Growth Analytics</h3><p className="text-xs text-muted-foreground">Member & visitor trends</p></div>
             <Button variant="outline" size="xs" className="h-7 text-[10px]"><TrendingUp className="h-3 w-3 mr-1" />6 Months</Button>
           </div>
           
           <div className="flex items-end gap-3 h-48 border-b pb-2">
             {growthData.map((d) => (
               <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                 <div className="w-full flex gap-0.5 items-end justify-center h-40">
                    <div className="w-4 bg-primary rounded-t-sm" style={{ height: `${(d.members / 350) * 100}%` }} title={`Members: ${d.members}`} />
                    <div className="w-3 bg-blue-500/50 rounded-t-sm" style={{ height: `${(d.visitors / 350) * 100}%` }} title={`Visitors: ${d.visitors}`} />
                 </div>
                 <span className="text-[10px] text-muted-foreground">{d.month}</span>
               </div>
             ))}
           </div>
           <div className="flex gap-4 mt-3 justify-center text-xs text-muted-foreground">
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" />Members</span>
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/50" />Visitors</span>
           </div>
        </div>

        {/* Department Distribution */}
        <div className="card-surface p-5 h-full">
           <h3 className="text-sm font-semibold mb-1">Ministry Performance</h3>
           <p className="text-xs text-muted-foreground mb-4">Engagement by department</p>
           
           <div className="space-y-4">
              {[
                { name: "Youth Ministry", pct: 85, color: "bg-blue-500" },
                { name: "Worship Team", pct: 92, color: "bg-primary" },
                { name: "Children's Church", pct: 72, color: "bg-amber-500" },
                { name: "Ushering", pct: 78, color: "bg-emerald-500" },
              ].map(d => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground">{d.pct}% Engagement</span>
                  </div>
                  <Progress value={d.pct} className="h-1.5" indicatorClassName={d.color} />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Finance Analytics Preview */}
      <div className="card-surface p-5">
         <div className="flex items-center justify-between mb-4">
           <div><h3 className="text-sm font-semibold">Tithe & Offering Trends</h3><p className="text-xs text-muted-foreground">Giving patterns oversight</p></div>
           <div className="flex gap-2">
             <Button variant="outline" size="xs" className="h-7 text-[10px]"><FileBarChart className="h-3.5 w-3.5 mr-1" />Full Finance Report</Button>
             <Button variant="outline" size="xs" className="h-7 text-[10px]"><Download className="h-3.5 w-3.5 mr-1" />Export XLSX</Button>
           </div>
         </div>
         <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg bg-accent/20">
            <div className="text-center">
              <PieChart className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">Advanced visualization module loading…</p>
            </div>
         </div>
      </div>
    </div>
  );
}
