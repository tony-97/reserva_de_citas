import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-secondary-900 h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/hero-bg.png')",
          backgroundPosition: 'right center'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-secondary-900 via-secondary-900/80 to-transparent" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Tu salud, <br />
            <span className="text-primary-100">nuestra prioridad</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed font-light">
            Hospital San Juan de Lurigancho — Modernizando tu atención médica con tecnología avanzada y profesionales dedicados a tu bienestar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              variant="white"
              onClick={() => navigate('/registro')}
              className="border-none group shadow-xl"
            >
              RESERVAR CITA AHORA
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              Portal del Paciente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
