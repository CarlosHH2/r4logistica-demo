
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Order } from '@/types/order';
import MapDisplay from '@/components/maps/MapDisplay';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Save, ArrowLeft } from 'lucide-react';

type ManualOrderForm = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'is_manual' | 'user_id'>;

const CreateManualOrder = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ManualOrderForm>();

  const onSubmit = async (data: ManualOrderForm) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!userData.user) {
        toast.error('Usuario no autenticado');
        return;
      }
      
      const { error } = await supabase
        .from('orders')
        .insert({
          ...data,
          is_manual: true,
          user_id: userData.user.id,
          country: 'MX'
        });

      if (error) throw error;

      toast.success('Orden manual creada exitosamente');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Error creating manual order:', error);
      toast.error('Error al crear la orden manual');
    }
  };

  const handleAddressSelect = (addressData: Partial<ManualOrderForm>) => {
    Object.entries(addressData).forEach(([key, value]) => {
      if (value) {
        setValue(key as keyof ManualOrderForm, value);
      }
    });
    toast.success('Dirección seleccionada correctamente');
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/orders')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Nueva Orden Manual</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
          {/* Left side - Form */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="street">Calle</label>
                  <Input
                    id="street"
                    {...register('street', { required: 'La calle es requerida' })}
                    placeholder="Calle"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-500">{errors.street.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="number">Número</label>
                  <Input
                    id="number"
                    {...register('number', { required: 'El número es requerido' })}
                    placeholder="Número exterior"
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500">{errors.number.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="int_number">Número Interior</label>
                  <Input
                    id="int_number"
                    {...register('int_number')}
                    placeholder="Número interior (opcional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="neighborhood">Colonia</label>
                  <Input
                    id="neighborhood"
                    {...register('neighborhood', { required: 'La colonia es requerida' })}
                    placeholder="Colonia"
                  />
                  {errors.neighborhood && (
                    <p className="text-sm text-red-500">{errors.neighborhood.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="postal_code">Código Postal</label>
                  <Input
                    id="postal_code"
                    {...register('postal_code', { required: 'El código postal es requerido' })}
                    placeholder="Código postal"
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-red-500">{errors.postal_code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="administrative_area">Estado</label>
                  <Input
                    id="administrative_area"
                    {...register('administrative_area', { required: 'El estado es requerido' })}
                    placeholder="Estado"
                  />
                  {errors.administrative_area && (
                    <p className="text-sm text-red-500">{errors.administrative_area.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="sub_administrative_area">Ciudad</label>
                  <Input
                    id="sub_administrative_area"
                    {...register('sub_administrative_area', { required: 'La ciudad es requerida' })}
                    placeholder="Ciudad"
                  />
                  {errors.sub_administrative_area && (
                    <p className="text-sm text-red-500">{errors.sub_administrative_area.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="reference">Referencia</label>
                  <Input
                    id="reference"
                    {...register('reference')}
                    placeholder="Referencia (opcional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="notes">Notas</label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Notas adicionales (opcional)"
                  className="h-24"
                />
              </div>

              <input type="hidden" {...register('lat')} />
              <input type="hidden" {...register('lng')} />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/orders')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creando...' : 'Crear Orden'}
                </Button>
              </div>
            </div>
          </ResizablePanel>

          {/* Resizable handle */}
          <ResizableHandle withHandle />

          {/* Right side - Map */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <MapDisplay onAddressSelect={handleAddressSelect} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
    </div>
  );
};

export default CreateManualOrder;
