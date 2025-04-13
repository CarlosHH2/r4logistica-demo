
import React from 'react';
import { LineChart } from 'lucide-react';

const TmsList: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">TMS</h1>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <LineChart className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">Sistema de Gestión de Transporte</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Visualiza el historial de entregas, gestiona nóminas automatizadas y consulta el ranking de desempeño.
        </p>
        <p className="text-sm text-muted-foreground">Pantalla en desarrollo</p>
      </div>
    </div>
  );
};

export default TmsList;
