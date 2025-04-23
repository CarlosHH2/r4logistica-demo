
import React from 'react';
import { FileText, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  docType: string;
  isUploaded: boolean;
  doc?: any;
  documentUrl?: string;
  isLoading: boolean;
  onPreview: (e: React.MouseEvent, url: string, fileName: string) => void;
  onDelete: (documentId: string, filePath: string) => Promise<void>;
  onFileUpload: (file: File, documentType: string) => void;
  onError: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  docType,
  isUploaded,
  doc,
  documentUrl,
  isLoading,
  onPreview,
  onDelete,
  onFileUpload,
  onError,
}) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-colors",
        isUploaded ? "bg-green-50 border-green-200" : "bg-background"
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-2">
          <FileText className={cn(
            "h-8 w-8",
            isUploaded ? "text-green-500" : "text-muted-foreground"
          )} />
          <p className="font-medium text-center">{docType}</p>
          
          {isUploaded && doc ? (
            <div className="w-full space-y-2">
              <p className="text-sm text-center text-muted-foreground">{doc.file_name}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    if (documentUrl) {
                      onPreview(e, documentUrl, doc.file_name);
                    } else {
                      onError();
                    }
                  }}
                  className="gap-2"
                  disabled={!documentUrl}
                  type="button"
                >
                  <Eye className="h-4 w-4" />
                  Ver documento
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(doc.id, doc.file_path);
                  }}
                  type="button"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ) : (
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file, docType);
              }}
              disabled={isLoading}
              className="w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
