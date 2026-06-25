import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-secondary-500 text-3xl font-light transition-transform group-hover:scale-110">+</span>
              <span className="font-bold text-xl text-secondary-900 tracking-tight hidden sm:block">Hospital San Juan</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {!user && (
              <>
                <Link to="/" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Inicio</Link>
                <Link to="/registro" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Registrarse</Link>
                <Link to="/login" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Ingresar</Link>
                <Link to="/reservar" className="bg-secondary-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-secondary-600 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Reservar Cita
                </Link>
              </>
            )}

            {user?.role === 'PACIENTE' && (
              <>
                <Link to="/reservar" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Reservar Cita</Link>
                <Link to="/paciente/mis-citas" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Mis Citas</Link>
              </>
            )}

            {user?.role === 'MEDICO' && (
              <Link to="/medico/dashboard" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Mi Dashboard</Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-slate-600 hover:text-secondary-500 font-medium transition-colors">Administración</Link>
            )}

            {user && (
              <div className="flex items-center gap-4 ml-4 border-l pl-6 border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                    <UserIcon size={18} />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{user.nombre}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-slate-500 font-medium hover:text-red-600 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                  <span>Salir</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-lg absolute w-full left-0">
          {!user && (
            <div className="flex flex-col gap-4 mt-2">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="text-slate-600 font-medium block">Inicio</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/registro" className="text-slate-600 font-medium block">Registrarse</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="text-slate-600 font-medium block">Ingresar</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/reservar" className="bg-secondary-500 text-white px-5 py-3 rounded-xl font-medium text-center mt-2">
                Reservar Cita
              </Link>
            </div>
          )}
          {user && (
            <div className="flex flex-col gap-4 mt-2">
              {user.role === 'PACIENTE' && (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/reservar" className="text-slate-600 font-medium block">Reservar Cita</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/paciente/mis-citas" className="text-slate-600 font-medium block">Mis Citas</Link>
                </>
              )}
              {user.role === 'MEDICO' && <Link onClick={() => setIsMobileMenuOpen(false)} to="/medico/dashboard" className="text-slate-600 font-medium block">Mi Dashboard</Link>}
              {user.role === 'ADMIN' && <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="text-slate-600 font-medium block">Administración</Link>}
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon size={18} className="text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">{user.nombre}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 font-medium">
                  <LogOut size={18} /> Salir
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
