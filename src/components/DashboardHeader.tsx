import { Search, Download, Filter } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
      <div>
        <h2 className="text-xl font-bold">Ministry Center</h2>
        <p className="text-xs text-muted-foreground">
          March 2026 • Fiscal Q1 • All entities
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members, events, or transactions..."
            className="h-9 w-72 rounded-lg border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="h-9 px-3 rounded-lg border flex items-center gap-2 text-sm font-medium hover:bg-accent transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button className="h-9 px-3 rounded-lg border flex items-center gap-2 text-sm font-medium hover:bg-accent transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </header>
  );
}
