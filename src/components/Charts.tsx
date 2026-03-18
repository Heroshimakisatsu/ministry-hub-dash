import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const givingData = [
  { month: "Oct", amount: 185000 },
  { month: "Nov", amount: 198000 },
  { month: "Dec", amount: 242000 },
  { month: "Jan", amount: 210000 },
  { month: "Feb", amount: 228000 },
  { month: "Mar", amount: 246000 },
];

const fundData = [
  { name: "General", value: 45, color: "hsl(243, 75%, 52%)" },
  { name: "Building", value: 25, color: "hsl(160, 84%, 39%)" },
  { name: "Mission", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Youth", value: 10, color: "hsl(280, 60%, 55%)" },
];

export function GivingChart() {
  return (
    <div className="card-surface p-5 flex-1">
      <h3 className="text-sm font-semibold mb-1">Monthly Giving Trends (Oct — Mar)</h3>
      <p className="text-xs text-muted-foreground mb-4">6-month trend</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={givingData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => `$${v / 1000}K`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: 12,
            }}
            formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, "Giving"]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FundAllocationChart() {
  return (
    <div className="card-surface p-5 w-[320px]">
      <h3 className="text-sm font-semibold mb-1">Ministry Fund Allocation</h3>
      <p className="text-xs text-muted-foreground mb-4">Current quarter</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={fundData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {fundData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value}%`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {fundData.map((f) => (
          <div key={f.name} className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
            {f.name}
          </div>
        ))}
      </div>
    </div>
  );
}
