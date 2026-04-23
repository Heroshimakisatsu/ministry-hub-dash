import { Search, Download, Filter, BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const verses = [
  "\"And my God will meet all your needs according to the riches of his glory in Christ Jesus.\" — Philippians 4:19",
  "\"For I know the plans I have for you, declares the Lord.\" — Jeremiah 29:11",
  "\"The Lord is my shepherd; I shall not want.\" — Psalm 23:1",
];

function getVerseOfTheDay() {
  const dayIndex = new Date().getDate() % verses.length;
  return verses[dayIndex];
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface DashboardHeaderProps {
  role: "admin" | "member";
  onRoleChange: (role: "admin" | "member") => void;
}

export function DashboardHeader({ role, onRoleChange }: DashboardHeaderProps) {
  const userName = role === "admin" ? "Pastor Marcus" : "Sarah Johnson";

  return (
    <header className="border-b bg-card">
      {/* Verse of the Day bar */}
      <div className="h-8 flex items-center justify-center gap-2 bg-primary/5 border-b border-primary/10 px-4">
        <BookOpen className="h-3 w-3 text-primary" />
        <p className="text-[11px] text-muted-foreground italic truncate max-w-2xl">
          {getVerseOfTheDay()}
        </p>
      </div>

      {/* Main header */}
      <div className="h-16 flex items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-bold">
            Welcome back, <span className="text-primary">{userName}</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Today is {formatDate()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-48 rounded-lg border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="h-9 w-px bg-border mx-1" />
          <ThemeToggle className="h-9 w-9 border rounded-lg" />
        </div>
      </div>
    </header>
  );
}
