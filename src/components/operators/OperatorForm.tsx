
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { operatorFormSchema, type OperatorFormValues } from '@/lib/schemas/operator';
import PersonalInfoForm from './personal-info/PersonalInfoForm';
import OperatorDocumentsTab from './documents/OperatorDocumentsTab';
import OperatorVehiclesTab from './vehicles/OperatorVehiclesTab';

interface OperatorFormProps {
  defaultValues?: Partial<OperatorFormValues>;
}

const OperatorForm: React.FC<OperatorFormProps> = ({ defaultValues }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorFormSchema),
    defaultValues: defaultValues || {
      name: '',
      lastname: '',
      secondLastname: '',
      sex: undefined,
      email: '',
      phone: '',
      offerSource: '',
      activeTab: 'personal',
    },
  });

  React.useEffect(() => {
    if (defaultValues?.id) {
      loadDocuments();
    }
  }, [defaultValues?.id]);

  const loadDocuments = async () => {
    if (!defaultValues?.id) return;

    const { data: documentsData } = await supabase
      .from('operator_documents')
      .select('*')
      .eq('operator_id', defaultValues.id);

    if (documentsData) {
      setDocuments(documentsData);
    }
  };

  const handleDocumentUpload = async (file: File, documentType: string) => {
    if (!defaultValues?.id || !file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${defaultValues.id}/${documentType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('operator-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data, error: dbError } = await supabase
        .from('operator_documents')
        .insert({
          operator_id: defaultValues.id,
          document_type: documentType,
          file_name: file.name,
          file_path: fileName,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setDocuments([...documents, data]);
      toast({
        title: "Éxito",
        description: "Documento cargado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDocumentDelete = async (documentId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('operator-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('operator_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      setDocuments(documents.filter(d => d.id !== documentId));
      toast({
        title: "Éxito",
        description: "Documento eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  async function onSubmit(data: OperatorFormValues) {
    try {
      const formattedDate = format(data.birthDate, 'yyyy-MM-dd');
      const operatorData = {
        name: data.name,
        lastname: data.lastname,
        second_lastname: data.secondLastname,
        sex: data.sex,
        birth_date: formattedDate,
        curp: data.curp,
        rfc: data.rfc,
        email: data.email,
        phone: data.phone,
        offer_source: data.offerSource,
      };

      let error;
      let operatorId = defaultValues?.id;
      
      if (defaultValues?.id) {
        const { error: updateError } = await supabase
          .from('operators')
          .update(operatorData)
          .eq('id', defaultValues.id);
        error = updateError;
      } else {
        const { data: newOperator, error: insertError } = await supabase
          .from('operators')
          .insert(operatorData)
          .select()
          .single();
        
        error = insertError;
        if (newOperator) {
          operatorId = newOperator.id;
          form.setValue('id', operatorId);
        }
      }

      if (error) throw error;

      toast({
        title: "Éxito",
        description: defaultValues?.id 
          ? "La información del operador ha sido actualizada."
          : "La información del operador ha sido guardada.",
      });

      if (form.watch('activeTab') === 'personal') {
        form.setValue('activeTab', 'documents');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al guardar la información.",
      });
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs 
            defaultValue="personal" 
            value={form.watch('activeTab')}
            onValueChange={(value: string) => {
              if (value === 'personal' || value === 'documents' || value === 'vehicles') {
                form.setValue('activeTab', value);
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Datos Personales</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 mt-4">
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-4">
              <OperatorDocumentsTab
                operatorId={defaultValues?.id}
                documents={documents}
                onDocumentUpload={handleDocumentUpload}
                onDocumentDelete={handleDocumentDelete}
              />
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-4 mt-4">
              {defaultValues?.id && (
                <OperatorVehiclesTab operatorId={defaultValues.id} />
              )}
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </FormProvider>
  );
};

export default OperatorForm;
