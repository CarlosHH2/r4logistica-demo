
import React, { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState<'info' | 'uploads'>('info');
  const [vehicleId, setVehicleId] = useState<string | null>(null);
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

  const registerVehicleInfo = async (data: VehicleFormValues) => {
    setIsLoading(true);
    try {
      console.log('Registrando datos del vehículo:', data);
      console.log('ID del operador:', operatorId);
      
      // Verificar que el operatorId existe
      if (!operatorId) {
        throw new Error('ID del operador no encontrado');
      }
      
      const vehicle = await vehicleService.registerVehicle(operatorId, data);
      console.log('Vehículo registrado correctamente:', vehicle);
      
      setVehicleId(vehicle.id);
      setCurrentStep('uploads');
      toast({
        title: "Vehículo creado",
        description: "Ahora puedes cargar las fotos y documentos",
      });
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al registrar el vehículo. Por favor intente nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async () => {
    if (!vehicleId) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "ID de vehículo no encontrado",
      });
      return;
    }

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
      // Asegurar que el bucket existe
      await vehicleService.createBucketIfNotExists();
      
      console.log('Cargando fotos y documentos para el vehículo:', vehicleId);
      
      // Subir fotos
      for (const [position, file] of Object.entries(photos)) {
        if (file) {
          console.log(`Subiendo foto ${position}`);
          await vehicleService.uploadFile(vehicleId, file, position, 'photos');
        }
      }

      // Subir documentos
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          console.log(`Subiendo documento ${docType}`);
          await vehicleService.uploadFile(vehicleId, file, docType, 'docs');
        }
      }

      toast({
        title: "Éxito",
        description: "Archivos cargados correctamente",
      });
      
      form.reset();
      resetPhotos();
      resetDocuments();
      setCurrentStep('info');
      setVehicleId(null);
      onComplete();

    } catch (error) {
      console.error('Error al cargar archivos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los archivos. Por favor intente nuevamente.",
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
          {currentStep === 'info' 
            ? 'Registra los datos básicos del vehículo' 
            : 'Carga las fotos y documentos del vehículo'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === 'info' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerVehicleInfo)} className="space-y-6">
              <VehicleBasicInfo form={form} />
              <Button type="submit" className="w-full" disabled={isLoading}>
                <Car className="mr-2 h-4 w-4" />
                {isLoading ? "Registrando..." : "Registrar Información del Vehículo"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
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

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCurrentStep('info')}
                disabled={isLoading}
              >
                Volver
              </Button>
              <Button 
                className="flex-1"
                onClick={uploadFiles}
                disabled={isLoading}
              >
                {isLoading ? "Cargando archivos..." : "Cargar Archivos"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewVehicleForm;
