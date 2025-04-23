
import { RouteCard } from '@/components/routes/RouteCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type RouteStatusType = 'pending' | 'active' | 'completed';
type TabValue = 'todas' | RouteStatusType;

interface RouteTabContentProps {
  activeTab: TabValue;
}

const validateStatus = (status: string): RouteStatusType => {
  if (status === 'pending' || status === 'active' || status === 'completed') {
    return status;
  }
  return 'pending';
};

export const RouteTabContent = ({ activeTab }: RouteTabContentProps) => {
  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes', activeTab],
    queryFn: async () => {
      const query = supabase
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

      if (activeTab !== 'todas') {
        query.eq('status', activeTab);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Cargando rutas...</div>;
  }

  if (!routes?.length) {
    return (
      <div className="col-span-2 text-center py-8 text-muted-foreground">
        No hay rutas para mostrar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {routes.map((route) => (
        <RouteCard 
          key={route.id} 
          route={{
            ...route,
            status: validateStatus(route.status)
          }} 
        />
      ))}
    </div>
  );
};
