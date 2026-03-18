import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Church, ArrowRight, ArrowLeft } from "lucide-react";

const steps = [
  {
    title: "Church Name",
    desc: "What is the name of your church or organization?",
    field: "churchName",
    placeholder: "e.g. Grace Community Church",
  },
  {
    title: "Denomination",
    desc: "Select your denomination or tradition",
    field: "denomination",
    options: ["Non-Denominational", "Baptist", "Methodist", "Catholic", "Presbyterian", "Pentecostal", "Other"],
  },
  {
    title: "Congregation Size",
    desc: "Estimated number of members",
    field: "size",
    options: ["Under 100", "100–500", "500–1,000", "1,000–5,000", "5,000+"],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const current = steps[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <Church className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold">FaithFlow Setup</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold mb-1">{current.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{current.desc}</p>

        {"options" in current && current.options ? (
          <div className="grid gap-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setData({ ...data, [current.field]: opt })}
                className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  data[current.field] === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:bg-accent"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            placeholder={current.placeholder}
            value={data[current.field] ?? ""}
            onChange={(e) => setData({ ...data, [current.field]: e.target.value })}
            className="w-full h-10 rounded-xl border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={() => (step < steps.length - 1 ? setStep(step + 1) : navigate("/dashboard"))}
            className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            {step < steps.length - 1 ? "Continue" : "Get Started"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
