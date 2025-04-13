
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import OrderList from "./pages/orders/OrderList";
import RouteList from "./pages/routes/RouteList";
import PackageList from "./pages/packages/PackageList";
import InventoryList from "./pages/inventory/InventoryList";
import FleetList from "./pages/fleet/FleetList";
import TmsList from "./pages/tms/TmsList";
import TrackingMap from "./pages/tracking/TrackingMap";
import DocumentList from "./pages/documents/DocumentList";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="routes" element={<RouteList />} />
            <Route path="packages" element={<PackageList />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="fleet" element={<FleetList />} />
            <Route path="tms" element={<TmsList />} />
            <Route path="tracking" element={<TrackingMap />} />
            <Route path="documents" element={<DocumentList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
