import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { AppLayout } from "./components/AppLayout";

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

// Workflow Pages
import OrchestratorNewPage from "./pages/workflow/OrchestratorNewPage";
import OrchestratorAIPage from "./pages/workflow/OrchestratorAIPage";
import CSMFeedPage from "./pages/workflow/CSMFeedPage";

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
            
            {/* Main App with Sidebar */}
            <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
            
            {/* Workflow Module */}
            <Route path="/workflow/orchestrator-new" element={<AppLayout><OrchestratorNewPage /></AppLayout>} />
            <Route path="/workflow/orchestrator-ai" element={<AppLayout><OrchestratorAIPage /></AppLayout>} />
            <Route path="/workflow/csm-feed" element={<AppLayout><CSMFeedPage /></AppLayout>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
