
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Bell, ChevronDown, ChevronUp, Building2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import BuildingSelector from '@/components/BuildingSelector';
import CondominiumSelector from '@/components/CondominiumSelector';

interface Notification {
  id: number;
  type: 'warning' | 'info' | 'success';
  message: string;
  priority: 'alta' | 'media' | 'baja';
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const { selectedBuilding, selectedCondominium, buildings, selectBuilding, selectCondominium } = useAuth();
  const [showBuildingSelector, setShowBuildingSelector] = useState(false);
  const [showCondominiumSelector, setShowCondominiumSelector] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'warning', message: '3 propietarios con pagos atrasados', priority: 'alta' },
    { id: 2, type: 'info', message: 'Mantenimiento programado para el 15/12', priority: 'media' },
    { id: 3, type: 'success', message: 'Pago de gastos comunes procesado', priority: 'baja' },
  ]);
  const [notificationsCollapsed, setNotificationsCollapsed] = useState(false);

  const metrics = [
    { title: 'Morosidad', value: '12%', change: '-2%', type: 'negative' },
    { title: 'Ingresos del Mes', value: '$45,200', change: '+8%', type: 'positive' },
    { title: 'Gastos Pendientes', value: '$8,500', change: '0%', type: 'neutral' },
    { title: 'Unidades al Día', value: '88%', change: '+5%', type: 'positive' },
  ];

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada correctamente",
    });
  };

  const toggleNotifications = () => {
    setNotificationsCollapsed(!notificationsCollapsed);
  };

  const handleBuildingChange = () => {
    // Reset selections and start with condominium selection
    selectCondominium(null as any);
    selectBuilding(null as any);
    setShowCondominiumSelector(true);
    setShowBuildingSelector(false);
  };

  const handleCondominiumSelected = () => {
    setShowCondominiumSelector(false);
    setShowBuildingSelector(true);
  };

  const handleBuildingSelected = () => {
    setShowBuildingSelector(false);
    setShowCondominiumSelector(false);
    toast({
      title: "Edificio seleccionado",
      description: `Ahora estás gestionando ${selectedBuilding?.name}`,
    });
  };

  if (showCondominiumSelector) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-codomi-navy">Panel de Control</h1>
          <Badge variant="outline" className="text-sm">
            Administrador
          </Badge>
        </div>
        <CondominiumSelector onSelect={handleCondominiumSelected} />
      </div>
    );
  }

  if (showBuildingSelector) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-codomi-navy">Panel de Control</h1>
          <Badge variant="outline" className="text-sm">
            Administrador
          </Badge>
        </div>
        <BuildingSelector onSelect={handleBuildingSelected} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-codomi-navy">Panel de Control</h1>
          {selectedBuilding && (
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-codomi-navy" />
              <span className="text-base md:text-lg font-medium text-codomi-navy">{selectedBuilding.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBuildingChange}
            className="flex items-center gap-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Cambiar Edificio
          </Button>
          <Badge variant="outline" className="text-sm">
            Administrador
          </Badge>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-codomi-navy" />
            <h2 className="text-xl font-semibold text-codomi-navy">Notificaciones</h2>
            <Badge variant="secondary" className="text-xs">
              {notifications.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNotifications}
            className="p-2 h-8 w-8 text-codomi-navy hover:bg-codomi-gray"
          >
            {notificationsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {!notificationsCollapsed && (
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Alert key={notification.id} className="border-l-4 border-l-codomi-navy">
                  <AlertDescription className="flex justify-between items-center">
                    <span className="flex-1">{notification.message}</span>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge 
                        variant={notification.priority === 'alta' ? 'destructive' : 'secondary'}
                        className="text-xs flex-shrink-0"
                      >
                        {notification.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Eliminar notificación"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-base font-medium">No hay notificaciones pendientes</p>
                <p className="text-sm text-gray-400 mt-1">Las nuevas notificaciones aparecerán aquí</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">
                {metric.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-codomi-navy">
                {metric.value}
              </div>
              <div className={`text-sm flex items-center mt-1 ${
                metric.type === 'positive' ? 'text-green-600' :
                metric.type === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change} vs mes anterior
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-codomi-navy">Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { owner: 'María López', apt: 'Apt 201', amount: '$420', type: 'Pago', date: '10/12/2024' },
              { owner: 'Juan Pérez', apt: 'Apt 305', amount: '$380', type: 'Pago', date: '09/12/2024' },
              { owner: 'Ana Martínez', apt: 'Apt 102', amount: '$420', type: 'Pago', date: '08/12/2024' },
            ].map((transaction, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">{transaction.owner}</p>
                  <p className="text-sm text-gray-600">{transaction.apt}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
