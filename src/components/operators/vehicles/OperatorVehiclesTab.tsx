
import React from 'react';
import { Car, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NewVehicleForm from '../vehicle/NewVehicleForm';

interface OperatorVehiclesTabProps {
  operatorId: string;
  vehicles: any[];
  onVehicleDelete: (vehicleId: string) => Promise<void>;
  onComplete: () => void;
}

const OperatorVehiclesTab: React.FC<OperatorVehiclesTabProps> = ({
  operatorId,
  vehicles,
  onVehicleDelete,
  onComplete
}) => {
  console.log('OperatorVehiclesTab - operatorId:', operatorId);
  console.log('OperatorVehiclesTab - vehicles:', vehicles);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehículos del Operador</CardTitle>
        <CardDescription>
          Lista de vehículos registrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Car className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                  <p className="text-sm text-muted-foreground">Placa: {vehicle.plate}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onVehicleDelete(vehicle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay vehículos registrados
          </div>
        )}

        <NewVehicleForm 
          operatorId={operatorId} 
          onComplete={onComplete} 
        />
      </CardContent>
    </Card>
  );
};

export default OperatorVehiclesTab;
