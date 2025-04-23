
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

  const { data: orders, isLoading } = useQuery({
    queryKey: ['unassigned-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('route_assigned', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const createRouteMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrders.length) throw new Error('Selecciona al menos una orden');
      if (!alias.trim()) throw new Error('El alias es requerido');

      // Insert new route
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert([{ alias }])
        .select()
        .single();

      if (routeError) throw routeError;

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

      return route;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-orders'] });
      toast.success('Ruta creada exitosamente');
      setOpen(false);
      setAlias('');
      setSelectedOrders([]);
    },
    onError: (error) => {
      toast.error(error.message);
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
            {isLoading ? (
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
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRoute}
              disabled={!selectedOrders.length || !alias.trim() || createRouteMutation.isPending}
            >
              Crear ruta
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
