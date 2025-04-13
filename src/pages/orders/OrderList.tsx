
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Download, Filter, Plus, Search, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const orders = [
  { id: 'ORD-1001', cliente: 'Comercial XYZ', fecha: '2023-04-12', estatus: 'entregado', valor: '$1,240.50', paquetes: 3 },
  { id: 'ORD-1002', cliente: 'Distribuidora ABC', fecha: '2023-04-12', estatus: 'en_ruta', valor: '$850.25', paquetes: 1 },
  { id: 'ORD-1003', cliente: 'Supermercado 123', fecha: '2023-04-11', estatus: 'pendiente', valor: '$3,456.70', paquetes: 5 },
  { id: 'ORD-1004', cliente: 'Tienda LMN', fecha: '2023-04-11', estatus: 'en_ruta', valor: '$654.30', paquetes: 2 },
  { id: 'ORD-1005', cliente: 'Empresa QWE', fecha: '2023-04-10', estatus: 'entregado', valor: '$1,987.45', paquetes: 4 },
  { id: 'ORD-1006', cliente: 'Negocio RTY', fecha: '2023-04-10', estatus: 'cancelado', valor: '$543.20', paquetes: 1 },
  { id: 'ORD-1007', cliente: 'Almacenes UIO', fecha: '2023-04-09', estatus: 'entregado', valor: '$2,765.80', paquetes: 3 },
  { id: 'ORD-1008', cliente: 'Farmacia PAS', fecha: '2023-04-09', estatus: 'pendiente', valor: '$345.60', paquetes: 1 },
];

const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
      pendiente: { label: 'Pendiente', variant: 'secondary' },
      en_ruta: { label: 'En Ruta', variant: 'default' },
      entregado: { label: 'Entregado', variant: 'outline' },
      cancelado: { label: 'Cancelado', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'default' };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Órdenes</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva orden
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todas" className="mb-6">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="en_ruta">En Ruta</TabsTrigger>
          <TabsTrigger value="entregadas">Entregadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar órdenes..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Select defaultValue="7d">
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Paquetes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.cliente}</TableCell>
                  <TableCell>{new Date(order.fecha).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{getStatusBadge(order.estatus)}</TableCell>
                  <TableCell>{order.valor}</TableCell>
                  <TableCell>{order.paquetes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando 1-8 de 235 órdenes
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
