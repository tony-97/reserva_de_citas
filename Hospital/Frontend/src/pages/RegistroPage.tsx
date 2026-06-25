import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { api } from '@/api/endpoints';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, User, CreditCard, Phone, Mail } from 'lucide-react';

const registroSchema = z.object({
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  dni: z.string().length(8, 'El DNI debe tener exactamente 8 dígitos').regex(/^\d+$/, 'El DNI solo debe contener números'),
  telefono: z.string().min(6, 'Teléfono inválido'),
  correo: z.string().email('Ingrese un correo electrónico válido')
});

type RegistroForm = z.infer<typeof registroSchema>;

export function RegistroPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegistroForm>({
    resolver: zodResolver(registroSchema)
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmitForm = async (data: RegistroForm) => {

    setIsLoading(true);
    setApiError(null);
    try {
      await api.pacientes.create(data);
      // Auto-login con el DNI recién registrado (usará default password 123456)
      await login(data.dni, '123456');
      navigate('/reservar');
    } catch (err: any) {
      setApiError(err.message || 'Ocurrió un error al registrar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-50 p-4 rounded-full text-primary-600">
              <UserPlus size={48} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Crear Cuenta</h2>
          <p className="mt-2 text-slate-500 font-light text-lg">
            Regístrate para acceder al Portal del Paciente y reservar tus citas.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Nombres"
              {...register('nombres')}
              error={errors.nombres?.message}
              placeholder="Tus nombres"
              icon={<User size={20} />}
            />
            <Input
              label="Apellidos"
              {...register('apellidos')}
              error={errors.apellidos?.message}
              placeholder="Tus apellidos"
              icon={<User size={20} />}
            />
          </div>
          
          <Input
            label="DNI"
            {...register('dni')}
            error={errors.dni?.message}
            placeholder="12345678"
            icon={<CreditCard size={20} />}
          />
          
          <Input
            label="Teléfono Celular"
            type="tel"
            {...register('telefono')}
            error={errors.telefono?.message}
            placeholder="987654321"
            icon={<Phone size={20} />}
          />
          
          <Input
            label="Correo Electrónico"
            type="email"
            {...register('correo')}
            error={errors.correo?.message}
            placeholder="correo@ejemplo.com"
            icon={<Mail size={20} />}
          />

          <div className="pt-6">
            <Button type="submit" size="lg" className="w-full text-lg shadow-xl shadow-secondary-500/20" disabled={isLoading}>
              {isLoading ? 'Registrando cuenta...' : 'Registrarme y Continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
