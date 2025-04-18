
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import OperatorForm from '@/components/operators/OperatorForm';
import { OperatorFormValues } from '@/lib/schemas/operator';

const OperatorEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: operator, isLoading, error } = useQuery({
    queryKey: ['operator', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Operador no encontrado');
      
      // Map the database fields to the form fields with proper typing
      const formattedOperator: Partial<OperatorFormValues> = {
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        secondLastname: data.second_lastname,
        sex: data.sex as 'masculino' | 'femenino' | 'otro',
        birthDate: new Date(data.birth_date),
        curp: data.curp,
        rfc: data.rfc,
        email: data.email,
        phone: data.phone,
        offerSource: data.offer_source,
        activeTab: 'personal',
      };
      
      return formattedOperator;
    },
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching operator:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del operador",
        });
      }
    }
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !operator) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/operators">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Error</h1>
          </div>
        </div>
        <div className="bg-destructive/10 p-4 rounded-md">
          <p>No se pudo encontrar el operador. Verifique el ID e intente nuevamente.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/admin/operators')}
          >
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/admin/operators">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Editar Operador</h1>
        </div>
      </div>
      
      <OperatorForm defaultValues={operator} />
    </div>
  );
};

export default OperatorEdit;
