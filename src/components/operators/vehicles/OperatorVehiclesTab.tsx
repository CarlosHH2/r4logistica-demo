
import React, { useEffect, useState } from 'react';
import { Car, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NewVehicleForm from '../vehicle/NewVehicleForm';
import { vehicleService } from '@/services/vehicleService';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color?: string;
}

interface OperatorVehiclesTabProps {
  operatorId: string;
}

const OperatorVehiclesTab: React.FC<OperatorVehiclesTabProps> = ({ operatorId }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      console.log('Cargando vehículos para operador:', operatorId);
      const data = await vehicleService.getVehiclesByOperator(operatorId);
      setVehicles(data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los vehículos. Por favor intente nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (operatorId) {
      loadVehicles();
    }
  }, [operatorId]);

  const handleVehicleDelete = async (vehicleId: string) => {
    try {
      await vehicleService.deleteVehicle(vehicleId);
      toast({
        title: "Éxito",
        description: "Vehículo eliminado correctamente",
      });
      loadVehicles();
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el vehículo. Por favor intente nuevamente.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehículos del Operador</CardTitle>
        <CardDescription>
          Lista de vehículos registrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4">Cargando vehículos...</div>
        ) : vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Car className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                    <p className="text-sm text-muted-foreground">Placa: {vehicle.plate}</p>
                    {vehicle.color && (
                      <p className="text-sm text-muted-foreground">Color: {vehicle.color}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleVehicleDelete(vehicle.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay vehículos registrados
          </div>
        )}

        <NewVehicleForm 
          operatorId={operatorId} 
          onComplete={loadVehicles} 
        />
      </CardContent>
    </Card>
  );
};

export default OperatorVehiclesTab;
