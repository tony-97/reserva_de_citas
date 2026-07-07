import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, User, Lock } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'El identificador es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role === 'PACIENTE') navigate('/paciente/mis-citas', { replace: true });
    else if (user.role === 'MEDICO') navigate('/medico/dashboard', { replace: true });
    else if (user.role === 'ADMIN') navigate('/admin', { replace: true });
  }, [user, authLoading, navigate]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmitForm = async (data: LoginForm) => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      await login(data.identifier, data.password);
      // El ruteo ahora se puede manejar leyendo el rol del contexto (o recargando), 
      // pero como login setea el state inmediatamente, el ProtectedRoute o la app nos llevará.
      // Sin embargo, para forzar el UX rápido:
      const userStr = localStorage.getItem('hospital_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'PACIENTE') navigate('/paciente/mis-citas');
        else if (user.role === 'MEDICO') navigate('/medico/dashboard');
        else if (user.role === 'ADMIN') navigate('/admin');
      }
    } catch (err: any) {
      setGlobalError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-50 p-4 rounded-full text-primary-600">
              <ShieldCheck size={48} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Acceso Seguro</h2>
          <p className="mt-2 text-slate-500 font-light">
            Ingrese sus credenciales para acceder al sistema
          </p>
        </div>

        {globalError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            <p>{globalError}</p>
            {globalError.includes('encontrado') && (
              <Button type="button" variant="outline" size="sm" onClick={() => navigate('/registro')} className="mt-3 w-full text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300">
                Crear cuenta nueva ahora
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <Input
            label="DNI, Correo o Colegiatura"
            placeholder="Ingrese su identificador"
            {...register('identifier')}
            error={errors.identifier?.message}
            icon={<User size={20} />}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            icon={<Lock size={20} />}
          />

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full text-lg shadow-xl shadow-secondary-500/20" disabled={isSubmitting}>
              {isSubmitting ? 'Verificando...' : 'Ingresar al Portal'}
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-slate-500">
              ¿Aún no eres paciente del hospital?{' '}
              <button type="button" onClick={() => navigate('/registro')} className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-2 underline-offset-4">
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
