
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type OperatorFormValues } from '@/lib/schemas/operator';
import { useOperatorForm } from '@/hooks/useOperatorForm';
import PersonalInfoForm from './personal-info/PersonalInfoForm';
import OperatorDocumentsTab from './documents/OperatorDocumentsTab';
import OperatorVehiclesTab from './vehicles/OperatorVehiclesTab';

interface OperatorFormProps {
  defaultValues?: Partial<OperatorFormValues>;
}

const OperatorForm: React.FC<OperatorFormProps> = ({ defaultValues }) => {
  const { form, documents, handleDocumentUpload, handleDocumentDelete, onSubmit } = useOperatorForm({
    defaultValues
  });

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
