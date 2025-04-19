
import React from 'react';
import { Package } from 'lucide-react';
import DrawableMap from '@/components/maps/DrawableMap';

const PackageList: React.FC = () => {
  const handlePolygonComplete = (coordinates: number[][]) => {
    console.log('Polígono completado:', coordinates);
    // Aquí puedes manejar las coordenadas del polígono
    // Por ejemplo, guardarlas en una base de datos
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Paquetes</h1>
      </div>

      <div className="grid gap-6">
        <DrawableMap onPolygonComplete={handlePolygonComplete} />
        
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
