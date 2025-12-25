import { WhatsAppButton } from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import About from "./pages/About";
import Protocol from "./pages/Protocol";
import Contact from "./pages/Contact";
import ImageInventory from "./pages/ImageInventory";
import Privacy from "./pages/Privacy";

import { usePageTitle } from "@/hooks/usePageTitle";

function Router() {
  usePageTitle();
  return (
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
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <a href="#main-content" className="skip-to-main">
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
