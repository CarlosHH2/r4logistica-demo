
import React from 'react';
import { FileText, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface VehicleDocumentUploadProps {
  documentType: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  required?: boolean;
}

const VehicleDocumentUpload: React.FC<VehicleDocumentUploadProps> = ({
  documentType,
  label,
  file,
  onFileChange,
  required = true
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(event.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`doc-${documentType}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="border rounded-md p-4">
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="text-sm font-medium">{file.name}</div>
            </div>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Label
            htmlFor={`doc-${documentType}`}
            className="flex items-center justify-center h-24 cursor-pointer border-2 border-dashed rounded-md hover:bg-muted/50"
          >
            <div className="flex flex-col items-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Subir documento</span>
            </div>
            <input
              id={`doc-${documentType}`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
        )}
      </div>
    </div>
  );
};

export default VehicleDocumentUpload;
