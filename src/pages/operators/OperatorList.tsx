
import React from 'react';
import { Plus, Search, Filter, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OperatorList: React.FC = () => {
  const { data: operators, isLoading } = useQuery({
    queryKey: ['operators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Operadores</h1>
        <Link to="/admin/operators/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Operador
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Operadores</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar operador..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center">
              <p>Cargando operadores...</p>
            </div>
          ) : operators && operators.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>CURP</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell className="font-medium">{operator.short_id}</TableCell>
                    <TableCell>
                      {`${operator.name} ${operator.lastname} ${operator.second_lastname}`}
                    </TableCell>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell>{operator.phone}</TableCell>
                    <TableCell>{operator.curp}</TableCell>
                    <TableCell>
                      <Link to={`/admin/operators/${operator.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-6 text-center">
              <h3 className="mt-2 text-lg font-semibold">No hay operadores registrados</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Empieza agregando un nuevo operador con el botón "Nuevo Operador".
              </p>
              <Link to="/admin/operators/new" className="mt-6 inline-flex">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Operador
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorList;
