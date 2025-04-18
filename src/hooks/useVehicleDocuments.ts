
import { useState } from 'react';

interface VehicleDocuments {
  circulation: File | null;
  insurance: File | null;
}

export const useVehicleDocuments = () => {
  const [documents, setDocuments] = useState<VehicleDocuments>({
    circulation: null,
    insurance: null,
  });

  const updateDocument = (docType: keyof VehicleDocuments, file: File | null) => {
    setDocuments(prev => ({ ...prev, [docType]: file }));
  };

  const resetDocuments = () => {
    setDocuments({
      circulation: null,
      insurance: null,
    });
  };

  return {
    documents,
    updateDocument,
    resetDocuments
  };
};
