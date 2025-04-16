
import React from 'react';
import { BookOpen, ChevronLeft, ClipboardList, Cog, FileBox, FilePen, Home, LayoutDashboard, Map, Package, Truck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarNavLink from './SidebarNavLink';
import SidebarNavGroup from './SidebarNavGroup';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  return (
    <div className={cn(
      "bg-sidebar h-screen transition-all duration-300 flex flex-col border-r border-sidebar-border",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white tracking-tight">
            <span className="text-logistics-400">4r</span>
            logística
          </h1>
        )}
        {collapsed && (
          <div className="mx-auto">
            <span className="text-xl font-bold text-logistics-400">4r</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:text-white p-1 rounded-md hover:bg-sidebar-accent/50 transition-colors"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform", 
            collapsed && "transform rotate-180"
          )} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {collapsed ? (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <SidebarNavLink to="/admin" icon={LayoutDashboard} label="" exactMatch />
            <SidebarNavLink to="/admin/orders" icon={ClipboardList} label="" />
            <SidebarNavLink to="/admin/manual-order" icon={FilePen} label="" />
            <SidebarNavLink to="/admin/routes" icon={Map} label="" />
            <SidebarNavLink to="/admin/packages" icon={Package} label="" />
            <SidebarNavLink to="/admin/inventory" icon={FileBox} label="" />
            <SidebarNavLink to="/admin/fleet" icon={Truck} label="" />
            <SidebarNavLink to="/admin/tms" icon={Home} label="" />
            <SidebarNavLink to="/admin/tracking" icon={Map} label="" />
            <SidebarNavLink to="/admin/documents" icon={BookOpen} label="" />
            <SidebarNavLink to="/admin/settings" icon={Cog} label="" />
          </div>
        ) : (
          <>
            <SidebarNavLink to="/admin" icon={LayoutDashboard} label="Dashboard" exactMatch />
            
            <SidebarNavGroup title="Gestión" defaultOpen>
              <SidebarNavLink to="/admin/orders" icon={ClipboardList} label="Órdenes" />
              <SidebarNavLink to="/admin/manual-order" icon={FilePen} label="Orden Manual" />
              <SidebarNavLink to="/admin/routes" icon={Map} label="Rutas" />
              <SidebarNavLink to="/admin/packages" icon={Package} label="Paquetes" />
            </SidebarNavGroup>
            
            <SidebarNavGroup title="Inventario y Flota">
              <SidebarNavLink to="/admin/inventory" icon={FileBox} label="Inventario" />
              <SidebarNavLink to="/admin/fleet" icon={Truck} label="Flota" />
            </SidebarNavGroup>
            
            <SidebarNavGroup title="Operaciones">
              <SidebarNavLink to="/admin/tms" icon={Home} label="TMS" />
              <SidebarNavLink to="/admin/tracking" icon={Map} label="Tracking" />
              <SidebarNavLink to="/admin/documents" icon={BookOpen} label="Documentación" />
            </SidebarNavGroup>
            
            <div className="mt-auto pt-4">
              <SidebarNavLink to="/admin/settings" icon={Cog} label="Configuración" />
            </div>
          </>
        )}
      </div>
      
      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-logistics-600 flex items-center justify-center text-white">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70">administrator@swiftship.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
