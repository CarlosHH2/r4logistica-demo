
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";

interface RouteDetailDrawerProps {
  routeId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced type for route orders with sequence numbers
interface OrderWithSequence extends Order {
  sequence_number: number;
}

export const RouteDetailDrawer = ({ routeId, isOpen, onClose }: RouteDetailDrawerProps) => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['route-orders', routeId],
    queryFn: async (): Promise<OrderWithSequence[]> => {
      if (!routeId) return [];
      
      try {
        // Fetch route orders
        const { data: routeOrders, error: routeOrdersError } = await supabase
          .from('route_orders')
          .select('order_id, sequence_number')
          .eq('route_id', routeId)
          .order('sequence_number');

        if (routeOrdersError) {
          console.error('Error fetching route orders:', routeOrdersError);
          return [];
        }

        // If no orders in route, return empty array
        if (!routeOrders || routeOrders.length === 0) {
          return [];
        }
        
        // Get all order IDs
        const orderIds = routeOrders.map(ro => ro.order_id);
        
        // Fetch order details
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .in('id', orderIds);

        if (ordersError || !orders) {
          console.error('Error fetching orders:', ordersError);
          return [];
        }

        // Create a map for quick lookups of sequence numbers
        const sequenceMap = new Map<string, number>();
        routeOrders.forEach(ro => {
          if (ro && ro.order_id) {
            sequenceMap.set(ro.order_id, ro.sequence_number);
          }
        });

        // Create orders with sequence numbers
        const ordersWithSequence: OrderWithSequence[] = orders.map(order => ({
          ...order,
          sequence_number: sequenceMap.get(order.id) || 0
        }));
        
        // Return sorted orders by sequence number
        return ordersWithSequence.sort((a, b) => a.sequence_number - b.sequence_number);
      } catch (err) {
        console.error('Error in route orders query:', err);
        return [];
      }
    },
    enabled: isOpen && !!routeId,
  });

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle>Detalle de la Ruta</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {error ? (
            <div className="text-center py-4 text-red-500">
              Error al cargar las órdenes. Por favor, intenta de nuevo.
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Cargando órdenes...</div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No hay órdenes asignadas a esta ruta
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Orden #{order.sequence_number}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {order.street} {order.number}
                        {order.int_number ? `, Int. ${order.int_number}` : ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.neighborhood}, {order.postal_code}
                      </div>
                      {order.reference && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Referencia: {order.reference}
                        </div>
                      )}
                      {order.notes && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Notas: {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
