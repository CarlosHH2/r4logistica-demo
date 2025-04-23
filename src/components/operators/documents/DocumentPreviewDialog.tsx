
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  previewType: 'pdf' | 'image';
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  open,
  onOpenChange,
  previewUrl,
  previewType,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Vista previa del documento</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6 pt-0">
          {previewUrl && previewType === 'pdf' ? (
            <object 
              data={previewUrl} 
              type="application/pdf" 
              width="100%" 
              height="100%" 
              className="min-h-[600px]"
            >
              <p>Tu navegador no puede mostrar el PDF. 
                 <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                   Haz clic aquí para descargarlo
                 </a>
              </p>
            </object>
          ) : previewUrl && previewType === 'image' ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={previewUrl} 
                alt="Document preview" 
                className="max-w-full max-h-[calc(90vh-120px)] object-contain"
              />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;

