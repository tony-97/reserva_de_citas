import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Dropdown, TimeSlotGrid, Button, useToast } from '../../components/ui';
import type { TimeSlot } from '../../components/ui/TimeSlotGrid';
import { PaymentModal } from '../../components/PaymentModal';
import { api } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, Clock, Stethoscope, CheckCircle2, User, IdCard, Shield } from 'lucide-react';

export function ReservarCitaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [especialidades, setEspecialidades] = useState<{value: string, label: string}[]>([]);
  const [medicos, setMedicos] = useState<{value: string, label: string}[]>([]);

  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoPaciente, setTipoPaciente] = useState<'SIS' | 'DEMANDA'>('SIS');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [citaCreadaId, setCitaCreadaId] = useState<number | null>(null);

  const today = new Date();

  useEffect(() => {
    api.especialidades.list()
      .then((data: any[]) => setEspecialidades(data.map(e => ({ value: e.id.toString(), label: e.nombre }))))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!especialidadId) {
      setMedicos([]);
      setMedicoId('');
      return;
    }
    api.medicos.list(Number(especialidadId))
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res.data || []);
        setMedicos(list.map((m: any) => ({ value: m.id.toString(), label: m.nombre })));
      })
      .catch(err => console.error(err));
  }, [especialidadId]);

  useEffect(() => {
    if (!medicoId || !fecha) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    const fechaStr = fecha.toISOString().split('T')[0];
    api.turnos.disponibles(Number(medicoId), fechaStr)
      .then((data: any) => {
        const mapped: TimeSlot[] = data.slots.map((s: string, i: number) => ({
          id: `slot-${i}`,
          time: s,
          available: true
        }));
        setSlots(mapped);
        setSelectedSlot(null);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar horarios disponibles');
      });
  }, [medicoId, fecha]);

  const handleDateSelect = (date: Date) => {
    setFecha(date);
    setSelectedSlot(null);
  };

  const handleConfirmReserva = async () => {
    if (!especialidadId || !medicoId || !fecha || !selectedSlot) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const slot = slots.find(s => s.id === selectedSlot);
      const resp = await api.citas.create({
        pacienteId: user!.id,
        medicoId: Number(medicoId),
        especialidadId: Number(especialidadId),
        fecha: fecha.toISOString(),
        hora: slot?.time || '00:00',
        // Si el usuario es SIS solicitamos crear la cita ya confirmada
        ...(tipoPaciente === 'SIS' ? { estado: 'confirmada' } : {})
      });
      
      if (tipoPaciente === 'SIS') {
        setIsSubmitting(false);
        
        // Forzamos un caspeo temporal a 'any' en la lectura para evitar el error de tipado
        const dataResponse = resp as any;
        
        const citaFormateada = {
          ...dataResponse,
          paciente: typeof dataResponse.paciente === 'object' && dataResponse.paciente !== null
            ? `${dataResponse.paciente.nombres || ''} ${dataResponse.paciente.apellidos || ''}`.trim()
            : dataResponse.paciente || user!.nombre,
          dni: dataResponse?.paciente?.dni || user?.dni || 'No registrado'
        };

        navigate('/paciente/comprobante', { state: { cita: citaFormateada, tipoPaciente } });
        // Mostrar toast de éxito
        toast('Cita creada correctamente (o ya existente).', 'success');
      } else {
        setCitaCreadaId((resp as any).id);
        setIsSubmitting(false);
        setIsPaymentModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cita');
      toast(err.message || 'Error al crear la cita', 'error');
      setIsSubmitting(false);
    }
  };
  const handlePaymentSuccess = async (metodoPago: string) => {
    if (!citaCreadaId) return;
    setIsSubmitting(true);
    try {
      const resp = await api.pagos.checkout({ citaId: citaCreadaId, metodoPago });
      setIsPaymentModalOpen(false);
      navigate('/paciente/comprobante', { state: { comprobante: resp.comprobante, tipoPaciente } });
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = especialidadId && medicoId && fecha && selectedSlot && !isSubmitting;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight">Reservar Cita Médica</h1>
        <p className="text-slate-500 mt-3 text-lg font-light">Seleccione la especialidad, profesional, fecha y hora de su preferencia.</p>
      </div>

      {user && (
        <div className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <User className="text-primary-500" size={20} />
            Datos del Paciente (Solo Lectura)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
              <User className="text-slate-400" size={20} />
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Nombre Completo</p>
                <p className="font-medium text-slate-900">{user.nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
              <IdCard className="text-slate-400" size={20} />
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">DNI</p>
                <p className="font-medium text-slate-900">{user?.dni || 'No registrado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de tipo de paciente */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          Tipo de Paciente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setTipoPaciente('SIS')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              tipoPaciente === 'SIS'
                ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                tipoPaciente === 'SIS' ? 'border-green-500 bg-green-500' : 'border-slate-300'
              }`}>
                {tipoPaciente === 'SIS' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className={`font-medium block ${tipoPaciente === 'SIS' ? 'text-green-700' : 'text-slate-700'}`}>
                  Seguro Integral de Salud (SIS)
                </span>
                <span className="text-xs text-slate-500">Atención gratuita</span>
              </div>
            </div>
          </button>
          <button
            onClick={() => setTipoPaciente('DEMANDA')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              tipoPaciente === 'DEMANDA'
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                tipoPaciente === 'DEMANDA' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
              }`}>
                {tipoPaciente === 'DEMANDA' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className={`font-medium block ${tipoPaciente === 'DEMANDA' ? 'text-blue-700' : 'text-slate-700'}`}>
                  Paciente por Demanda
                </span>
                <span className="text-xs text-slate-500">Costo: S/ 80.00</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 self-start min-w-0">
          <div className="flex items-center gap-3 font-semibold text-xl border-b border-slate-100 pb-4 mb-6 text-secondary-900">
            <Stethoscope className="text-primary-500" size={28} />
            Especialidad y Médico
          </div>
          
          {/* Tarjetas interactivas de especialidades */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Especialidad</label>
            <div className="grid grid-cols-1 gap-3">
              {especialidades.map((esp) => (
                <button
                  key={esp.value}
                  onClick={() => { setEspecialidadId(esp.value); setMedicoId(''); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    especialidadId === esp.value
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      especialidadId === esp.value ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                    }`}>
                      {especialidadId === esp.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`font-medium ${especialidadId === esp.value ? 'text-primary-700' : 'text-slate-700'}`}>
                      {esp.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Dropdown
              label="Médico Tratante"
              value={medicoId}
              onChange={e => setMedicoId(e.target.value)}
              options={medicos}
              disabled={!especialidadId}
            />
            <p className="text-xs text-slate-500 mt-2 ml-1">
              * Puede elegir su médico de preferencia una vez seleccionada la especialidad.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8 min-w-0">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-10 overflow-hidden">
            <div className="flex-shrink-0 min-w-0">
              <div className="flex items-center gap-3 font-semibold text-xl border-b border-slate-100 pb-4 mb-6 text-secondary-900">
                <CalendarDays className="text-primary-500" size={28} />
                Fecha de la Cita
              </div>
              <Calendar
                selectedDate={fecha}
                onDateSelect={handleDateSelect}
                minDate={today}
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-3 font-semibold text-xl border-b border-slate-100 pb-4 mb-6 text-secondary-900">
                <Clock className="text-primary-500" size={28} />
                Horario Disponible
              </div>
              {!fecha ? (
                <div className="h-48 flex items-center justify-center text-slate-400 py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  Seleccione una fecha en el calendario <br /> para ver los horarios.
                </div>
              ) : (
                <TimeSlotGrid
                  slots={slots}
                  selectedSlotId={selectedSlot}
                  onSlotSelect={setSelectedSlot}
                />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center text-white gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isFormComplete ? 'bg-primary-500' : 'bg-secondary-700'}`}>
                <CheckCircle2 size={32} className={isFormComplete ? 'text-white' : 'text-slate-400'} />
              </div>
              <div>
                <p className="text-secondary-100 font-light">
                  {tipoPaciente === 'SIS' ? 'Reserva Gratuita (SIS)' : 'Costo de Consulta: S/ 80.00'}
                </p>
                <p className="font-semibold text-lg">
                  {tipoPaciente === 'SIS' 
                    ? 'Seleccione el horario para confirmar su cita.' 
                    : 'Seleccione el horario para proceder al pago.'}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleConfirmReserva}
              disabled={!isFormComplete || isSubmitting}
              className={`px-10 py-4 text-lg w-full sm:w-auto ${isFormComplete && !isSubmitting ? 'bg-primary-500 hover:bg-primary-600' : 'bg-secondary-700 text-slate-400'}`}
            >
              {tipoPaciente === 'SIS' ? 'Confirmar Reserva' : 'Continuar al Pago'}
            </Button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setCitaCreadaId(null); }}
        onSuccess={handlePaymentSuccess}
        monto="80.00"
      />
    </div>
  );
}