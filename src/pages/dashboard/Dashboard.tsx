
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { CalendarDays, Package, Truck, UserCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import AlertItem from '@/components/dashboard/AlertItem';

const data = [
  { name: 'Lun', orders: 40, deliveries: 24 },
  { name: 'Mar', orders: 30, deliveries: 28 },
  { name: 'Mie', orders: 20, deliveries: 19 },
  { name: 'Jue', orders: 27, deliveries: 25 },
  { name: 'Vie', orders: 18, deliveries: 15 },
  { name: 'Sab', orders: 23, deliveries: 20 },
  { name: 'Dom', orders: 34, deliveries: 30 },
];

const performanceData = [
  { name: 'Conductor A', entregas: 95, meta: 85 },
  { name: 'Conductor B', entregas: 75, meta: 85 },
  { name: 'Conductor C', entregas: 90, meta: 85 },
  { name: 'Conductor D', entregas: 100, meta: 85 },
  { name: 'Conductor E', entregas: 82, meta: 85 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Órdenes totales"
          value="1,349"
          icon={Package}
          change="+12.5%"
          changeType="positive"
        />
        <StatCard
          title="Entregas completadas"
          value="892"
          icon={Truck}
          change="+8.2%"
          changeType="positive"
        />
        <StatCard
          title="Conductores activos"
          value="18"
          icon={UserCheck}
          change="-2"
          changeType="negative"
        />
        <StatCard
          title="Alertas activas"
          value="5"
          icon={AlertTriangle}
          change="+3"
          changeType="negative"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h2 className="text-lg font-medium mb-3">Órdenes vs Entregas</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stackId="1" stroke="#3b82f6" fill="#93c5fd" />
                <Area type="monotone" dataKey="deliveries" stackId="2" stroke="#059669" fill="#6ee7b7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2 className="text-lg font-medium mb-3">Desempeño de Conductores</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entregas" fill="#3b82f6" />
                <Bar dataKey="meta" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Actividad Reciente</h2>
            <button className="text-primary text-sm hover:underline flex items-center">
              Ver todo <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="divide-y">
            <ActivityItem
              icon={Package}
              title="Nueva orden creada"
              description="Pedido #12458 - Cliente: Comercial XYZ"
              time="Hace 10 min"
              status="default"
            />
            <ActivityItem
              icon={Truck}
              title="Entrega completada"
              description="Pedido #12445 - Entregado por Juan Pérez"
              time="Hace 25 min"
              status="success"
            />
            <ActivityItem
              icon={UserCheck}
              title="Conductor asignado"
              description="María López asignada a Ruta #R-124"
              time="Hace 40 min"
              status="default"
            />
            <ActivityItem
              icon={Package}
              title="Paquete en ruta"
              description="Pedido #12452 - En camino a destino"
              time="Hace 1 hora"
              status="default"
            />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Alertas Activas</h2>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">5 alertas</span>
          </div>
          <div className="divide-y">
            <AlertItem
              title="Retraso en entrega"
              message="Pedido #12449 retrasado por más de 1 hora"
              time="Hace 35 min"
              status="active"
            />
            <AlertItem
              title="Bajo inventario"
              message="Producto SKU-45678 por debajo del nivel mínimo"
              time="Hace 1 hora"
              status="pending"
            />
            <AlertItem
              title="Vehículo detenido"
              message="Unidad VH-003 detenida por más de 30 min"
              time="Hace 50 min"
              status="active"
            />
            <AlertItem
              title="Conductor fuera de ruta"
              message="Conductor ID-78 se ha desviado de la ruta asignada"
              time="Hace 15 min"
              status="active"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
