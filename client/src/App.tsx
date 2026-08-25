import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartDrawer } from "@/components/storefront";
import { WelcomePopup } from "@/components/LifecycleCapture";
import { CartProvider } from "@/contexts/CartContext";
import CollectionPage from "@/pages/CollectionPage";
import NotFound from "@/pages/NotFound";
import PolicyPage, { ContactPage } from "@/pages/PolicyPage";
import ProductPage from "@/pages/ProductPage";
import AboutPage from "@/pages/AboutPage";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/collections/:slug"} component={CollectionPage} />
      <Route path={"/products/:handle"} component={ProductPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/policies/:slug"}>{() => <PolicyPage />}</Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
            <CartDrawer />
            <WelcomePopup />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
