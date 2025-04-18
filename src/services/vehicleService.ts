
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
        console.log('Created bucket: operator-documents');
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      throw error;
    }
  },

  async uploadFile(vehicleId: string, file: File, type: string, category: 'photos' | 'docs') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${vehicleId}/${category}/${type}_${Date.now()}.${fileExt}`;
    
    console.log(`Uploading ${type} ${category}: ${fileName}`);
    const { error: uploadError } = await supabase.storage
      .from('operator-documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error(`Error uploading ${type} ${category}:`, uploadError);
      throw uploadError;
    }
  },

  async registerVehicle(operatorId: string, data: VehicleFormValues) {
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

    return vehicle;
  }
};
