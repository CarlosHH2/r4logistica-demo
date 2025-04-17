
import React from 'react';
import { Plus, Search, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const OperatorList: React.FC = () => {
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
          <div className="rounded-md border">
            <div className="py-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorList;
