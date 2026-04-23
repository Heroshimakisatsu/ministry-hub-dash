import { useState } from "react";
import { CreditCard, Smartphone, Landmark, Receipt, Globe, ShieldCheck, Download, ExternalLink, ArrowRight, History, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const paymentMethods = [
  { id: "M001", name: "EcoCash", type: "Mobile Money", icon: Smartphone, color: "text-blue-500", provider: "Zimbabwe", instructions: "*151*2*2*123456*AMOUNT#" },
  { id: "M002", name: "OneMoney", type: "Mobile Money", icon: Smartphone, color: "text-orange-500", provider: "Zimbabwe", instructions: "*150*1*1*AMOUNT#" },
  { id: "M003", name: "Bank Transfer", type: "Bank", icon: Landmark, color: "text-emerald-500", provider: "Any Bank", instructions: "Acc: 1100223344, Branch: Highlands" },
  { id: "M004", name: "Paynow", type: "Online Gateway", icon: Globe, color: "text-primary", provider: "Portal", instructions: "Click to give via secure web link" },
];

const givingHistory = [
  { id: "G001", date: "Apr 6, 2026", type: "Tithe", amount: 250, method: "EcoCash", status: "Confirmed" },
  { id: "G002", date: "Apr 2, 2026", type: "Building Fund", amount: 500, method: "Bank Transfer", status: "Processing" },
  { id: "G003", date: "Mar 30, 2026", type: "Offering", amount: 100, method: "OneMoney", status: "Confirmed" },
];

export function OnlineGiving() {
  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="card-surface p-5 bg-primary/10 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Heart className="h-6 w-6" /></div>
          <div>
            <h3 className="font-bold text-lg">Support Your Ministry Digitally</h3>
            <p className="text-sm text-muted-foreground">Safe, secure, and convenient ways to give tithes and offerings.</p>
          </div>
        </div>
      </div>

      {/* Give Methods Grid */}
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Payment Options</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {paymentMethods.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="card-surface p-4 space-y-3 hover:border-primary transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className={`h-9 w-9 rounded-lg bg-accent flex items-center justify-center ${m.color}`}><Icon className="h-5 w-5" /></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="font-bold text-sm">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.type} · {m.provider}</p>
              </div>
              <div className="bg-accent/40 rounded p-2 text-[11px] text-center font-mono select-all">
                {m.instructions}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
         {/* History */}
         <div className="md:col-span-2 card-surface overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your Giving History</h3>
              <Button size="xs" variant="outline" className="h-7 text-[10px]"><Receipt className="h-3.5 w-3.5 mr-1" />Tax Statements</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-accent/40">
                <tr className="border-b text-left">
                  <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">DATE</th>
                  <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">FUND / TYPE</th>
                  <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">AMOUNT</th>
                  <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {givingHistory.map((g) => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{g.date}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-xs">{g.type}</div>
                      <div className="text-[9px] text-muted-foreground">{g.method}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">${g.amount}</td>
                    <td className="px-4 py-3">
                       <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border ${g.status === 'Confirmed' ? 'text-emerald-400 border-emerald-500/20' : 'text-amber-400 border-amber-500/20'}`}>
                         {g.status}
                       </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>

         {/* Security Verification */}
         <div className="card-surface p-5 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold">Secure Transactions</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">All digital payments are encrypted and processed through verified payment providers. No credit card data is stored on our servers.</p>
            </div>
            <div className="pt-2 border-t space-y-2">
               <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">Supported Currencies</p>
               <div className="flex justify-center gap-3 text-sm font-bold text-muted-foreground">
                 <span>USD</span><span>ZIG</span><span>ZAR</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
