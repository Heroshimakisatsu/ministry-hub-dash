import { TrendingUp, TrendingDown, Users, Heart, DollarSign, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "TOTAL CONGREGATION",
    value: "2,847",
    trend: "+12.4%",
    trendUp: true,
    trendLabel: "vs last Q",
    icon: Users,
  },
  {
    label: "ACTIVE PLEDGES",
    value: "184",
    trend: "+3.2%",
    trendUp: true,
    trendLabel: "vs last Q",
    icon: Heart,
  },
  {
    label: "MONTHLY TITHES",
    value: "$246K",
    trend: "+8.1%",
    trendUp: true,
    trendLabel: "vs last Q",
    icon: DollarSign,
  },
  {
    label: "NEW VISITORS",
    value: "47",
    trend: "-5.7%",
    trendUp: false,
    trendLabel: "this week",
    icon: UserPlus,
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-wider">
              {stat.label}
            </p>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <div className="flex items-center gap-1.5 text-xs">
            {stat.trendUp ? (
              <TrendingUp className="h-3.5 w-3.5 text-trend-up" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-trend-down" />
            )}
            <span className={stat.trendUp ? "text-trend-up font-medium" : "text-trend-down font-medium"}>
              {stat.trend}
            </span>
            <span className="text-muted-foreground">{stat.trendLabel}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
