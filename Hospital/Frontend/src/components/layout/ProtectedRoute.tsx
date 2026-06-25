import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-slate-500">Cargando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirigir a su portal correspondiente
    switch(user.role) {
      case 'PACIENTE': return <Navigate to="/paciente/mis-citas" replace />;
      case 'MEDICO': return <Navigate to="/medico/dashboard" replace />;
      case 'ADMIN': return <Navigate to="/admin" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
