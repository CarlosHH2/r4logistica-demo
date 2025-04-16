
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Download, Filter, Plus, Search, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order } from '@/types/order';

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });

  const filteredOrders = orders?.filter(order => 
    order.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.postal_code.includes(searchTerm) ||
    order.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <TabsTrigger value="manuales">Manuales</TabsTrigger>
          <TabsTrigger value="automaticas">Automáticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todas">
          <OrdersTable orders={filteredOrders} isLoading={isLoading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>
        
        <TabsContent value="manuales">
          <OrdersTable 
            orders={filteredOrders?.filter(order => order.is_manual)} 
            isLoading={isLoading} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </TabsContent>
        
        <TabsContent value="automaticas">
          <OrdersTable 
            orders={filteredOrders?.filter(order => !order.is_manual)} 
            isLoading={isLoading} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface OrdersTableProps {
  orders?: Order[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const OrdersTable = ({ orders = [], isLoading, searchTerm, setSearchTerm }: OrdersTableProps) => {
  return (
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
              <TableHead>ID</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Cargando órdenes...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No hay órdenes para mostrar
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {order.street} {order.number}
                    {order.int_number && `, Int. ${order.int_number}`}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {order.neighborhood}, {order.postal_code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.is_manual ? "default" : "secondary"}>
                      {order.is_manual ? "Manual" : "Automática"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString('es-MX')}</TableCell>
                  <TableCell>
                    <Badge>Pendiente</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {orders.length} órdenes
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
  );
};

export default OrderList;
