import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Church, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateFaithNumber, MemberForFaithNumber } from "@/utils/faithNumberGenerator";

export default function MemberSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    dateOfBirth: "",
    address: "",
    gender: "other" as 'male' | 'female' | 'other',
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    // Get existing members from localStorage for faith number generation
    const existingMembers = JSON.parse(localStorage.getItem("members") || "[]");

    // Generate faith number if date of birth is provided
    let memberId = `M${Date.now()}`;
    if (formData.dateOfBirth) {
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
      
      const existingMembersForFaithNumber: MemberForFaithNumber[] = existingMembers
        .filter((m: any) => m.dateOfBirth)
        .map((m: any) => {
          const mNameParts = m.name.split(/\s+/);
          return {
            firstName: mNameParts[0],
            lastName: mNameParts[mNameParts.length - 1],
            dateOfBirth: m.dateOfBirth,
            gender: m.gender || 'other'
          };
        });
      
      memberId = generateFaithNumber(firstName, lastName, formData.dateOfBirth, existingMembersForFaithNumber, formData.gender);
    }

    // Store member data in localStorage for simulation
    const newMember = {
      id: memberId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      department: formData.department,
      status: "New Member" as const,
      baptized: false,
      joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      photo: "",
      role: "member" as const,
      dateOfBirth: formData.dateOfBirth,
    };

    localStorage.setItem("members", JSON.stringify([...existingMembers, newMember]));

    // Store user session
    localStorage.setItem("currentUser", JSON.stringify(newMember));

    // Navigate to member portal
    navigate("/member");
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
              <p className="text-xs text-muted-foreground">Member Registration</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Create Your Account</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Join our church community
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
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
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+263 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Home address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="other">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <Label htmlFor="department">Department (Optional)</Label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">No department</option>
                <option value="Worship Team">Worship Team</option>
                <option value="Youth Ministry">Youth Ministry</option>
                <option value="Choir">Choir</option>
                <option value="Ushers">Ushers</option>
                <option value="Men's Group">Men's Group</option>
                <option value="Women's Ministry">Women's Ministry</option>
                <option value="Deacons">Deacons</option>
                <option value="Children's Ministry">Children's Ministry</option>
              </select>
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

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">
              Sign In
            </button>
          </div>

          <div className="mt-4 pt-4 border-t text-center text-sm">
            <span className="text-muted-foreground">Are you an admin? </span>
            <button onClick={() => navigate("/admin-signup")} className="text-primary font-medium hover:underline">
              Admin Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
