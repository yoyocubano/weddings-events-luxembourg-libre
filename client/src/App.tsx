import { Suspense, lazy } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Spinner } from "@/components/ui/spinner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Protocol = lazy(() => import("./pages/Protocol"));
const Contact = lazy(() => import("./pages/Contact"));
const ImageInventory = lazy(() => import("./pages/ImageInventory"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <Spinner className="size-8 text-primary/60 animate-spin" />
    </div>
  );
}

function Router() {
  usePageTitle();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/portfolio"} component={Portfolio} />
        <Route path={"/services"} component={Services} />
        <Route path={"/about"} component={About} />
        <Route path={"/protocol"} component={Protocol} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/images"} component={ImageInventory} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
            Skip to main content
          </a>
          <Toaster />
          <Router />
          <WhatsAppButton />
          <ChatWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
