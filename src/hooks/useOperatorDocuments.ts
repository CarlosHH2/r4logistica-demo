
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOperatorDocuments = (documents: any[]) => {
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'pdf' | 'image'>('image');
  const { toast } = useToast();

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const urls: Record<string, string> = {};
      
      for (const doc of documents) {
        try {
          const { data, error } = await supabase.storage
            .from('operator-documents')
            .createSignedUrl(doc.file_path, 60 * 60);
            
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

  const handlePreviewDocument = (e: React.MouseEvent, url: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setPreviewUrl(url);
    const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
    setPreviewType(fileType);
    setPreviewOpen(true);
  };

  return {
    documentUrls,
    previewUrl,
    previewOpen,
    previewType,
    setPreviewOpen,
    handlePreviewDocument,
  };
};

