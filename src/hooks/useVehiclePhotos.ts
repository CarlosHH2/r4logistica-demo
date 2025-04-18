
import { useState } from 'react';

interface VehiclePhotos {
  front: File | null;
  back: File | null;
  left: File | null;
  right: File | null;
}

export const useVehiclePhotos = () => {
  const [photos, setPhotos] = useState<VehiclePhotos>({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const updatePhoto = (position: keyof VehiclePhotos, file: File | null) => {
    setPhotos(prev => ({ ...prev, [position]: file }));
  };

  const resetPhotos = () => {
    setPhotos({
      front: null,
      back: null,
      left: null,
      right: null,
    });
  };

  const areAllPhotosUploaded = () => {
    return Object.values(photos).every(photo => photo !== null);
  };

  return {
    photos,
    updatePhoto,
    resetPhotos,
    areAllPhotosUploaded
  };
};
