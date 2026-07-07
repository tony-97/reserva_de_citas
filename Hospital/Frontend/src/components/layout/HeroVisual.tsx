import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { useState } from 'react';
import { LoginModal } from '@/components/auth/LoginModal';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const }
  }
};

const floatingCardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { delay: 1 + i * 0.25, duration: 0.6, ease: 'easeOut' as const }
  })
};

const cards = [
  { icon: Shield, label: 'Staff Calificado', sub: '+50 especialistas' },
  { icon: Clock, label: 'Atención 24/7', sub: 'Emergencias todo el año' },
  { icon: Award, label: 'Tecnología Moderna', sub: 'Diagnóstico preciso' },
];

export function HeroVisual() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Extraemos 'user' para verificar el estado de autenticación
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Función para manejar el clic en "RESERVAR CITA AHORA"
  const handleBookingClick = () => {
    if (user) navigate('/reservar');
    else setIsLoginOpen(true);
  };

  return (
    <div className="relative bg-secondary-900 min-h-[100dvh] lg:min-h-0 lg:h-[600px] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/cargando.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 z-10 bg-black/10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="max-w-2xl text-white mt-12 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 lg:p-10 border border-white/50 shadow-2xl">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight text-secondary-900"
              variants={itemVariants}
            >
              Tu salud, <br />
              <span className="text-primary-600">nuestra prioridad</span>
            </motion.h1>
            <motion.p
              className="text-base md:text-xl text-slate-700 mb-8 md:mb-10 leading-relaxed font-medium"
              variants={itemVariants}
            >
              Hospital San Juan de Lurigancho — Modernizando tu atención médica con tecnología avanzada y profesionales dedicados a tu bienestar.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button
                size="lg"
                variant="primary"
                onClick={handleBookingClick}
                className="group shadow-xl shadow-primary-500/30"
              >
                RESERVAR CITA AHORA
                <motion.span
                  className="ml-2 inline-flex text-white"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
              {/* Se elimina el botón 'Portal del Paciente' del banner para evitar duplicidad de acción */}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex gap-6 w-full max-w-4xl justify-center">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="backdrop-blur-xl bg-white/80 rounded-2xl px-5 py-3 border border-white/50 flex items-center gap-4 shadow-xl"
              custom={i}
              variants={floatingCardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-2.5 bg-primary-50 rounded-xl">
                <Icon size={20} className="text-primary-600" />
              </div>
              <div className="text-secondary-900">
                <p className="text-sm font-bold">{card.label}</p>
                <p className="text-xs text-slate-500 font-medium">{card.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}