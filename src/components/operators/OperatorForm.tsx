import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, User, Mail, Phone, HelpCircle, FileText, CreditCard, Car } from 'lucide-react';
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
import VehicleForm from './VehicleForm';
import DocumentUpload from './DocumentUpload';

// Form validation schema
const operatorFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastname: z.string().min(2, { message: 'El apellido paterno debe tener al menos 2 caracteres' }),
  secondLastname: z.string().min(2, { message: 'El apellido materno debe tener al menos 2 caracteres' }),
  sex: z.enum(['masculino', 'femenino', 'otro'], { 
    required_error: 'Por favor selecciona una opción' 
  }),
  birthDate: z.date({
    required_error: 'La fecha de nacimiento es requerida',
  }),
  curp: z.string().min(18, { message: 'El CURP debe tener 18 caracteres' }).max(18),
  rfc: z.string().min(10, { message: 'El RFC debe tener entre 10 y 13 caracteres' }).max(13),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  offerSource: z.string().min(1, { message: 'Por favor indica cómo se enteró de la oferta' }),
  activeTab: z.enum(['personal', 'documents', 'vehicles']).default('personal'),
});

type OperatorFormValues = z.infer<typeof operatorFormSchema>;

const OperatorForm: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Default values for the form
  const defaultValues: Partial<OperatorFormValues> = {
    name: '',
    lastname: '',
    secondLastname: '',
    sex: undefined,
    email: '',
    phone: '',
    offerSource: '',
  };

  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorFormSchema),
    defaultValues,
  });

  async function onSubmit(data: OperatorFormValues) {
    try {
      const { data: newOperator, error } = await supabase
        .from('operators')
        .insert([
          {
            name: data.name,
            lastname: data.lastname,
            second_lastname: data.secondLastname,
            sex: data.sex,
            birth_date: data.birthDate,
            curp: data.curp,
            rfc: data.rfc,
            email: data.email,
            phone: data.phone,
            offer_source: data.offerSource,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "La información del operador ha sido guardada.",
      });

      // Only navigate if we're in the personal tab
      if (form.watch('activeTab') === 'personal') {
        // Stay on the same page but switch to the documents tab
        form.setValue('activeTab', 'documents');
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

  const addVehicle = (vehicle: any) => {
    setVehicles([...vehicles, vehicle]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs 
          defaultValue="personal" 
          value={form.watch('activeTab')}
          onValueChange={(value) => form.setValue('activeTab', value)}
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
            <DocumentUpload />
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-4 mt-4">
            <VehicleForm onAddVehicle={addVehicle} />
            
            {vehicles.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Vehículos Registrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicles.map((vehicle, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Car className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Placa: {vehicle.plate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default OperatorForm;
