
import { supabase } from '@/integrations/supabase/client';
import { VehicleFormValues } from '@/lib/schemas/operator';

export const vehicleService = {
  async registerVehicle(operatorId: string, data: VehicleFormValues) {
    try {
      if (!operatorId) {
        throw new Error('ID del operador no proporcionado');
      }

      console.log('Registrando vehículo para operador:', operatorId);
      console.log('Datos del vehículo:', data);
      
      const vehicleData = {
        operator_id: operatorId,
        brand: data.brand,
        model: data.model,
        year: Number(data.year),
        plate: data.plate,
        color: data.color || null,
      };

      console.log('Guardando datos del vehículo:', vehicleData);
      
      // Aseguramos que se está utilizando INSERT explícitamente para crear un nuevo vehículo
      const { data: vehicle, error } = await supabase
        .from('operator_vehicles')
        .insert([vehicleData])
        .select()
        .single();

      if (error) {
        console.error('Error al guardar vehículo:', error);
        throw error;
      }

      console.log('Vehículo registrado exitosamente:', vehicle);
      return vehicle;
    } catch (error) {
      console.error('Error en registerVehicle:', error);
      throw error;
    }
  },

  async getVehiclesByOperator(operatorId: string) {
    try {
      if (!operatorId) {
        throw new Error('ID del operador no proporcionado');
      }

      const { data, error } = await supabase
        .from('operator_vehicles')
        .select('*')
        .eq('operator_id', operatorId);

      if (error) {
        console.error('Error al obtener vehículos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getVehiclesByOperator:', error);
      throw error;
    }
  },

  async deleteVehicle(vehicleId: string) {
    try {
      if (!vehicleId) {
        throw new Error('ID del vehículo no proporcionado');
      }

      const { error } = await supabase
        .from('operator_vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) {
        console.error('Error al eliminar vehículo:', error);
        throw error;
      }

      console.log('Vehículo eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('Error en deleteVehicle:', error);
      throw error;
    }
  }
};
