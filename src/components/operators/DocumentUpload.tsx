
import React, { useState } from 'react';
import { FileText, Upload, Check, X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Document = {
  id: string;
  name: string;
  file: File | null;
  required: boolean;
  status: 'pending' | 'uploaded' | 'error';
  description: string;
};

const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'curp',
      name: 'CURP',
      file: null,
      required: true,
      status: 'pending',
      description: 'Documento PDF de la CURP'
    },
    {
      id: 'ine_front',
      name: 'Identificación oficial (INE) - Frente',
      file: null,
      required: true,
      status: 'pending',
      description: 'Parte frontal de la credencial de elector'
    },
    {
      id: 'ine_back',
      name: 'Identificación oficial (INE) - Reverso',
      file: null,
      required: true,
      status: 'pending',
      description: 'Parte trasera de la credencial de elector'
    },
    {
      id: 'address_proof',
      name: 'Comprobante de domicilio',
      file: null,
      required: true,
      status: 'pending',
      description: 'Recibo de servicios (luz, agua, gas, etc.) no mayor a 3 meses'
    }
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setDocuments(documents.map(doc => 
        doc.id === docId 
          ? { ...doc, file, status: 'uploaded' } 
          : doc
      ));
    }
  };

  const removeFile = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId 
        ? { ...doc, file: null, status: 'pending' } 
        : doc
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Operador</CardTitle>
        <CardDescription>
          Sube los documentos requeridos en formato PDF
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {documents.map((doc) => (
          <div key={doc.id} className="space-y-2">
            <Label 
              htmlFor={doc.id}
              className="flex items-center space-x-2"
            >
              <span>{doc.name}</span>
              {doc.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="text-sm text-muted-foreground mb-2">{doc.description}</div>
            
            {doc.file ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="text-sm font-medium">{doc.file.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Label
                htmlFor={doc.id}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer",
                  "hover:bg-muted/50 transition-colors",
                  doc.status === 'error' ? "border-red-400" : "border-gray-300"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para cargar</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                </div>
                <input
                  id={doc.id}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, doc.id)}
                />
              </Label>
            )}
            
            {doc.status === 'error' && (
              <div className="flex items-center space-x-2 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>Error al cargar el archivo. Intenta de nuevo.</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
