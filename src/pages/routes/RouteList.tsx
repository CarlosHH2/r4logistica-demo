
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateRouteDialog } from '@/components/routes/CreateRouteDialog';
import { RouteCard } from '@/components/routes/RouteCard';

// Define the allowed status types
type RouteStatusType = 'pending' | 'active' | 'completed';

// Helper function to validate status
const validateStatus = (status: string): RouteStatusType => {
  if (status === 'pending' || status === 'active' || status === 'completed') {
    return status;
  }
  return 'pending'; // Default fallback if invalid status
};

const RouteList = () => {
  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          route_orders(
            order_id,
            sequence_number
          ),
          operators:operator_id(
            name,
            lastname
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rutas</h1>
        <CreateRouteDialog />
      </div>

      <Tabs defaultValue="todas" className="mb-6">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="active">En Progreso</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div>Cargando rutas...</div>
        ) : !routes?.length ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No hay rutas para mostrar
          </div>
        ) : (
          routes.map((route) => (
            <RouteCard 
              key={route.id} 
              route={{
                ...route,
                status: validateStatus(route.status)
              }} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RouteList;
