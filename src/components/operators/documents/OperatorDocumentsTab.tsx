
import React, { useState, useEffect } from 'react';
import { FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();

  // Fetch signed URLs for all documents when documents array changes
  useEffect(() => {
    const fetchSignedUrls = async () => {
      const urls: Record<string, string> = {};
      
      for (const doc of documents) {
        try {
          const { data, error } = await supabase.storage
            .from('operator-documents')
            .createSignedUrl(doc.file_path, 60 * 60); // URL válida por 1 hora
            
          if (error) {
            console.error('Error creating signed URL:', error);
            continue;
          }
          
          if (data && data.signedUrl) {
            urls[doc.id] = data.signedUrl;
          }
        } catch (err) {
          console.error('Error getting signed URL for document:', err);
        }
      }
      
      setDocumentUrls(urls);
    };
    
    if (documents.length > 0) {
      fetchSignedUrls();
    }
  }, [documents]);

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

  const handlePreviewDocument = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  const documentTypes = ['INE', 'Licencia', 'Comprobante de domicilio', 'CURP', 'Carta de Antecedentes', 'Examen Toxicológico'];

  return (
    <>
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
                                if (documentUrls[doc.id]) {
                                  handlePreviewDocument(documentUrls[doc.id]);
                                } else {
                                  toast({
                                    variant: "destructive",
                                    title: "Error",
                                    description: "No se pudo obtener el enlace del documento. Inténtalo nuevamente.",
                                  });
                                }
                              }}
                              className="gap-2"
                              disabled={!documentUrls[doc.id]}
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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Vista previa del documento</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[70vh] overflow-auto">
            {previewUrl && (
              previewUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={`${previewUrl}#toolbar=0&navpanes=0`} 
                  className="w-full h-full" 
                  title="PDF Viewer"
                />
              ) : (
                <img 
                  src={previewUrl} 
                  alt="Document preview" 
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OperatorDocumentsTab;
