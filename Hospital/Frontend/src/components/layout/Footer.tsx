import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-6 inline-flex">
              <Activity className="text-primary-500" size={32} />
              <span className="font-bold text-2xl text-white tracking-tight">Hospital San Juan</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6 font-light">
              Nuestra prioridad es tu bienestar. Modernizando tu atención médica con tecnología de punta y profesionales de excelencia para ti y toda tu familia.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Información</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">📍</span> Av. Canto Grande 123, SJL
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">📞</span> Central: (01) 555-1234
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">🕒</span> Lunes a Domingo - 24h
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Inicio</Link></li>
              <li><Link to="/registro" className="hover:text-primary-400 transition-colors">Registro de Pacientes</Link></li>
              <li><Link to="/reservar" className="hover:text-primary-400 transition-colors">Reservar Cita</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors">Portal del Paciente</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Hospital San Juan de Lurigancho. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
