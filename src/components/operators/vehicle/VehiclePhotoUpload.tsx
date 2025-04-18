
import React from 'react';
import { Camera, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface VehiclePhotoUploadProps {
  position: string;
  label: string;
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
}

const VehiclePhotoUpload: React.FC<VehiclePhotoUploadProps> = ({
  position,
  label,
  photo,
  onPhotoChange
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onPhotoChange(event.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`photo-${position}`}>
        {label} <span className="text-red-500">*</span>
      </Label>
      
      <div className="border rounded-md overflow-hidden">
        {photo ? (
          <div className="relative aspect-video bg-muted">
            <img 
              src={URL.createObjectURL(photo)} 
              alt={`${label} del vehículo`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onPhotoChange(null)}
              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Label
            htmlFor={`photo-${position}`}
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 cursor-pointer",
              "border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Subir foto</span>
            </div>
            <input
              id={`photo-${position}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
        )}
      </div>
    </div>
  );
};

export default VehiclePhotoUpload;
