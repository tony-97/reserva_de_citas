import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '../../components/ui';
import { CheckCircle2, Printer, ArrowLeft, Receipt, Activity, FileText } from 'lucide-react';

interface ComprobanteData {
  transaccionId: string;
  citaId: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  monto: string;
  metodoPago: string;
  estadoPago: string;
}

interface CitaData {
  id: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  dni?: string;
}

export function ComprobantePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [comprobanteData, setComprobanteData] = useState<ComprobanteData | null>(null);
  const [citaData, setCitaData] = useState<CitaData | null>(null);
  const [tipoPaciente, setTipoPaciente] = useState<'SIS' | 'DEMANDA'>('SIS');
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (location.state?.comprobante) {
      setComprobanteData(location.state.comprobante);
      setTipoPaciente('DEMANDA');
    } else if (location.state?.cita) {
      const rawCita = location.state.cita;

      // Mapeo seguro de campos para que si vienen como objetos de Prisma no rompan React
      const nombreCompleto = typeof rawCita.paciente === 'object' && rawCita.paciente !== null
        ? `${rawCita.paciente.nombres || ''} ${rawCita.paciente.apellidos || ''}`.trim()
        : String(rawCita.paciente || '');

      const medicoCompleto = typeof rawCita.medico === 'object' && rawCita.medico !== null
        ? `${rawCita.medico.nombres || ''} ${rawCita.medico.apellidos || ''}`.trim()
        : String(rawCita.medico || '');

      const especialidadNombre = typeof rawCita.especialidad === 'object' && rawCita.especialidad !== null
        ? String(rawCita.especialidad.nombre || '')
        : String(rawCita.especialidad || '');

      const dniPaciente = typeof rawCita.paciente === 'object' && rawCita.paciente !== null
        ? rawCita.paciente.dni
        : rawCita.dni;

      setCitaData({
        ...rawCita,
        paciente: nombreCompleto,
        medico: medicoCompleto,
        especialidad: especialidadNombre,
        dni: dniPaciente || 'No registrado'
      });
      
      setTipoPaciente(location.state.tipoPaciente || 'SIS');
    }
  }, [location.state]);

  const metodoLabel: Record<string, string> = {
    tarjeta: 'Tarjeta de Crédito/Débito',
    whatsapp: 'Yape / Plin (WhatsApp)',
    recepcion: 'Pago en Recepción',
  };

  if (!comprobanteData && !citaData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Comprobante no disponible</h2>
        <p className="text-slate-500 mb-6">No se encontró información de la cita.</p>
        <Button onClick={() => navigate('/reservar')}>Reservar una Cita</Button>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`comprobante-${comprobanteData?.transaccionId || citaData?.id}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/paciente/mis-citas')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Volver a Mis Citas
      </button>

      <div ref={printRef} className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header según tipo de paciente */}
        {tipoPaciente === 'SIS' ? (
          <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-4">
                <Activity size={80} />
              </div>
              <div className="absolute bottom-4 right-4">
                <Activity size={80} />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Activity size={40} className="text-primary-400" />
                <div className="text-left">
                  <h1 className="text-xl font-bold tracking-tight">Hospital San Juan de Lurigancho</h1>
                  <p className="text-secondary-200 text-sm">Ministerio de Salud - MINSA</p>
                </div>
              </div>
              <div className="border-t border-secondary-600 pt-4 mt-4">
                <p className="text-lg font-semibold">Ticket Oficial de Cita Médica</p>
                <p className="text-secondary-200 text-sm mt-1">Seguro Integral de Salud (SIS)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">¡Pago Exitoso!</h1>
            <p className="text-green-100">Tu cita ha sido confirmada y pagada.</p>
          </div>
        )}

        <div className="p-8">
          {/* Sección de identificación */}
          {tipoPaciente === 'SIS' ? (
            <>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2.5 bg-green-50 rounded-xl">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estado de Reserva</p>
                  <p className="text-lg font-bold text-green-600">Confirmada</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2.5 bg-primary-50 rounded-xl">
                  <FileText size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Número de Cita</p>
                  <p className="text-lg font-mono font-bold text-slate-900">#{citaData?.id}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="p-2.5 bg-primary-50 rounded-xl">
                <Receipt size={24} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Comprobante de Pago</p>
                <p className="text-lg font-mono font-bold text-slate-900">{comprobanteData?.transaccionId}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {tipoPaciente === 'SIS' ? (
              [
                { label: 'Paciente', value: citaData?.paciente },
                { label: 'DNI', value: citaData?.dni || 'No registrado' },
                { label: 'Médico', value: citaData?.medico },
                { label: 'Especialidad', value: citaData?.especialidad },
                { label: 'Fecha de Cita', value: citaData?.fecha },
                { label: 'Hora', value: citaData?.hora },
              ].filter(item => item.value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
              ))
            ) : (
              [
                { label: 'Paciente', value: comprobanteData?.paciente },
                { label: 'Médico', value: comprobanteData?.medico },
                { label: 'Especialidad', value: comprobanteData?.especialidad },
                { label: 'Fecha de Cita', value: comprobanteData?.fecha },
                { label: 'Hora', value: comprobanteData?.hora },
                { label: 'Método de Pago', value: metodoLabel[comprobanteData?.metodoPago || ''] || comprobanteData?.metodoPago },
                { label: 'Estado', value: 'Pagado' },
              ].filter(item => item.value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
              ))
            )}
          </div>

          {/* Sección de pago solo para DEMANDA */}
          {tipoPaciente === 'DEMANDA' && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex justify-between items-center mb-8">
              <span className="text-lg font-semibold text-slate-700">Total Pagado</span>
              <span className="text-3xl font-bold text-green-600">S/ {comprobanteData?.monto}</span>
            </div>
          )}

          {/* Mensaje para SIS */}
          {tipoPaciente === 'SIS' && (
            <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 mb-8">
              <p className="text-sm text-primary-800 font-medium text-center">
                Presente este ticket el día de su cita. La reserva es gratuita gracias al Seguro Integral de Salud (SIS).
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              onClick={handleDownloadPDF}
              variant="secondary"
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Printer size={18} /> {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </Button>
            <Button
              onClick={() => navigate('/paciente/mis-citas')}
              className="flex-1"
            >
              Ir a Mis Citas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}