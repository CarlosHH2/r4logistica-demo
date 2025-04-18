
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import OperatorForm from '@/components/operators/OperatorForm';

const OperatorEdit: React.FC = () => {
  const { id } = useParams();

  const { data: operator, isLoading } = useQuery({
    queryKey: ['operator', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Operador no encontrado');
      
      return {
        ...data,
        birthDate: new Date(data.birth_date),
      };
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!operator) {
    return <div>Operador no encontrado</div>;
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
