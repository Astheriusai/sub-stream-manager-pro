
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { SignupForm } from '@/components/auth/SignupForm';
import { DatabaseSetupButton } from '@/components/auth/DatabaseSetupButton';

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      setIsSubmitting(true);
      const { error } = await signUp(data.name, data.email, data.password);
      
      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Error de registro',
          description: error.message || 'No se pudo crear la cuenta',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Registro exitoso',
          description: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error durante el registro. Verifica que la base de datos esté configurada correctamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary/10 to-secondary/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Regístrate para comenzar a usar Sub-Stream Manager Pro
          </CardDescription>
          <DatabaseSetupButton />
        </CardHeader>
        <CardContent>
          <SignupForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
