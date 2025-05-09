
import { RouteCard } from '@/components/routes/RouteCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type RouteStatusType = 'pending' | 'active' | 'completed';
type TabValue = 'todas' | RouteStatusType;

interface RouteTabContentProps {
  activeTab: TabValue;
}

interface RouteData {
  id: string;
  alias: string;
  status: string;
  route_orders: { order_id: string; sequence_number: number; }[] | null;
  operators?: {
    name: string;
    lastname: string;
  } | null;
  operator_id?: string | null;
  created_at: string;
}

const validateStatus = (status: string): RouteStatusType => {
  if (status === 'pending' || status === 'active' || status === 'completed') {
    return status;
  }
  return 'pending';
};

export const RouteTabContent = ({ activeTab }: RouteTabContentProps) => {
  const { data: routes = [], isLoading, error } = useQuery({
    queryKey: ['routes', activeTab],
    queryFn: async (): Promise<RouteData[]> => {
      try {
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
        
        if (error) {
          console.error('Error al cargar las rutas:', error);
          toast.error('Error al cargar las rutas');
          throw error;
        }
        
        // Ensure data is never null and handle empty results safely
        return data || [];
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast.error('Error al cargar las rutas');
        return [];
      }
    },
    // Add retry logic and error handling
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">Error al cargar las rutas. Por favor, intenta de nuevo.</div>;
  }

  if (isLoading) {
    return <div className="w-full text-center py-4">Cargando rutas...</div>;
  }

  if (!routes || routes.length === 0) {
    return (
      <div className="w-full text-center py-8 text-muted-foreground">
        No hay rutas para mostrar
      </div>
    );
  }

  // Make sure routes is always an array and has valid data
  const safeRoutes = Array.isArray(routes) ? routes : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {safeRoutes.map((route) => (
        <RouteCard 
          key={route.id} 
          route={{
            ...route,
            route_orders: route.route_orders || [],
            status: validateStatus(route.status)
          }} 
        />
      ))}
    </div>
  );
};
