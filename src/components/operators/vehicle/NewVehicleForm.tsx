
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { vehicleSchema, type VehicleFormValues } from '@/lib/schemas/operator';
import VehiclePhotoUpload from './VehiclePhotoUpload';
import VehicleDocumentUpload from './VehicleDocumentUpload';

interface NewVehicleFormProps {
  operatorId: string;
  onComplete: () => void;
}

const NewVehicleForm: React.FC<NewVehicleFormProps> = ({ operatorId, onComplete }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [vehiclePhotos, setVehiclePhotos] = useState<{
    front: File | null;
    back: File | null;
    left: File | null;
    right: File | null;
  }>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  
  const [documents, setDocuments] = useState<{
    circulation: File | null;
    insurance: File | null;
  }>({
    circulation: null,
    insurance: null,
  });

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

  const createBucketIfNotExists = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'operator-documents');
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket('operator-documents', {
          public: true
        });
        
        if (error) throw error;
        console.log('Created bucket: operator-documents');
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      throw error;
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    const allPhotosUploaded = Object.values(vehiclePhotos).every(photo => photo !== null);
    if (!allPhotosUploaded) {
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
      // Ensure the bucket exists before uploading
      await createBucketIfNotExists();
      
      // Register the vehicle
      const vehicleData = {
        operator_id: operatorId,
        brand: data.brand,
        model: data.model,
        year: Number(data.year),
        plate: data.plate,
        color: data.color || null,
      };

      console.log('Saving vehicle data:', vehicleData);
      const { data: vehicle, error: vehicleError } = await supabase
        .from('operator_vehicles')
        .insert(vehicleData)
        .select()
        .single();

      if (vehicleError) {
        console.error('Error saving vehicle:', vehicleError);
        throw vehicleError;
      }
      
      console.log('Vehicle saved successfully:', vehicle);

      // Upload the photos
      for (const [position, file] of Object.entries(vehiclePhotos)) {
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${vehicle.id}/photos/${position}_${Date.now()}.${fileExt}`;
          
          console.log(`Uploading ${position} photo: ${fileName}`);
          const { error: uploadError } = await supabase.storage
            .from('operator-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error(`Error uploading ${position} photo:`, uploadError);
            throw uploadError;
          }
        }
      }

      // Upload the documents
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${vehicle.id}/docs/${docType}_${Date.now()}.${fileExt}`;
          
          console.log(`Uploading ${docType} document: ${fileName}`);
          const { error: uploadError } = await supabase.storage
            .from('operator-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error(`Error uploading ${docType} document:`, uploadError);
            throw uploadError;
          }
        }
      }

      toast({
        title: "Éxito",
        description: "Vehículo registrado correctamente",
      });
      
      form.reset();
      setVehiclePhotos({
        front: null,
        back: null,
        left: null,
        right: null,
      });
      setDocuments({
        circulation: null,
        insurance: null,
      });
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Marca del vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo del vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Año del vehículo" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de placa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Color del vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fotos del Vehículo</h3>
              <div className="grid grid-cols-2 gap-4">
                <VehiclePhotoUpload
                  position="front"
                  label="Frente"
                  photo={vehiclePhotos.front}
                  onPhotoChange={(file) => setVehiclePhotos(prev => ({ ...prev, front: file }))}
                />
                <VehiclePhotoUpload
                  position="back"
                  label="Trasera"
                  photo={vehiclePhotos.back}
                  onPhotoChange={(file) => setVehiclePhotos(prev => ({ ...prev, back: file }))}
                />
                <VehiclePhotoUpload
                  position="left"
                  label="Lateral Izquierdo"
                  photo={vehiclePhotos.left}
                  onPhotoChange={(file) => setVehiclePhotos(prev => ({ ...prev, left: file }))}
                />
                <VehiclePhotoUpload
                  position="right"
                  label="Lateral Derecho"
                  photo={vehiclePhotos.right}
                  onPhotoChange={(file) => setVehiclePhotos(prev => ({ ...prev, right: file }))}
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
                  onFileChange={(file) => setDocuments(prev => ({ ...prev, circulation: file }))}
                />
                <VehicleDocumentUpload
                  documentType="insurance"
                  label="Póliza de Seguro"
                  file={documents.insurance}
                  onFileChange={(file) => setDocuments(prev => ({ ...prev, insurance: file }))}
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
