
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { vehicleSchema, type VehicleFormValues } from '@/lib/schemas/operator';
import VehiclePhotoUpload from './VehiclePhotoUpload';
import VehicleDocumentUpload from './VehicleDocumentUpload';
import VehicleBasicInfo from './VehicleBasicInfo';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { useVehicleDocuments } from '@/hooks/useVehicleDocuments';
import { vehicleService } from '@/services/vehicleService';

interface NewVehicleFormProps {
  operatorId: string;
  onComplete: () => void;
}

const NewVehicleForm: React.FC<NewVehicleFormProps> = ({ operatorId, onComplete }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { photos, updatePhoto, resetPhotos, areAllPhotosUploaded } = useVehiclePhotos();
  const { documents, updateDocument, resetDocuments } = useVehicleDocuments();

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
    if (!areAllPhotosUploaded()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor carga todas las fotos del vehículo",
      });
      return;
    }

    if (!documents.circulation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor carga la tarjeta de circulación",
      });
      return;
    }

    setIsLoading(true);
    try {
      await vehicleService.createBucketIfNotExists();
      const vehicle = await vehicleService.registerVehicle(operatorId, data);
      
      // Upload photos
      for (const [position, file] of Object.entries(photos)) {
        if (file) {
          await vehicleService.uploadFile(vehicle.id, file, position, 'photos');
        }
      }

      // Upload documents
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          await vehicleService.uploadFile(vehicle.id, file, docType, 'docs');
        }
      }

      toast({
        title: "Éxito",
        description: "Vehículo registrado correctamente",
      });
      
      form.reset();
      resetPhotos();
      resetDocuments();
      onComplete();

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al registrar el vehículo. Por favor intente nuevamente.",
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
          Registra un nuevo vehículo para este operador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <VehicleBasicInfo form={form} />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fotos del Vehículo</h3>
              <div className="grid grid-cols-2 gap-4">
                <VehiclePhotoUpload
                  position="front"
                  label="Frente"
                  photo={photos.front}
                  onPhotoChange={(file) => updatePhoto('front', file)}
                />
                <VehiclePhotoUpload
                  position="back"
                  label="Trasera"
                  photo={photos.back}
                  onPhotoChange={(file) => updatePhoto('back', file)}
                />
                <VehiclePhotoUpload
                  position="left"
                  label="Lateral Izquierdo"
                  photo={photos.left}
                  onPhotoChange={(file) => updatePhoto('left', file)}
                />
                <VehiclePhotoUpload
                  position="right"
                  label="Lateral Derecho"
                  photo={photos.right}
                  onPhotoChange={(file) => updatePhoto('right', file)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documentos del Vehículo</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <VehicleDocumentUpload
                  documentType="circulation"
                  label="Tarjeta de Circulación"
                  file={documents.circulation}
                  onFileChange={(file) => updateDocument('circulation', file)}
                />
                <VehicleDocumentUpload
                  documentType="insurance"
                  label="Póliza de Seguro"
                  file={documents.insurance}
                  onFileChange={(file) => updateDocument('insurance', file)}
                  required={false}
                />
              </div>
            </div>

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
