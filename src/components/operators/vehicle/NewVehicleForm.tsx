
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { vehicleSchema, type VehicleFormValues } from '@/lib/schemas/operator';
import VehicleBasicInfo from './VehicleBasicInfo';
import { vehicleService } from '@/services/vehicleService';

interface NewVehicleFormProps {
  operatorId: string;
  onComplete: () => void;
}

const NewVehicleForm: React.FC<NewVehicleFormProps> = ({ operatorId, onComplete }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: 0,
      plate: '',
      color: '',
    },
  });

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      setIsLoading(true);
      console.log('Enviando datos del vehículo:', data);
      console.log('ID del operador:', operatorId);
      
      // Asegurarse que se está creando un nuevo registro utilizando registerVehicle
      // que ahora garantiza el uso de INSERT en Supabase
      await vehicleService.registerVehicle(operatorId, data);
      
      toast({
        title: "Éxito",
        description: "Vehículo registrado correctamente",
      });
      
      form.reset();
      onComplete();
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el vehículo. Por favor intente nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Vehículo</CardTitle>
        <CardDescription>
          Ingrese los datos del vehículo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <VehicleBasicInfo form={form} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Car className="mr-2 h-4 w-4" />
              {isLoading ? "Registrando..." : "Registrar Vehículo"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewVehicleForm;
