
import { useState } from 'react';
import { DatabaseZap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { setupDatabase } from '@/lib/db-setup';

export function DatabaseSetupButton() {
  const [isSettingUpDb, setIsSettingUpDb] = useState(false);
  const { toast } = useToast();

  const handleDatabaseSetup = async () => {
    try {
      setIsSettingUpDb(true);
      const result = await setupDatabase();
      
      if (result.success) {
        toast({
          title: 'Base de datos configurada',
          description: 'Las tablas han sido creadas correctamente.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Database setup error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo configurar la base de datos',
        variant: 'destructive',
      });
    } finally {
      setIsSettingUpDb(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleDatabaseSetup}
      disabled={isSettingUpDb}
    >
      <DatabaseZap className="mr-2 h-4 w-4" />
      {isSettingUpDb ? 'Configurando...' : 'Configurar base de datos'}
    </Button>
  );
}
