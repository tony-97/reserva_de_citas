import { useState } from 'react';
import { Modal, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await login(identifier, password);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar sesión" confirmText="Ingresar" onConfirm={handleSubmit} cancelText="Volver">
      <div className="space-y-5 py-4">
        {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>}
        <p className="text-sm text-slate-500">Ingresa con tu correo o DNI y contraseña para acceder a tu perfil y reservar tu cita.</p>
        <Input label="Correo o DNI" value={identifier} onChange={(e:any) => setIdentifier(e.target.value)} />
        <Input label="Contraseña" type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} />
        <div className="text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <a href="/registro" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Regístrate aquí
          </a>
        </div>
      </div>
    </Modal>
  );
}
