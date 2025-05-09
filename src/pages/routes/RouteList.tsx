
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateRouteDialog } from '@/components/routes/CreateRouteDialog';
import { RouteTabContent } from '@/components/routes/RouteTabContent';
import { toast } from 'sonner';

type TabValue = 'todas' | 'pending' | 'active' | 'completed';

const RouteList = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('todas');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize page and handle any startup errors
  useEffect(() => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing routes page:', error);
      toast.error('Error al cargar la página de rutas');
      setIsLoading(false);
    }
  }, []);

  const handleTabChange = (value: string) => {
    try {
      setActiveTab(value as TabValue);
    } catch (error) {
      console.error('Error changing tab:', error);
      toast.error('Error al cambiar de pestaña');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-6">Cargando...</div>;
  }

  return (
    <div className="animate-fade-in bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Rutas</h1>
        <CreateRouteDialog />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="active">En Progreso</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <RouteTabContent activeTab="todas" />
        </TabsContent>
        <TabsContent value="active">
          <RouteTabContent activeTab="active" />
        </TabsContent>
        <TabsContent value="pending">
          <RouteTabContent activeTab="pending" />
        </TabsContent>
        <TabsContent value="completed">
          <RouteTabContent activeTab="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RouteList;
