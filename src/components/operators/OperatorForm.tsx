import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, User, Mail, Phone, HelpCircle, FileText, CreditCard, Car, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { operatorFormSchema, type OperatorFormValues, type VehicleFormValues } from '@/lib/schemas/operator';

interface OperatorFormProps {
  defaultValues?: Partial<OperatorFormValues>;
}

const OperatorForm: React.FC<OperatorFormProps> = ({ defaultValues }) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load operator's vehicles and documents if editing
  useEffect(() => {
    if (defaultValues?.id) {
      loadVehiclesAndDocuments();
    }
  }, [defaultValues?.id]);

  const loadVehiclesAndDocuments = async () => {
    if (!defaultValues?.id) return;

    // Fetch vehicles
    const { data: vehiclesData } = await supabase
      .from('operator_vehicles')
      .select('*')
      .eq('operator_id', defaultValues.id);

    if (vehiclesData) {
      setVehicles(vehiclesData);
    }

    // Fetch documents
    const { data: documentsData } = await supabase
      .from('operator_documents')
      .select('*')
      .eq('operator_id', defaultValues.id);

    if (documentsData) {
      setDocuments(documentsData);
    }
  };

  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorFormSchema),
    defaultValues: defaultValues || {
      name: '',
      lastname: '',
      secondLastname: '',
      sex: undefined,
      email: '',
      phone: '',
      offerSource: '',
      activeTab: 'personal',
    },
  });

  const handleAddVehicle = async (vehicleData: VehicleFormValues) => {
    if (!defaultValues?.id) return;

    const { data, error } = await supabase
      .from('operator_vehicles')
      .insert({
        operator_id: defaultValues.id,
        ...vehicleData
      })
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al guardar el vehículo",
      });
      return;
    }

    setVehicles([...vehicles, data]);
    toast({
      title: "Éxito",
      description: "Vehículo agregado correctamente",
    });
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    const { error } = await supabase
      .from('operator_vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el vehículo",
      });
      return;
    }

    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    toast({
      title: "Éxito",
      description: "Vehículo eliminado correctamente",
    });
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!defaultValues?.id || !file) return;

    setIsLoading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${defaultValues.id}/${documentType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('operator-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error: dbError } = await supabase
        .from('operator_documents')
        .insert({
          operator_id: defaultValues.id,
          document_type: documentType,
          file_name: file.name,
          file_path: fileName,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setDocuments([...documents, data]);
      toast({
        title: "Éxito",
        description: "Documento cargado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar el documento",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('operator-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('operator_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      setDocuments(documents.filter(d => d.id !== documentId));
      toast({
        title: "Éxito",
        description: "Documento eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el documento",
      });
    }
  };

  async function onSubmit(data: OperatorFormValues) {
    try {
      const formattedDate = format(data.birthDate, 'yyyy-MM-dd');
      const operatorData = {
        name: data.name,
        lastname: data.lastname,
        second_lastname: data.secondLastname,
        sex: data.sex,
        birth_date: formattedDate,
        curp: data.curp,
        rfc: data.rfc,
        email: data.email,
        phone: data.phone,
        offer_source: data.offerSource,
      };

      let error;
      if (defaultValues?.id) {
        // Update existing operator
        const { error: updateError } = await supabase
          .from('operators')
          .update(operatorData)
          .eq('id', defaultValues.id);
        error = updateError;
      } else {
        // Insert new operator
        const { error: insertError } = await supabase
          .from('operators')
          .insert(operatorData)
          .select()
          .single();
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Éxito",
        description: defaultValues?.id 
          ? "La información del operador ha sido actualizada."
          : "La información del operador ha sido guardada.",
      });

      // Only navigate if we're in the personal tab
      if (form.watch('activeTab') === 'personal') {
        if (defaultValues?.id) {
          form.setValue('activeTab', 'documents');
        } else {
          navigate('/admin/operators');
        }
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al guardar la información.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs 
          defaultValue="personal" 
          value={form.watch('activeTab')}
          onValueChange={(value: string) => {
            if (value === 'personal' || value === 'documents' || value === 'vehicles') {
              form.setValue('activeTab', value);
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Datos Personales</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Ingrese los datos personales del operador.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Paterno</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellido paterno" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="secondLastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Materno</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellido materno" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Sexo</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="masculino" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Masculino
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="femenino" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Femenino
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="otro" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Otro
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="curp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CURP</FormLabel>
                        <FormControl>
                          <Input placeholder="CURP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rfc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RFC</FormLabel>
                        <FormControl>
                          <Input placeholder="RFC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono Celular</FormLabel>
                      <FormControl>
                        <Input placeholder="+52 1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="offerSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Cómo se enteró de nuestra oferta de trabajo?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar origen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="internet">Internet</SelectItem>
                          <SelectItem value="recomendacion">Recomendación</SelectItem>
                          <SelectItem value="bolsa_trabajo">Bolsa de trabajo</SelectItem>
                          <SelectItem value="redes_sociales">Redes sociales</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/admin/operators')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar y Continuar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentos del Operador</CardTitle>
                <CardDescription>
                  Gestiona los documentos del operador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.document_type}</p>
                        <p className="text-sm text-muted-foreground">{doc.file_name}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {['INE', 'Licencia', 'Comprobante de domicilio', 'CURP'].map((docType) => (
                    <Card key={docType} className="p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">{docType}</p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, docType);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehículos del Operador</CardTitle>
                <CardDescription>
                  Lista de vehículos registrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicles.map((vehicle) => (
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
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default OperatorForm;
