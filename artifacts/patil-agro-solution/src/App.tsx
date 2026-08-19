import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  AlertsPage,
  AssistantPage,
  CropsPage,
  DashboardPage,
  LoginPage,
  ReportsPage,
  ScanPage,
  SoilPage,
  WeatherPage,
} from '@/components/patil-app';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function NutrientsPage() {
  return <ScanPage nutrient />;
}

function CropScanPage() {
  return <ScanPage />;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/scan" component={CropScanPage} />
        <Route path="/nutrients" component={NutrientsPage} />
        <Route path="/soil" component={SoilPage} />
        <Route path="/weather" component={WeatherPage} />
        <Route path="/assistant" component={AssistantPage} />
        <Route path="/crops" component={CropsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/alerts" component={AlertsPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
