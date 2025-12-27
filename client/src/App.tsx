import { Suspense, lazy } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/i18n"; // Initializes the internationalization library.
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Spinner } from "@/components/ui/spinner";

/**
 * Main Application Component (App.tsx)
 *
 * This is the root component of the React application. It sets up the global context providers,
 * defines the routing structure, and integrates persistent UI elements like the ChatWidget.
 */

// --- Page Components (Lazy Loaded) ---
// Pages are lazy-loaded to improve initial application load times. 
// The code for each page is only fetched when the user navigates to it.
const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Protocol = lazy(() => import("./pages/Protocol"));
const Contact = lazy(() => import("./pages/Contact"));
const ImageInventory = lazy(() => import("./pages/ImageInventory"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Live = lazy(() => import("./pages/Live"));
const NotFound = lazy(() => import("./pages/NotFound"));

/**
 * A fallback component to display while lazy-loaded pages are being fetched.
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <Spinner className="size-8 text-primary/60 animate-spin" />
    </div>
  );
}

/**
 * The main router for the application.
 * It uses `wouter` for handling navigation and `Suspense` for managing the loading state of lazy-loaded pages.
 */
function Router() {
  // Custom hook to update the document title based on the current page.
  usePageTitle();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Main application routes */}
        <Route path={"/"} component={Home} />
        <Route path={"/portfolio"} component={Portfolio} />
        <Route path={"/services"} component={Services} />
        <Route path={"/about"} component={About} />
        <Route path={"/protocol"} component={Protocol} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/images"} component={ImageInventory} />
        <Route path={"/live"} component={Live} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/404"} component={NotFound} />

        {/* A catch-all route that renders the NotFound page for any unhandled paths. */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

/**
 * The root `App` component.
 * This component wraps the entire application with necessary context providers
 * and renders the main layout structure.
 */
function App() {
  return (
    // ErrorBoundary catches runtime errors in the component tree to prevent a full app crash.
    <ErrorBoundary>
      {/* ThemeProvider manages the application's theme (e.g., light/dark mode). */}
      <ThemeProvider defaultTheme="light">
        {/* TooltipProvider enables the use of tooltips throughout the application. */}
        <TooltipProvider>
          {/* Accessibility feature: allows keyboard users to skip to the main content. */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
            Skip to main content
          </a>

          {/* Toaster is used for displaying toast notifications. */}
          <Toaster />

          {/* The application's main router. */}
          <Router />

          {/* Persistent UI elements that appear on all pages. */}
          <WhatsAppButton />
          <ChatWidget />

        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
