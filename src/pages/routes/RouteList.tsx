
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateRouteDialog } from '@/components/routes/CreateRouteDialog';

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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' }> = {
      pending: { label: 'Pendiente', variant: 'secondary' },
      active: { label: 'En Progreso', variant: 'default' },
      completed: { label: 'Completada', variant: 'outline' },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'default' };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

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
            <Card key={route.id} className="overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{route.alias}</h3>
                  <p className="text-sm text-muted-foreground">{route.id.slice(0, 8)}</p>
                </div>
                {getStatusBadge(route.status)}
              </div>
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>{route.route_orders.length} órdenes</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {route.operators && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Operador:</span>
                      <span className="font-medium">
                        {route.operators.name} {route.operators.lastname}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                  <Button variant="outline" size="sm">Ver detalle</Button>
                  {!route.operator_id && (
                    <Button size="sm">Asignar operador</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RouteList;
