import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import MemberPortal from "./pages/MemberPortal";
import MemberSignup from "./pages/MemberSignup";
import AdminSignup from "./pages/AdminSignup";
import PaymentEcoCash from "./pages/PaymentEcoCash";
import PaymentPaynow from "./pages/PaymentPaynow";
import PaymentBank from "./pages/PaymentBank";
import PaymentOneMoney from "./pages/PaymentOneMoney";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <DataProvider> */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/member" element={<MemberPortal />} />
            <Route path="/member-signup" element={<MemberSignup />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/payment-ecocash" element={<PaymentEcoCash />} />
            <Route path="/payment-paynow" element={<PaymentPaynow />} />
            <Route path="/payment-bank" element={<PaymentBank />} />
            <Route path="/payment-onemoney" element={<PaymentOneMoney />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    {/* </DataProvider> */}
  </QueryClientProvider>
);

export default App;
