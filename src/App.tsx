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

// Workflow Pages
import OrchestratorNewPage from "./pages/workflow/OrchestratorNewPage";
import OrchestratorAIPage from "./pages/workflow/OrchestratorAIPage";
import CSMFeedPage from "./pages/workflow/CSMFeedPage";

// Account Canvas Pages
import AllAccountsPage from "./pages/accounts/AllAccountsPage";
import HealthPage from "./pages/accounts/HealthPage";
import RevenueForecastPage from "./pages/accounts/RevenueForecastPage";
import MeetingsRecordingsPage from "./pages/accounts/MeetingsRecordingsPage";
import TicketsPage from "./pages/accounts/TicketsPage";

// Settings Pages
import ProfilePage from "./pages/settings/ProfilePage";
import UserManagementPage from "./pages/settings/UserManagementPage";
import IntegrationsPage from "./pages/settings/IntegrationsPage";
import ApiKeysPage from "./pages/settings/ApiKeysPage";
import HealthScoreBuilderPage from "./pages/settings/HealthScoreBuilderPage";
import DataModelerPage from "./pages/settings/DataModelerPage";
import WorkflowAutomationPage from "./pages/settings/WorkflowAutomationPage";

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
            
            {/* Workflow Module */}
            <Route path="/workflow/orchestrator-new" element={<OrchestratorNewPage />} />
            <Route path="/workflow/orchestrator-ai" element={<OrchestratorAIPage />} />
            <Route path="/workflow/csm-feed" element={<CSMFeedPage />} />
            
            {/* Account Canvas Module */}
            <Route path="/accounts/all" element={<AllAccountsPage />} />
            <Route path="/accounts/health" element={<HealthPage />} />
            <Route path="/accounts/revenue" element={<RevenueForecastPage />} />
            <Route path="/accounts/meetings" element={<MeetingsRecordingsPage />} />
            <Route path="/accounts/tickets" element={<TicketsPage />} />
            
            {/* Settings Module */}
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/settings/users" element={<UserManagementPage />} />
            <Route path="/settings/integrations" element={<IntegrationsPage />} />
            <Route path="/settings/api-keys" element={<ApiKeysPage />} />
            <Route path="/settings/health-score" element={<HealthScoreBuilderPage />} />
            <Route path="/settings/data-modeler" element={<DataModelerPage />} />
            <Route path="/settings/workflow-automation" element={<WorkflowAutomationPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
