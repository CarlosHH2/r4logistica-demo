import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Plus, Camera, FileText, Shield, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const vehicleFormSchema = z.object({
  brand: z.string().min(2, { message: 'La marca es requerida' }),
  model: z.string().min(2, { message: 'El modelo es requerido' }),
  year: z.string().min(4, { message: 'El año es requerido' }).max(4),
  vehicleType: z.string().min(1, { message: 'El tipo de unidad es requerido' }),
  plate: z.string().min(5, { message: 'El número de placa es requerido' }),
  circulationCard: z.string().min(5, { message: 'El número de tarjeta de circulación es requerido' }),
  niv: z.string().min(17, { message: 'El NIV debe tener al menos 17 caracteres' }).max(17),
  hasInsurance: z.boolean().default(false),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  onAddVehicle: (vehicle: any) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onAddVehicle }) => {
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
    circulationCard: File | null;
    insurance: File | null;
  }>({
    circulationCard: null,
    insurance: null,
  });

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: '',
      vehicleType: '',
      plate: '',
      circulationCard: '',
      niv: '',
      hasInsurance: false,
    },
  });

  function onSubmit(data: VehicleFormValues) {
    // Check if the vehicle photos are complete
    const allPhotosUploaded = Object.values(vehiclePhotos).every(photo => photo !== null);
    const requiredDocsUploaded = documents.circulationCard !== null && 
      (!data.hasInsurance || documents.insurance !== null);
    
    if (!allPhotosUploaded || !requiredDocsUploaded) {
      alert('Por favor carga todas las fotos y documentos requeridos.');
      return;
    }
    
    const vehicleData = {
      ...data,
      photos: vehiclePhotos,
      documents: documents,
    };
    
    onAddVehicle(vehicleData);
    
    // Reset the form
    form.reset();
    setVehiclePhotos({
      front: null,
      back: null,
      left: null,
      right: null,
    });
    setDocuments({
      circulationCard: null,
      insurance: null,
    });
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>, position: keyof typeof vehiclePhotos) => {
    if (event.target.files && event.target.files[0]) {
      setVehiclePhotos({
        ...vehiclePhotos,
        [position]: event.target.files[0],
      });
    }
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>, docType: keyof typeof documents) => {
    if (event.target.files && event.target.files[0]) {
      setDocuments({
        ...documents,
        [docType]: event.target.files[0],
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Vehículo</CardTitle>
        <CardDescription>
          Ingresa los datos del vehículo y carga las fotos requeridas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                      <Input placeholder="Año del vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Unidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="camioneta">Camioneta</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de placa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="circulationCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Tarjeta de Circulación</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de tarjeta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="niv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número NIV</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de Identificación Vehicular" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Fotos del Vehículo</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(vehiclePhotos) as Array<keyof typeof vehiclePhotos>).map((position) => {
                  const labels = {
                    front: 'Frente',
                    back: 'Trasera',
                    left: 'Lateral Izquierdo',
                    right: 'Lateral Derecho',
                  };
                  
                  return (
                    <div key={position} className="space-y-2">
                      <Label htmlFor={`photo-${position}`}>{labels[position]} *</Label>
                      <div className="border rounded-md overflow-hidden">
                        {vehiclePhotos[position] ? (
                          <div className="relative aspect-video bg-muted">
                            <img 
                              src={URL.createObjectURL(vehiclePhotos[position] as File)} 
                              alt={`${labels[position]} del vehículo`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setVehiclePhotos({...vehiclePhotos, [position]: null})}
                              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <Label
                            htmlFor={`photo-${position}`}
                            className="flex flex-col items-center justify-center w-full h-32 cursor-pointer bg-muted hover:bg-muted/80"
                          >
                            <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Subir foto</span>
                            <input
                              id={`photo-${position}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoChange(e, position)}
                            />
                          </Label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Documentos del Vehículo</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-circulation">Tarjeta de Circulación *</Label>
                  <div className="border rounded-md p-4">
                    {documents.circulationCard ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div className="text-sm font-medium">
                            {documents.circulationCard.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments({...documents, circulationCard: null})}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <Label
                        htmlFor="doc-circulation"
                        className="flex items-center justify-center h-24 cursor-pointer border-2 border-dashed rounded-md hover:bg-muted/50"
                      >
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Subir documento</span>
                        </div>
                        <input
                          id="doc-circulation"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleDocumentChange(e, 'circulationCard')}
                        />
                      </Label>
                    )}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="hasInsurance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <span>¿Cuenta con seguro?</span>
                          </div>
                        </FormLabel>
                        <FormDescription>
                          Indica si el vehículo cuenta con seguro vigente.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch('hasInsurance') && (
                  <div className="space-y-2">
                    <Label htmlFor="doc-insurance">Póliza de Seguro *</Label>
                    <div className="border rounded-md p-4">
                      {documents.insurance ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div className="text-sm font-medium">
                              {documents.insurance.name}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDocuments({...documents, insurance: null})}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <Label
                          htmlFor="doc-insurance"
                          className="flex items-center justify-center h-24 cursor-pointer border-2 border-dashed rounded-md hover:bg-muted/50"
                        >
                          <div className="flex flex-col items-center">
                            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Subir documento</span>
                          </div>
                          <input
                            id="doc-insurance"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleDocumentChange(e, 'insurance')}
                          />
                        </Label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Vehículo
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
