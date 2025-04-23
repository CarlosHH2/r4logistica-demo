
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateRouteDialog } from '@/components/routes/CreateRouteDialog';
import { RouteTabContent } from '@/components/routes/RouteTabContent';

type TabValue = 'todas' | 'pending' | 'active' | 'completed';

const RouteList = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('todas');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rutas</h1>
        <CreateRouteDialog />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="active">En Progreso</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <RouteTabContent activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RouteList;
