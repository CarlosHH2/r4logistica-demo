
import React, { useState, useEffect } from 'react';
import { FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

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
  const [previewType, setPreviewType] = useState<'pdf' | 'image'>('image');
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

  const handlePreviewDocument = (e: React.MouseEvent, url: string, fileName: string) => {
    // Prevenir comportamiento por defecto para evitar envío de formulario
    e.preventDefault();
    e.stopPropagation();
    
    setPreviewUrl(url);
    // Determine document type based on file extension
    const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
    setPreviewType(fileType);
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
                              onClick={(e) => {
                                if (documentUrls[doc.id]) {
                                  handlePreviewDocument(e, documentUrls[doc.id], doc.file_name);
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
                              type="button" // Importante: especificar que es un botón de tipo button para evitar el envío del formulario
                            >
                              <Eye className="h-4 w-4" />
                              Ver documento
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault(); // Prevenir envío de formulario
                                onDocumentDelete(doc.id, doc.file_path);
                              }}
                              type="button" // Importante: especificar que es un botón de tipo button
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

      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
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
    </>
  );
};

export default OperatorDocumentsTab;
