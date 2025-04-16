
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

type ManualOrderForm = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'is_manual'>;

const CreateManualOrder = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ManualOrderForm>();

  const onSubmit = async (data: ManualOrderForm) => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{ ...data, is_manual: true }]);

      if (error) throw error;

      toast.success('Orden manual creada exitosamente');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Error creating manual order:', error);
      toast.error('Error al crear la orden manual');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nueva Orden Manual</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
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

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/orders')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Orden'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateManualOrder;
