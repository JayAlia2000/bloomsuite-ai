import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import FeedbackButton from "@/components/FeedbackButton";
import Index from "./pages/Index";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ProductDescription from "./pages/tools/ProductDescription";
import PriceCalculator from "./pages/tools/PriceCalculator";
import ContentPlanner from "./pages/tools/ContentPlanner";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/product-description" element={<ProtectedRoute><ProductDescription /></ProtectedRoute>} />
            <Route path="/price-calculator" element={<ProtectedRoute><PriceCalculator /></ProtectedRoute>} />
            <Route path="/content-planner" element={<ProtectedRoute><ContentPlanner /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FeedbackButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
