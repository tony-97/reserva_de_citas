import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeroVisual } from '../components/layout/HeroVisual';
import { Activity, Heart, ShieldPlus, Users, Clock, PhoneCall, MapPin, Award } from 'lucide-react';
import { Button, Modal } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);

  const specialties = [
    { 
      id: 1, 
      icon: <ShieldPlus size={40} className="text-primary-500" />, 
      title: "Pediatría", 
      color: "bg-white border-primary-100", 
      shadow: "shadow-primary-500/10 hover:shadow-primary-500/30",
      desc: "Atención integral para el bienestar y desarrollo de tus hijos, desde recién nacidos hasta adolescentes."
    },
    { 
      id: 2, 
      icon: <Heart size={40} className="text-red-500" />, 
      title: "Cardiología", 
      color: "bg-white border-red-100", 
      shadow: "shadow-red-500/10 hover:shadow-red-500/30",
      desc: "Diagnóstico y tratamiento avanzado de enfermedades del corazón con la mejor tecnología."
    },
    { 
      id: 3, 
      icon: <Activity size={40} className="text-purple-500" />, 
      title: "Odontología", 
      color: "bg-white border-purple-100", 
      shadow: "shadow-purple-500/10 hover:shadow-purple-500/30",
      desc: "Cuidamos tu sonrisa con servicios de odontología general, ortodoncia y estética dental."
    },
    { 
      id: 4, 
      icon: <Users size={40} className="text-emerald-500" />, 
      title: "Ginecología", 
      color: "bg-white border-emerald-100", 
      shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/30",
      desc: "Cuidado especializado para la salud de la mujer en todas las etapas de su vida, incluyendo maternidad."
    },
  ];

  const features = [
    { icon: <Clock size={32} className="text-primary-500" />, title: "Atención 24/7", desc: "Emergencias y hospitalización disponibles en todo momento." },
    { icon: <Award size={32} className="text-secondary-500" />, title: "Staff Altamente Calificado", desc: "Los mejores especialistas médicos de la región a tu servicio." },
    { icon: <ShieldPlus size={32} className="text-emerald-500" />, title: "Tecnología de Punta", desc: "Equipos modernos para diagnósticos precisos y rápidos." },
  ];

  const handleSpecialtyClick = (spec: any) => {
    setSelectedSpecialty(spec);
  };

  const handleReserve = () => {
    // Si hay sesión, el ProtectedRoute lo deja pasar. Si no, lo manda a login.
    navigate('/reservar');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <HeroVisual />

      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-40">
          <div className="bg-white border border-primary-100 shadow-lg rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-secondary-900 font-medium">
              Bienvenido, <span className="text-primary-600">{user.nombre}</span>
            </p>
            {user.role === 'PACIENTE' && (
              <Button size="sm" onClick={() => navigate('/reservar')}>Ir a reservar cita</Button>
            )}
          </div>
        </div>
      )}

      {/* Specialties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((spec, i) => (
            <motion.div
              key={spec.id}
              onClick={() => handleSpecialtyClick(spec)}
              className={`${spec.color} ${spec.shadow} shadow-lg rounded-3xl p-8 border-2 text-center cursor-pointer group flex flex-col items-center justify-center transition-all`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform bg-slate-50 p-4 rounded-2xl">
                {spec.icon}
              </div>
              <h3 className="text-xl font-bold text-secondary-900 tracking-wide">{spec.title}</h3>
              <p className="text-slate-500 text-sm mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver información &rarr;</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-4 tracking-tight">¿Por qué elegir Hospital San Juan?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light">
              Nuestra misión es brindarte atención médica de excelencia, combinando calidez humana y tecnología avanzada.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center group cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: { duration: 0.2 } }}
              >
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feat.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Support / Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary-700/50 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Estamos aquí para ayudarte</h2>
              <p className="text-secondary-100 text-lg font-light mb-8 leading-relaxed">
                Si tienes dudas sobre cómo agendar tu cita, nuestras especialidades o necesitas asistencia inmediata, nuestro equipo de soporte está listo para orientarte.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary-700/50 p-3 rounded-full"><PhoneCall className="text-primary-400" /></div>
                  <div>
                    <p className="text-sm text-secondary-200">Central Telefónica</p>
                    <p className="text-lg font-semibold">(01) 555-1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-secondary-700/50 p-3 rounded-full"><MapPin className="text-primary-400" /></div>
                  <div>
                    <p className="text-sm text-secondary-200">Ubicación Principal</p>
                    <p className="text-lg font-semibold">Av. Canto Grande 123, SJL</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-primary-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">¿Primera vez con nosotros?</h3>
              <p className="text-slate-500 mb-8 font-light">
                Crea tu cuenta de paciente en minutos y accede a todo tu historial médico de forma digital y segura.
              </p>
              <Button size="lg" className="w-full text-lg shadow-xl shadow-primary-500/20" onClick={() => navigate('/registro')}>
                Crear cuenta ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Specialty Info Modal */}
      <Modal
        isOpen={!!selectedSpecialty}
        onClose={() => setSelectedSpecialty(null)}
        title={selectedSpecialty ? `Especialidad: ${selectedSpecialty.title}` : ''}
        confirmText="Reservar Cita"
        cancelText="Cerrar"
        onConfirm={handleReserve}
      >
        {selectedSpecialty && (
          <div className="py-4 text-center">
            <div className={`${selectedSpecialty.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
              {selectedSpecialty.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">{selectedSpecialty.title}</h4>
            <p className="text-slate-600 leading-relaxed mb-6">
              {selectedSpecialty.desc}
            </p>
            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl text-left">
              <span className="font-semibold">Nota:</span> Si no tienes una cuenta registrada, serás redirigido al panel de inicio de sesión antes de realizar tu reserva.
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
