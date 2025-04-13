
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, MapPin, Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const routes = [
  { 
    id: 'RT-001', 
    name: 'Zona Norte - Mañana', 
    status: 'active', 
    stops: 8, 
    driver: 'Juan Pérez', 
    vehicle: 'VH-003 (Ford Transit)',
    startTime: '08:00',
    estimatedEnd: '12:30',
    progress: 65
  },
  { 
    id: 'RT-002', 
    name: 'Zona Sur - Tarde', 
    status: 'pending', 
    stops: 12, 
    driver: 'María López', 
    vehicle: 'VH-008 (Toyota Hiace)',
    startTime: '13:00',
    estimatedEnd: '18:00',
    progress: 0
  },
  { 
    id: 'RT-003', 
    name: 'Zona Centro - Urgente', 
    status: 'completed', 
    stops: 5, 
    driver: 'Carlos Rodríguez', 
    vehicle: 'VH-002 (Renault Kangoo)',
    startTime: '09:30',
    estimatedEnd: '11:45',
    progress: 100
  },
  { 
    id: 'RT-004', 
    name: 'Zona Oeste - Vespertina', 
    status: 'active', 
    stops: 10, 
    driver: 'Laura Martínez', 
    vehicle: 'VH-010 (Fiat Ducato)',
    startTime: '14:15',
    estimatedEnd: '19:00',
    progress: 30
  },
];

const RouteList: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' }> = {
      active: { label: 'En Progreso', variant: 'default' },
      pending: { label: 'Pendiente', variant: 'secondary' },
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
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nueva ruta
        </Button>
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
        {routes.map((route) => (
          <Card key={route.id} className="overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-medium">{route.name}</h3>
                <p className="text-sm text-muted-foreground">{route.id}</p>
              </div>
              {getStatusBadge(route.status)}
            </div>
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${route.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{route.progress}% Completado</span>
                  <span>{route.stops} paradas</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Conductor:</span>
                  <span className="font-medium">{route.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span className="font-medium">{route.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Horario:</span>
                  <span className="font-medium">{route.startTime} - {route.estimatedEnd}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                <Button variant="outline" size="sm">Ver detalle</Button>
                <Button size="sm">Asignar conductor</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteList;
