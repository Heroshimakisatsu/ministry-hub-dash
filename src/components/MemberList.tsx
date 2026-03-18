const members = [
  { name: "Sarah Johnson", email: "sarah@email.com", status: "Active", joined: "Jan 2024", group: "Worship Team" },
  { name: "David Kim", email: "david@email.com", status: "Active", joined: "Mar 2023", group: "Youth Ministry" },
  { name: "Maria Garcia", email: "maria@email.com", status: "Visitor", joined: "Mar 2026", group: "—" },
  { name: "James Brown", email: "james@email.com", status: "Active", joined: "Sep 2022", group: "Men's Group" },
  { name: "Emily Chen", email: "emily@email.com", status: "Inactive", joined: "Jun 2021", group: "Choir" },
  { name: "Robert Wilson", email: "robert@email.com", status: "Active", joined: "Nov 2023", group: "Ushers" },
  { name: "Lisa Taylor", email: "lisa@email.com", status: "Visitor", joined: "Feb 2026", group: "—" },
];

export function MemberList() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="text-sm font-semibold">Member Directory</h3>
        <p className="text-xs text-muted-foreground mt-0.5">All registered members and visitors</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">NAME</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">EMAIL</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">STATUS</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">JOINED</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground tracking-wider">GROUP</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                <td className="px-5 py-3 font-medium">{m.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{m.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={
                      m.status === "Active"
                        ? "badge-active"
                        : m.status === "Visitor"
                        ? "badge-visitor"
                        : "badge-inactive"
                    }
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{m.joined}</td>
                <td className="px-5 py-3 text-muted-foreground">{m.group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
