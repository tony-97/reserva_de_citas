import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Dropdown, TimeSlotGrid, Button } from '../../components/ui';
import type { TimeSlot } from '../../components/ui/TimeSlotGrid';
import { PaymentModal } from '../../components/PaymentModal';
import { api } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';

export function ReservarCitaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [especialidades, setEspecialidades] = useState<{value: string, label: string}[]>([]);
  const [medicos, setMedicos] = useState<{value: string, label: string}[]>([]);

  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      .then((data: any[]) => setMedicos(data.map(m => ({ value: m.id.toString(), label: m.nombre }))))
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

  const initiatePayment = async () => {
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
        hora: slot?.time || '00:00'
      });
      setCitaCreadaId(resp.id);
      setIsSubmitting(false);
      setIsPaymentModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Error al crear la cita');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (metodoPago: string) => {
    if (!citaCreadaId) return;
    setIsSubmitting(true);
    try {
      const resp = await api.pagos.checkout({ citaId: citaCreadaId, metodoPago });
      setIsPaymentModalOpen(false);
      navigate('/paciente/comprobante', { state: { comprobante: resp.comprobante } });
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

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 self-start">
          <div className="flex items-center gap-3 font-semibold text-xl border-b border-slate-100 pb-4 mb-6 text-secondary-900">
            <Stethoscope className="text-primary-500" size={28} />
            Especialidad y Médico
          </div>
          <Dropdown
            label="Especialidad"
            value={especialidadId}
            onChange={e => { setEspecialidadId(e.target.value); setMedicoId(''); }}
            options={especialidades}
          />
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

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0">
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
            <div className="flex-grow">
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
                <p className="text-secondary-100 font-light">Costo de Consulta: S/ 80.00</p>
                <p className="font-semibold text-lg">Seleccione el horario para proceder al pago.</p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={initiatePayment}
              disabled={!isFormComplete || isSubmitting}
              className={`px-10 py-4 text-lg w-full sm:w-auto ${isFormComplete && !isSubmitting ? 'bg-primary-500 hover:bg-primary-600' : 'bg-secondary-700 text-slate-400'}`}
            >
              Continuar al Pago
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