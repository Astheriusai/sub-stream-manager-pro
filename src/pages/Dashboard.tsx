
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { SquareArrowUpRight, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Tv, CircleAlert } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

// Sample data for charts
const salesData = [
  { name: 'Ene', total: 1200 },
  { name: 'Feb', total: 1900 },
  { name: 'Mar', total: 1500 },
  { name: 'Abr', total: 1700 },
  { name: 'May', total: 2200 },
  { name: 'Jun', total: 2800 },
  { name: 'Jul', total: 2400 },
  { name: 'Ago', total: 2900 },
  { name: 'Sep', total: 3300 },
  { name: 'Oct', total: 3500 },
  { name: 'Nov', total: 3800 },
  { name: 'Dic', total: 4200 },
];

const productData = [
  { name: 'Netflix', value: 35 },
  { name: 'Disney+', value: 25 },
  { name: 'Prime Video', value: 20 },
  { name: 'HBO Max', value: 15 },
  { name: 'Apple TV+', value: 5 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];

const recentSales = [
  {
    id: '1',
    customer: 'Juan Pérez',
    product: 'Netflix Premium',
    date: '2023-04-15',
    amount: 15.99,
    status: 'active',
  },
  {
    id: '2',
    customer: 'María García',
    product: 'Disney+ Premium',
    date: '2023-04-14',
    amount: 10.99,
    status: 'active',
  },
  {
    id: '3',
    customer: 'Carlos López',
    product: 'HBO Max',
    date: '2023-04-13',
    amount: 12.99,
    status: 'active',
  },
  {
    id: '4',
    customer: 'Ana Martínez',
    product: 'Prime Video',
    date: '2023-04-12',
    amount: 8.99,
    status: 'expiring_soon',
  },
  {
    id: '5',
    customer: 'Roberto Sánchez',
    product: 'Netflix Estándar',
    date: '2023-04-11',
    amount: 13.99,
    status: 'expired',
  },
];

const expiringAccounts = [
  {
    id: '1',
    customer: 'Ana Martínez',
    product: 'Prime Video',
    expirationDate: '2023-04-20',
    daysLeft: 3,
  },
  {
    id: '2',
    customer: 'Pedro Ramírez',
    product: 'Netflix Premium',
    expirationDate: '2023-04-19',
    daysLeft: 2,
  },
  {
    id: '3',
    customer: 'Laura Torres',
    product: 'Disney+',
    expirationDate: '2023-04-18',
    daysLeft: 1,
  },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  
  // Cards data
  const cards = [
    {
      title: 'Ventas Totales',
      value: formatCurrency(42500),
      description: 'Último mes',
      icon: DollarSign,
      change: 12.5,
      trend: 'up',
    },
    {
      title: 'Costos',
      value: formatCurrency(18200),
      description: 'Último mes',
      icon: TrendingDown,
      change: 7.2,
      trend: 'down',
    },
    {
      title: 'Beneficio',
      value: formatCurrency(24300),
      description: 'Último mes',
      icon: TrendingUp,
      change: 16.8,
      trend: 'up',
    },
    {
      title: 'Clientes Activos',
      value: '145',
      description: 'Total',
      icon: Users,
      change: 5.3,
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen del rendimiento de tu negocio
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
              <div className="flex items-center mt-2">
                {card.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {card.change}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Sales Chart */}
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center">
                <div className="flex-1">
                  <CardTitle>Ventas</CardTitle>
                  <CardDescription>
                    Ventas totales en el último año
                  </CardDescription>
                </div>
                <div>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border rounded p-1 text-xs"
                  >
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => 
                          value === 0 ? '0' : `$${value / 1000}k`
                        }
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), 'Ventas']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorUv)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Popular Products */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Productos Populares</CardTitle>
                <CardDescription>
                  Distribución de ventas por producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Sales Table */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>
                  Últimas 5 ventas realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.customer}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.product}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(sale.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(sale.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Expiring Accounts */}
            <Card className="col-span-3">
              <CardHeader className="pb-3">
                <CardTitle>Cuentas por Vencer</CardTitle>
                <CardDescription>
                  Cuentas que vencen en los próximos días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiringAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <CircleAlert className={`h-5 w-5 ${account.daysLeft <= 1 ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                          <p className="text-sm font-medium">{account.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            {account.product}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Vence en {account.daysLeft} día{account.daysLeft !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(account.expirationDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado</CardTitle>
              <CardDescription>
                Tendencias y métricas avanzadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contenido de analíticas detalladas aquí...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>
                Genera y descarga reportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contenido de reportes aquí...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
