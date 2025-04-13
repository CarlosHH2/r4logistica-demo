
import React from 'react';
import { Cog } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Cog className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">Configuración del Sistema</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Ajusta parámetros del sistema, gestiona roles y permisos, administra API Keys y personaliza tu tenant.
        </p>
        <p className="text-sm text-muted-foreground">Pantalla en desarrollo</p>
      </div>
    </div>
  );
};

export default Settings;
