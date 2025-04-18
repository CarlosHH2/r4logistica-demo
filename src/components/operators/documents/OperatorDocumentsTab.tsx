
import React, { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; type: string } | null>(null);
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

  const handlePreviewDocument = (url: string, documentType: string) => {
    setSelectedDocument({ url, type: documentType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Operador</CardTitle>
        <CardDescription>
          Gestiona los documentos del operador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">{doc.document_type}</p>
                <p className="text-sm text-muted-foreground">{doc.file_name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePreviewDocument(doc.url, doc.document_type)}
              >
                Previsualizar
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDocumentDelete(doc.id, doc.file_path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {['INE', 'Licencia', 'Comprobante de domicilio', 'CURP', 'Carta de Antecedentes', 'Examen Toxicológico'].map((docType) => (
            <Card key={docType} className="p-4">
              <div className="flex flex-col items-center space-y-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="font-medium">{docType}</p>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, docType);
                  }}
                  disabled={isLoading}
                />
              </div>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Previsualización de {selectedDocument?.type}</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <>
              {selectedDocument.url.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                <img 
                  src={selectedDocument.url} 
                  alt={`Documento ${selectedDocument.type}`} 
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <iframe 
                  src={selectedDocument.url} 
                  className="w-full h-[70vh]"
                  title={`Documento ${selectedDocument.type}`}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OperatorDocumentsTab;
