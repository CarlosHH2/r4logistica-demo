
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { RouteStatusBadge, StatusType } from './RouteStatusBadge';
import { useState } from 'react';
import { RouteDetailDrawer } from './RouteDetailDrawer';

interface RouteCardProps {
  route: {
    id: string;
    alias: string;
    status: StatusType;
    route_orders: Array<{ order_id: string; sequence_number: number; }>;
    operators?: {
      name: string;
      lastname: string;
    } | null;
    operator_id?: string | null;
  };
}

export const RouteCard = ({ route }: RouteCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Safety check: ensure route_orders is always an array
  const routeOrders = Array.isArray(route.route_orders) ? route.route_orders : [];
  const orderCount = routeOrders.length;
  
  // Generate a safe operator display name
  const operatorName = route.operators 
    ? `${route.operators.name} ${route.operators.lastname}` 
    : 'No asignado';

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-medium">{route.alias}</h3>
            <p className="text-sm text-muted-foreground">{route.id.slice(0, 8)}</p>
          </div>
          <RouteStatusBadge status={route.status} />
        </div>
        <CardContent className="p-4">
          <div className="mb-4">
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>{orderCount} órdenes</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Operador:</span>
              <span className="font-medium">
                {operatorName}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsDetailOpen(true)}
            >
              Ver detalle
            </Button>
            {!route.operator_id && (
              <Button size="sm">Asignar operador</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <RouteDetailDrawer
        routeId={route.id}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};
