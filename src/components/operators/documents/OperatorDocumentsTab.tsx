
import React, { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OperatorDocumentsTabProps {
  operatorId?: string;
  documents: any[];
  onDocumentUpload: (file: File, documentType: string) => Promise<void>;
  onDocumentDelete: (documentId: string, filePath: string) => Promise<void>;
}

const OperatorDocumentsTab: React.FC<OperatorDocumentsTabProps> = ({
  operatorId,
  documents,
  onDocumentUpload,
  onDocumentDelete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setIsLoading(true);
      await onDocumentUpload(file, documentType);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al subir el documento",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDocumentUploaded = (docType: string) => {
    return documents.some(doc => doc.document_type === docType);
  };

  const getDocumentByType = (docType: string) => {
    return documents.find(doc => doc.document_type === docType);
  };

  const documentTypes = ['INE', 'Licencia', 'Comprobante de domicilio', 'CURP', 'Carta de Antecedentes', 'Examen Toxicológico'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Operador</CardTitle>
        <CardDescription>
          Gestiona los documentos del operador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentTypes.map((docType) => {
            const isUploaded = isDocumentUploaded(docType);
            const doc = getDocumentByType(docType);

            return (
              <Card 
                key={docType} 
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
                            onClick={() => {
                              if (doc.url) {
                                window.open(doc.url, '_blank');
                              }
                            }}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Ver documento
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDocumentDelete(doc.id, doc.file_path)}
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
                          if (file) handleFileUpload(file, docType);
                        }}
                        disabled={isLoading}
                        className="w-full"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OperatorDocumentsTab;
