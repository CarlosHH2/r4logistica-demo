
import { supabase } from '@/integrations/supabase/client';
import { VehicleFormValues } from '@/lib/schemas/operator';

export const vehicleService = {
  async createBucketIfNotExists() {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'operator-documents');
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket('operator-documents', {
          public: true
        });
        if (error) throw error;
        console.log('Bucket creado: operator-documents');
      }
    } catch (error) {
      console.error('Error al verificar/crear bucket:', error);
      throw error;
    }
  },

  async uploadFile(vehicleId: string, file: File, type: string, category: 'photos' | 'docs') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}/${category}/${type}_${Date.now()}.${fileExt}`;
      
      console.log(`Subiendo ${type} ${category}: ${fileName}`);
      const { error: uploadError } = await supabase.storage
        .from('operator-documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error(`Error al subir ${type} ${category}:`, uploadError);
        throw uploadError;
      }
      
      console.log(`Archivo ${fileName} subido correctamente`);
    } catch (error) {
      console.error(`Error en uploadFile:`, error);
      throw error;
    }
  },

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
      
      const { data: vehicle, error } = await supabase
        .from('operator_vehicles')
        .insert(vehicleData)
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
  }
};
