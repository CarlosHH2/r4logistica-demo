
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

export const CreateRouteDialog = () => {
  const [open, setOpen] = useState(false);
  const [alias, setAlias] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['unassigned-orders'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('route_assigned', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching unassigned orders:', error);
          throw error;
        }
        
        return data as Order[] || [];
      } catch (err) {
        console.error('Error in unassigned orders query:', err);
        return [];
      }
    },
    enabled: open, // Only fetch when dialog is open
    refetchOnWindowFocus: false,
  });

  const createRouteMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrders.length) throw new Error('Selecciona al menos una orden');
      if (!alias.trim()) throw new Error('El alias es requerido');

      try {
        // Insert new route
        const { data: route, error: routeError } = await supabase
          .from('routes')
          .insert([{ alias }])
          .select()
          .single();

        if (routeError) throw routeError;

        if (!route || !route.id) {
          throw new Error('Error al crear la ruta: no se obtuvo un ID');
        }

        // Insert route_orders
        const routeOrders = selectedOrders.map((orderId, index) => ({
          route_id: route.id,
          order_id: orderId,
          sequence_number: index + 1,
        }));

        const { error: routeOrdersError } = await supabase
          .from('route_orders')
          .insert(routeOrders);

        if (routeOrdersError) throw routeOrdersError;

        // Update orders to mark them as assigned
        const { error: updateOrdersError } = await supabase
          .from('orders')
          .update({ route_assigned: true })
          .in('id', selectedOrders);

        if (updateOrdersError) {
          console.warn('Error updating orders as assigned:', updateOrdersError);
          // Continue anyway as this is not critical
        }

        return route;
      } catch (error) {
        console.error('Error in createRoute mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-orders'] });
      toast.success('Ruta creada exitosamente');
      setOpen(false);
      setAlias('');
      setSelectedOrders([]);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la ruta');
    },
  });

  const handleCreateRoute = async () => {
    createRouteMutation.mutate();
  };

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleOpen = (newState: boolean) => {
    if (newState && createRouteMutation.isPending) {
      return; // Prevent opening while mutation is in progress
    }
    setOpen(newState);
    if (!newState) {
      // Reset state when closing
      setSelectedOrders([]);
      setAlias('');
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button>
          Nueva ruta
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[750px]">
        <SheetHeader>
          <SheetTitle>Crear nueva ruta</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="alias">Alias de la ruta</Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ej: Zona Norte - Mañana"
            />
          </div>
          <div className="space-y-4">
            <Label>Selecciona las órdenes para esta ruta</Label>
            {error ? (
              <div className="text-sm text-red-500">
                Error al cargar las órdenes. Por favor, intenta de nuevo.
              </div>
            ) : isLoading ? (
              <div>Cargando órdenes...</div>
            ) : !orders?.length ? (
              <div className="text-sm text-muted-foreground">
                No hay órdenes disponibles para asignar
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={order.id}
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleOrder(order.id)}
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor={order.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {order.street} {order.number}
                        {order.int_number && `, Int. ${order.int_number}`}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {order.neighborhood}, {order.postal_code}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createRouteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRoute}
              disabled={!selectedOrders.length || !alias.trim() || createRouteMutation.isPending}
            >
              {createRouteMutation.isPending ? 'Creando...' : 'Crear ruta'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
