import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus, Download, Receipt, PiggyBank, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { getGivingHistory } from "@/data/sharedData";

interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  member?: string;
  method?: string;
}

const transactions: Transaction[] = [
  { id: "T001", date: "Apr 6, 2026", type: "income", category: "Tithe", description: "Sunday Service Tithes", amount: 4250, member: "Various", method: "Cash & Mobile" },
  { id: "T002", date: "Apr 6, 2026", type: "income", category: "Offering", description: "Sunday General Offering", amount: 1870, method: "Cash" },
  { id: "T003", date: "Apr 5, 2026", type: "expense", category: "Utilities", description: "Electricity - March", amount: 320 },
  { id: "T004", date: "Apr 4, 2026", type: "income", category: "Donation", description: "Building Fund - J. Brown", amount: 500, member: "James Brown", method: "EcoCash" },
  { id: "T005", date: "Apr 3, 2026", type: "income", category: "Tithe", description: "Midweek Service Tithes", amount: 1200, method: "Cash & EcoCash" },
  { id: "T006", date: "Apr 3, 2026", type: "expense", category: "Transport", description: "Church bus fuel", amount: 150 },
  { id: "T007", date: "Apr 2, 2026", type: "income", category: "Donation", description: "Missions Fund - S. Johnson", amount: 300, member: "Sarah Johnson", method: "Bank Transfer" },
  { id: "T008", date: "Apr 1, 2026", type: "expense", category: "Salaries", description: "Staff salaries - April", amount: 2800 },
  { id: "T009", date: "Mar 30, 2026", type: "income", category: "Offering", description: "Sunday General Offering", amount: 2100, method: "Cash" },
  { id: "T010", date: "Mar 29, 2026", type: "expense", category: "Equipment", description: "New microphones (x2)", amount: 450 },
];

const memberTithes = [
  { name: "Sarah Johnson", total: 3600, months: 4, lastPaid: "Apr 2026" },
  { name: "David Kim", total: 2400, months: 4, lastPaid: "Apr 2026" },
  { name: "James Brown", total: 4200, months: 4, lastPaid: "Mar 2026" },
  { name: "Robert Wilson", total: 1800, months: 3, lastPaid: "Apr 2026" },
  { name: "John Moyo", total: 5100, months: 4, lastPaid: "Apr 2026" },
  { name: "Grace Dube", total: 2700, months: 4, lastPaid: "Apr 2026" },
];

// Individual tithe records with dates for filtering
const individualTithes = [
  { id: "1", member: "Sarah Johnson", amount: 900, date: "Apr 6, 2026" },
  { id: "2", member: "Sarah Johnson", amount: 900, date: "Mar 30, 2026" },
  { id: "3", member: "Sarah Johnson", amount: 900, date: "Mar 2, 2026" },
  { id: "4", member: "Sarah Johnson", amount: 900, date: "Feb 2, 2026" },
  { id: "5", member: "David Kim", amount: 600, date: "Apr 6, 2026" },
  { id: "6", member: "David Kim", amount: 600, date: "Mar 30, 2026" },
  { id: "7", member: "David Kim", amount: 600, date: "Mar 2, 2026" },
  { id: "8", member: "David Kim", amount: 600, date: "Feb 2, 2026" },
  { id: "9", member: "James Brown", amount: 1050, date: "Mar 30, 2026" },
  { id: "10", member: "James Brown", amount: 1050, date: "Mar 2, 2026" },
  { id: "11", member: "James Brown", amount: 1050, date: "Feb 2, 2026" },
  { id: "12", member: "James Brown", amount: 1050, date: "Jan 2, 2026" },
  { id: "13", member: "Robert Wilson", amount: 600, date: "Apr 6, 2026" },
  { id: "14", member: "Robert Wilson", amount: 600, date: "Mar 30, 2026" },
  { id: "15", member: "Robert Wilson", amount: 600, date: "Mar 2, 2026" },
  { id: "16", member: "John Moyo", amount: 1275, date: "Apr 6, 2026" },
  { id: "17", member: "John Moyo", amount: 1275, date: "Mar 30, 2026" },
  { id: "18", member: "John Moyo", amount: 1275, date: "Mar 2, 2026" },
  { id: "19", member: "John Moyo", amount: 1275, date: "Feb 2, 2026" },
  { id: "20", member: "Grace Dube", amount: 675, date: "Apr 6, 2026" },
  { id: "21", member: "Grace Dube", amount: 675, date: "Mar 30, 2026" },
  { id: "22", member: "Grace Dube", amount: 675, date: "Mar 2, 2026" },
  { id: "23", member: "Grace Dube", amount: 675, date: "Feb 2, 2026" },
];

const fundCategories = [
  { name: "General Fund", target: 15000, raised: 12400, color: "bg-primary" },
  { name: "Building Fund", target: 50000, raised: 32500, color: "bg-emerald-500" },
  { name: "Missions Fund", target: 8000, raised: 5600, color: "bg-blue-500" },
  { name: "Youth Programs", target: 5000, raised: 3200, color: "bg-amber-500" },
  { name: "Welfare Fund", target: 10000, raised: 7800, color: "bg-purple-500" },
];

const monthlyData = [
  { month: "Nov", income: 9200, expenses: 4100 },
  { month: "Dec", income: 14500, expenses: 6200 },
  { month: "Jan", income: 10800, expenses: 5300 },
  { month: "Feb", income: 11200, expenses: 4800 },
  { month: "Mar", income: 12100, expenses: 5600 },
  { month: "Apr", income: 8120, expenses: 3720 },
];

export function FinanceOffering() {
  const [txFilter, setTxFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"all" | "date" | "week" | "month">("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [recordType, setRecordType] = useState<"income" | "expense">("income");

  // Merge shared giving history with existing transactions
  const sharedGivingHistory = getGivingHistory();
  const mergedTransactions = [
    ...transactions,
    ...sharedGivingHistory.map((record: any) => ({
      id: record.id,
      date: record.date,
      type: "income" as const,
      category: record.type,
      description: `${record.type} - Online Giving`,
      amount: record.amount,
      member: record.memberId,
      method: record.method,
    })),
  ];

  const totalIncome = mergedTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const totalTithes = mergedTransactions.filter((t) => t.category === "Tithe").reduce((s, t) => s + t.amount, 0);

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  // Filter transactions based on date filter
  const getFilteredTransactions = () => {
    if (dateFilter === "all") return mergedTransactions;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return mergedTransactions.filter((t) => {
      const txDate = new Date(t.date);
      
      if (dateFilter === "date" && selectedDate) {
        const filterDate = new Date(selectedDate);
        return txDate.toDateString() === filterDate.toDateString();
      }
      
      if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return txDate >= weekAgo;
      }
      
      if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return txDate >= monthAgo;
      }
      
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Filter individual tithes based on date filter
  const getFilteredTithes = () => {
    // Merge individual tithes with shared giving history (only tithes)
    const mergedTithes = [
      ...individualTithes,
      ...sharedGivingHistory
        .filter((record: any) => record.type === "Tithe")
        .map((record: any) => ({
          id: record.id,
          member: record.memberId,
          amount: record.amount,
          date: record.date,
        })),
    ];

    if (dateFilter === "all") return mergedTithes;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return mergedTithes.filter((t) => {
      const txDate = new Date(t.date);
      
      if (dateFilter === "date" && selectedDate) {
        const filterDate = new Date(selectedDate);
        return txDate.toDateString() === filterDate.toDateString();
      }
      
      if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return txDate >= weekAgo;
      }
      
      if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return txDate >= monthAgo;
      }
      
      return true;
    });
  };

  const filteredTithes = getFilteredTithes();

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Income", value: fmt(totalIncome), icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Expenses", value: fmt(totalExpenses), icon: ArrowDownRight, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Net Balance", value: fmt(netBalance), icon: Wallet, color: netBalance >= 0 ? "text-emerald-400" : "text-red-400", bg: "bg-primary/10" },
          { label: "Tithes Collected", value: fmt(totalTithes), icon: PiggyBank, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            </div>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Income vs Expenses chart */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold mb-1">Income vs Expenses (6 Months)</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly financial overview</p>
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((m) => {
              const maxVal = 15000;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end justify-center h-28">
                    <div className="w-3 bg-emerald-500/70 rounded-t-sm" style={{ height: `${(m.income / maxVal) * 100}%` }} title={`Income: ${fmt(m.income)}`} />
                    <div className="w-3 bg-red-500/50 rounded-t-sm" style={{ height: `${(m.expenses / maxVal) * 100}%` }} title={`Expenses: ${fmt(m.expenses)}`} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />Income</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/50" />Expenses</span>
          </div>
        </div>

        {/* Fund Progress */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold mb-1">Fund Allocation & Progress</h3>
          <p className="text-xs text-muted-foreground mb-4">Fundraising campaign tracking</p>
          <div className="space-y-4">
            {fundCategories.map((f) => {
              const pct = Math.round((f.raised / f.target) * 100);
              return (
                <div key={f.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{f.name}</span>
                    <span className="text-muted-foreground">{fmt(f.raised)} / {fmt(f.target)} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${f.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Tithe Contributors */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">Member Tithe Records (YTD)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Individual tithe contribution tracking</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="date">Specific Date</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            {dateFilter === "date" && (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[140px] h-8 text-xs"
              />
            )}
            <Button variant="outline" size="sm"><Receipt className="h-4 w-4 mr-1" />Generate Receipts</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">MEMBER</th>
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">DATE</th>
                <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTithes.length > 0 ? (
                filteredTithes.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium">{t.member}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-2.5 text-emerald-400 font-semibold">{fmt(t.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No tithe records found for selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="card-surface overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Transaction History</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All income and expense records</p>
          </div>
          <div className="flex gap-2">
            <Select value={txFilter} onValueChange={setTxFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => { setRecordType("income"); setShowRecordDialog(true); }}>
              <Plus className="h-4 w-4 mr-1" />Record
            </Button>
            <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />PDF Report</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">DATE</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">TYPE</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">CATEGORY</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">DESCRIPTION</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => txFilter === "all" || t.type === txFilter)
                .map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        t.type === "income" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-red-500/15 text-red-400 border-red-500/20"
                      }`}>
                        {t.type === "income" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{t.category}</td>
                    <td className="px-4 py-3 text-xs">{t.description}</td>
                    <td className={`px-4 py-3 text-right font-semibold text-sm ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Dialog */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Transaction</DialogTitle>
            <DialogDescription>Add a new income or expense record</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="flex gap-2">
              <Button variant={recordType === "income" ? "default" : "outline"} size="sm" onClick={() => setRecordType("income")} className="flex-1">Income</Button>
              <Button variant={recordType === "expense" ? "default" : "outline"} size="sm" onClick={() => setRecordType("expense")} className="flex-1">Expense</Button>
            </div>
            <div><Label className="text-xs">Category</Label>
              <Select defaultValue={recordType === "income" ? "Tithe" : "Utilities"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {recordType === "income" ? (
                    <>{["Tithe", "Offering", "Donation", "Fundraising", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</>
                  ) : (
                    <>{["Utilities", "Transport", "Salaries", "Equipment", "Maintenance", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Amount ($)</Label><Input type="number" placeholder="0.00" /></div>
            <div><Label className="text-xs">Description</Label><Input placeholder="Brief description" /></div>
            {recordType === "income" && (
              <div><Label className="text-xs">Payment Method</Label>
                <Select defaultValue="Cash">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Cash", "EcoCash", "OneMoney", "Bank Transfer", "Paynow"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecordDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowRecordDialog(false)}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
