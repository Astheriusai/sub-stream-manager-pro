
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AuthLayout } from "@/components/AuthLayout";
import { DashboardLayout } from "@/components/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Accounts from "./pages/Accounts";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import Subscribers from "./pages/Subscribers";
import Roles from "./pages/Roles";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";
import Trash from "./pages/Trash";
import PriceList from "./pages/PriceList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route element={<AuthLayout />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/users" element={<Users />} />
                <Route path="/subscribers" element={<Subscribers />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/price-list" element={<PriceList />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/trash" element={<Trash />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
