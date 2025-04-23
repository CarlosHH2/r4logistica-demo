
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DocumentCard from './DocumentCard';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import { useOperatorDocuments } from '@/hooks/useOperatorDocuments';

interface OperatorDocumentsTabProps {
  operatorId?: string;
  documents: any[];
  onDocumentUpload: (file: File, documentType: string) => Promise<void>;
  onDocumentDelete: (documentId: string, filePath: string) => Promise<void>;
}

const OperatorDocumentsTab: React.FC<OperatorDocumentsTabProps> = ({
  documents,
  onDocumentUpload,
  onDocumentDelete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    documentUrls,
    previewUrl,
    previewOpen,
    previewType,
    setPreviewOpen,
    handlePreviewDocument,
  } = useOperatorDocuments(documents);

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

  const documentTypes = [
    'INE', 
    'Licencia', 
    'Comprobante de domicilio', 
    'CURP', 
    'Carta de Antecedentes', 
    'Examen Toxicológico'
  ];

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
                <DocumentCard
                  key={docType}
                  docType={docType}
                  isUploaded={isUploaded}
                  doc={doc}
                  documentUrl={doc ? documentUrls[doc.id] : undefined}
                  isLoading={isLoading}
                  onPreview={handlePreviewDocument}
                  onDelete={onDocumentDelete}
                  onFileUpload={handleFileUpload}
                  onError={() => {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "No se pudo obtener el enlace del documento. Inténtalo nuevamente.",
                    });
                  }}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <DocumentPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        previewUrl={previewUrl}
        previewType={previewType}
      />
    </>
  );
};

export default OperatorDocumentsTab;
