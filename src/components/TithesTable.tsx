const tithes = [
  { donor: "Sarah Johnson", amount: "$2,500", fund: "General", date: "Mar 15, 2026", method: "Online" },
  { donor: "David Kim", amount: "$1,200", fund: "Building", date: "Mar 14, 2026", method: "Check" },
  { donor: "James Brown", amount: "$800", fund: "Mission", date: "Mar 13, 2026", method: "Online" },
  { donor: "Robert Wilson", amount: "$3,000", fund: "General", date: "Mar 12, 2026", method: "Cash" },
  { donor: "Emily Chen", amount: "$500", fund: "Youth", date: "Mar 11, 2026", method: "Online" },
  { donor: "Lisa Taylor", amount: "$1,500", fund: "Building", date: "Mar 10, 2026", method: "Online" },
];

const fundColor: Record<string, string> = {
  General: "bg-primary/15 text-primary",
  Building: "bg-emerald-500/15 text-emerald-500",
  Mission: "bg-amber-500/15 text-amber-500",
  Youth: "bg-purple-500/15 text-purple-500",
};

export function TithesTable() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="text-sm font-semibold">Recent Giving</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Latest tithes and offerings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">DONOR</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">AMOUNT</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">FUND</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">DATE</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">METHOD</th>
            </tr>
          </thead>
          <tbody>
            {tithes.map((t, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                <td className="px-5 py-3 font-medium">{t.donor}</td>
                <td className="px-5 py-3 font-semibold">{t.amount}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${fundColor[t.fund]}`}>
                    {t.fund}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
