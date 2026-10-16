import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Link, Router as WouterRouter } from 'wouter';
import { Layout, useMeta } from '@/components/site';
import Home from '@/pages/home';
import Products, { ProductDetail } from '@/pages/products';
import Logistics from '@/pages/logistics';
import { About, Compliance, Contact, Documents, TradeFinance } from '@/pages/proof';
import Quote from '@/pages/quote';

const queryClient = new QueryClient();

function Missing() {
  useMeta('Page not found · Darby Trading', 'This page is not on the Darby Trading site.');
  return (
    <div className="wrap py-32">
      <p className="eyebrow text-[var(--leaf)]">404</p>
      <h1 className="mt-4 text-5xl md:text-7xl font-semibold" data-testid="text-not-found">This page is not on the record.</h1>
      <Link href="/" className="btn btn-ink mt-8" data-testid="link-not-found-home">Back to the homepage</Link>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/logistics" component={Logistics} />
          <Route path="/compliance" component={Compliance} />
          <Route path="/trade-finance" component={TradeFinance} />
          <Route path="/about" component={About} />
          <Route path="/documents" component={Documents} />
          <Route path="/request-a-quote" component={Quote} />
          <Route path="/contact" component={Contact} />
          <Route component={Missing} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
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
