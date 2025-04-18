import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Sidebar from '@/components/sidebar/Sidebar';
import { BellIcon, MessageSquare, Search } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login", { replace: true });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="border rounded-md pl-8 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-gray-100 transition-colors">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-gray-100 transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="font-medium text-sm">AD</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
