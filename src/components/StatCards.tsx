import { TrendingUp, TrendingDown, Users, Heart, DollarSign, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardsProps {
  memberCount?: number;
}

const stats = [
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

export function StatCards({ memberCount }: StatCardsProps) {
  const congregationStat = {
    label: "TOTAL CONGREGATION",
    value: memberCount?.toLocaleString() || "2,847",
    trend: "+12.4%",
    trendUp: true,
    trendLabel: "vs last Q",
    icon: Users,
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.3 }}
        className="stat-card"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-wider">
            {congregationStat.label}
          </p>
          <congregationStat.icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold">{congregationStat.value}</p>
        <div className="flex items-center gap-1.5 text-xs">
          <TrendingUp className="h-3.5 w-3.5 text-trend-up" />
          <span className="text-trend-up font-medium">{congregationStat.trend}</span>
          <span className="text-muted-foreground">{congregationStat.trendLabel}</span>
        </div>
      </motion.div>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (i + 1) * 0.08, duration: 0.3 }}
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
