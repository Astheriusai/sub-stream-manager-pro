
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { setupDatabase } from '@/lib/db-setup';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [isSettingUpDatabase, setIsSettingUpDatabase] = useState(false);
  
  const handleDatabaseSetup = async () => {
    setIsSettingUpDatabase(true);
    try {
      const result = await setupDatabase();
      if (result.success) {
        toast({
          title: 'Base de datos configurada',
          description: result.message,
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al configurar la base de datos',
        variant: 'destructive',
      });
    } finally {
      setIsSettingUpDatabase(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Ajustes generales del sistema e integraciones
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="reminders">Recordatorios</TabsTrigger>
          <TabsTrigger value="database">Base de Datos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Ajustes básicos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                      <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Fecha</Label>
                  <Select defaultValue="DD/MM/YYYY">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Selecciona un formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Selecciona una zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="America/Bogota">Colombia (GMT-5)</SelectItem>
                      <SelectItem value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</SelectItem>
                      <SelectItem value="Europe/Madrid">España (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-4">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Mensajes</CardTitle>
              <CardDescription>
                Configura los mensajes predeterminados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sale-message">Mensaje de Venta</Label>
                <Textarea
                  id="sale-message"
                  placeholder="Mensaje que se enviará al realizar una venta"
                  className="min-h-[100px]"
                  defaultValue="¡Hola! Gracias por tu compra. Aquí están los detalles de tu cuenta:"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder-message">Mensaje de Recordatorio</Label>
                <Textarea
                  id="reminder-message"
                  placeholder="Mensaje que se enviará como recordatorio de vencimiento"
                  className="min-h-[100px]"
                  defaultValue="¡Hola! Te recordamos que tu suscripción está próxima a vencer. Para renovar, por favor contáctanos."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Términos y Condiciones</Label>
                <Textarea
                  id="terms"
                  placeholder="Términos y condiciones que se incluirán en los mensajes"
                  className="min-h-[100px]"
                  defaultValue="Términos y condiciones: El servicio es personal e intransferible. No compartir contraseñas. No cambiar datos de la cuenta."
                />
              </div>
              <Button className="mt-4">Guardar Plantillas</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integración WhatsApp</CardTitle>
              <CardDescription>
                Configura la integración con WhatsApp vía Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <p className="text-center mb-4">
                  Estado: <span className="text-red-500 font-medium">Desconectado</span>
                </p>
                <Button>Conectar WhatsApp</Button>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">
                  Al conectar WhatsApp, podrás enviar mensajes automáticos a tus clientes para recordatorios y envío de datos de cuentas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Recordatorios</CardTitle>
              <CardDescription>
                Configura cuándo se enviarán recordatorios automáticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Días antes del vencimiento para enviar recordatorio:</Label>
                <div className="flex flex-wrap gap-4">
                  {[3, 2, 1, 0].map((days) => (
                    <div key={days} className="flex items-center space-x-2">
                      <Checkbox id={`reminder-${days}`} />
                      <Label htmlFor={`reminder-${days}`}>
                        {days === 0 ? 'El mismo día' : `${days} día${days !== 1 ? 's' : ''}`}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="mt-4">Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Base de Datos</CardTitle>
              <CardDescription>
                Configurar la estructura de la base de datos en Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  Esta acción creará todas las tablas necesarias en tu instancia de Supabase. 
                  Solo es necesario ejecutarla una vez al iniciar el sistema.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800 text-sm">
                  <p className="font-medium">Importante:</p>
                  <p>Esta acción es irreversible y podría sobrescribir datos existentes. 
                  Asegúrate de tener una copia de seguridad antes de continuar.</p>
                </div>
              </div>
              <Button 
                onClick={handleDatabaseSetup} 
                disabled={isSettingUpDatabase}
                className="mt-4"
              >
                {isSettingUpDatabase ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Configurando Base de Datos...
                  </>
                ) : (
                  'Configurar Base de Datos'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
