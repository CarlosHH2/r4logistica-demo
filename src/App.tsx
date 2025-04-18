
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/auth/Login";
import CreateUser from "./pages/admin/CreateUser";
import Dashboard from "./pages/dashboard/Dashboard";
import OrderList from "./pages/orders/OrderList";
import RouteList from "./pages/routes/RouteList";
import PackageList from "./pages/packages/PackageList";
import InventoryList from "./pages/inventory/InventoryList";
import FleetList from "./pages/fleet/FleetList";
import OperatorList from "./pages/operators/OperatorList";
import OperatorRegistration from "./pages/operators/OperatorRegistration";
import OperatorEdit from "./pages/operators/OperatorEdit";
import TmsList from "./pages/tms/TmsList";
import TrackingMap from "./pages/tracking/TrackingMap";
import DocumentList from "./pages/documents/DocumentList";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";
import CreateManualOrder from "./pages/orders/CreateManualOrder";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="manual-order" element={<CreateManualOrder />} />
            <Route path="routes" element={<RouteList />} />
            <Route path="packages" element={<PackageList />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="fleet" element={<FleetList />} />
            <Route path="operators" element={<OperatorList />} />
            <Route path="operators/new" element={<OperatorRegistration />} />
            <Route path="operators/:id/edit" element={<OperatorEdit />} />
            <Route path="tms" element={<TmsList />} />
            <Route path="tracking" element={<TrackingMap />} />
            <Route path="documents" element={<DocumentList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
