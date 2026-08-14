import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartDrawer } from "@/components/storefront";
import { CartProvider } from "@/contexts/CartContext";
import CollectionPage from "@/pages/CollectionPage";
import NotFound from "@/pages/NotFound";
import ProductPage from "@/pages/ProductPage";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const AdminSeo = lazy(() => import("@/pages/AdminSeo"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/collections/:slug"} component={CollectionPage} />
      <Route path={"/products/:handle"} component={ProductPage} />
      <Route path={"/admin/seo"} component={AdminSeo} />
      <Route path={"/studio"} component={AdminSeo} />
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
            <Suspense fallback={<div className="route-loading">Preparing Nestwell…</div>}>
              <Router />
            </Suspense>
            <CartDrawer />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
