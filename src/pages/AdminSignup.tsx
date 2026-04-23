import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Church, Eye, EyeOff, Shield, User, Mail, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    masterPassword: "",
  });
  const [error, setError] = useState("");
  const [showMasterHint, setShowMasterHint] = useState(false);

  // Master admin password for simulation
  const MASTER_ADMIN_PASSWORD = "masteradmin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.masterPassword) {
      setError("Please fill in all required fields");
      return;
    }

    // Verify master admin password
    if (formData.masterPassword !== MASTER_ADMIN_PASSWORD) {
      setError("Invalid master admin password. Contact the system administrator.");
      return;
    }

    // Store admin data in localStorage for simulation
    const newAdmin = {
      id: `A${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: "",
      address: "",
      department: "",
      status: "Active" as const,
      baptized: true,
      joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      photo: "",
      role: "admin" as const,
    };

    // Get existing members from localStorage or use initial members
    const existingMembers = JSON.parse(localStorage.getItem("members") || "[]");
    localStorage.setItem("members", JSON.stringify([...existingMembers, newAdmin]));

    // Store user session
    localStorage.setItem("currentUser", JSON.stringify(newAdmin));

    // Navigate to admin dashboard
    navigate("/dashboard");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="card-surface p-8">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Church className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FaithFlow</h1>
              <p className="text-xs text-muted-foreground">Admin Registration</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Admin Account Setup</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Requires master admin authorization
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@faithflow.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label htmlFor="masterPassword" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Master Admin Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="masterPassword"
                  type={showMasterPassword ? "text" : "password"}
                  placeholder="Enter master admin password"
                  value={formData.masterPassword}
                  onChange={(e) => handleChange("masterPassword", e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showMasterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Contact your system administrator for the master admin password
              </p>
              <button
                type="button"
                onClick={() => setShowMasterHint(!showMasterHint)}
                className="text-xs text-primary hover:underline mt-1"
              >
                {showMasterHint ? "Hide hint" : "Show hint (for simulation)"}
              </button>
              {showMasterHint && (
                <p className="text-xs text-muted-foreground mt-1 bg-accent/50 p-2 rounded">
                  Simulation hint: masteradmin123
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Admin Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">
              Sign In
            </button>
          </div>

          <div className="mt-4 pt-4 border-t text-center text-sm">
            <span className="text-muted-foreground">Not an admin? </span>
            <button onClick={() => navigate("/member-signup")} className="text-primary font-medium hover:underline">
              Member Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
