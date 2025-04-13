
import React from 'react';
import { Map } from 'lucide-react';

const TrackingMap: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tracking</h1>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Map className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">Seguimiento en Tiempo Real</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Visualiza la ubicación de tus entregas en tiempo real, filtra por rutas o conductores y recibe alertas.
        </p>
        <p className="text-sm text-muted-foreground">Pantalla en desarrollo</p>
      </div>
    </div>
  );
};

export default TrackingMap;
