import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingProvider } from "./contexts/OnboardingContext";

// Pages
import AuthPage from "./pages/AuthPage";
import OnboardingIntro from "./pages/OnboardingIntro";
import ConnectDataPage from "./pages/ConnectDataPage";
import DataFlowPage from "./pages/DataFlowPage";
import ApiSetupPage from "./pages/ApiSetupPage";
import FieldMappingPage from "./pages/FieldMappingPage";
import AddTeamPromptPage from "./pages/AddTeamPromptPage";
import InviteUsersPage from "./pages/InviteUsersPage";
import PermissionsPage from "./pages/PermissionsPage";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OnboardingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Onboarding Flow */}
            <Route path="/onboarding" element={<OnboardingIntro />} />
            <Route path="/connect-data" element={<ConnectDataPage />} />
            <Route path="/data-flow" element={<DataFlowPage />} />
            <Route path="/api-setup" element={<ApiSetupPage />} />
            <Route path="/field-mapping" element={<FieldMappingPage />} />
            <Route path="/add-team-prompt" element={<AddTeamPromptPage />} />
            <Route path="/invite-users" element={<InviteUsersPage />} />
            <Route path="/permissions" element={<PermissionsPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            
            {/* Main App */}
            <Route path="/home" element={<HomePage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
