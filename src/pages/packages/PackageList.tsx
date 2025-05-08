
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import DrawableMap from '@/components/maps/DrawableMap';
import { supabase } from '@/integrations/supabase/client';
import type { Order } from '@/types/order';
import { toast } from 'sonner';

const PackageList: React.FC = () => {
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Enhanced query with better error handling and fallbacks
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['package-orders'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .not('lat', 'is', null)
          .not('lng', 'is', null);
        
        if (error) {
          console.error('Error fetching orders with coordinates:', error);
          toast.error('Error al cargar los paquetes');
          throw error;
        }
        
        return (data || []) as Order[];
      } catch (err) {
        console.error('Error in package orders query:', err);
        toast.error('Error al cargar los paquetes. Por favor, intenta de nuevo.');
        return [];
      }
    },
    // Add retry and stale time configurations for better stability
    retry: 2,
    staleTime: 60000,
  });

  const handlePolygonComplete = (coordinates: number[][]) => {
    try {
      if (!coordinates || coordinates.length < 3) {
        console.warn('Polígono inválido: se requieren al menos 3 puntos');
        return;
      }
      
      console.log('Polígono completado:', coordinates);
      toast.success('Polígono creado correctamente');
      // Aquí puedes manejar las coordenadas del polígono
    } catch (err) {
      console.error('Error al procesar el polígono:', err);
      toast.error('Error al crear el polígono');
    }
  };

  // Map error handling
  const handleMapError = (error: string) => {
    console.error('Error en el mapa:', error);
    setMapError(error);
  };

  // Safe access to orders with fallback to empty array
  const safeOrders = orders || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paquetes</h1>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 mb-6">
          Error al cargar los paquetes. Por favor, intenta de nuevo.
        </div>
      )}
      
      {mapError && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 mb-6">
          Error en el mapa: {mapError}
        </div>
      )}

      <div className="grid gap-6">
        {!isLoading && (
          <DrawableMap 
            onPolygonComplete={handlePolygonComplete}
            orders={safeOrders}
            onError={handleMapError}
          />
        )}
        
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">Gestión de Paquetes</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Aquí podrás gestionar todos los paquetes, agruparlos, imprimir etiquetas y revisar su estado actual.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageList;
