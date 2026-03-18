import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/mo",
    desc: "For small churches getting started",
    features: [
      "Up to 200 members",
      "Basic reporting",
      "Email support",
      "1 admin user",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    desc: "For growing congregations",
    features: [
      "Up to 2,000 members",
      "Advanced analytics",
      "Priority support",
      "5 admin users",
      "Custom branding",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    desc: "For multi-campus organizations",
    features: [
      "Unlimited members",
      "Multi-campus support",
      "24/7 phone support",
      "Unlimited admins",
      "API access",
      "Custom integrations",
    ],
    current: false,
  },
];

export function SubscriptionPlans() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-semibold">Subscription Plans</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Choose the right plan for your ministry</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card-surface p-5 flex flex-col ${
              plan.current ? "ring-2 ring-primary" : ""
            }`}
          >
            {plan.current && (
              <span className="text-[11px] font-semibold text-primary tracking-wider mb-2">
                CURRENT PLAN
              </span>
            )}
            <h4 className="text-lg font-bold">{plan.name}</h4>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{plan.desc}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-trend-up shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-5 h-9 rounded-xl text-sm font-medium transition-colors ${
                plan.current
                  ? "bg-accent text-muted-foreground cursor-default"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
