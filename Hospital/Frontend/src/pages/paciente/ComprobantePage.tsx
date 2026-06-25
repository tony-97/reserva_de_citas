import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '../../components/ui';
import { CheckCircle2, Printer, ArrowLeft, Receipt } from 'lucide-react';

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

export function ComprobantePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<ComprobanteData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (location.state?.comprobante) {
      setData(location.state.comprobante);
    }
  }, [location.state]);

  const metodoLabel: Record<string, string> = {
    tarjeta: 'Tarjeta de Crédito/Débito',
    whatsapp: 'Yape / Plin (WhatsApp)',
    recepcion: 'Pago en Recepción',
  };

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Comprobante no disponible</h2>
        <p className="text-slate-500 mb-6">No se encontró información del pago.</p>
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
      pdf.save(`comprobante-${data.transaccionId}.pdf`);
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
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">¡Pago Exitoso!</h1>
          <p className="text-green-100">Tu cita ha sido confirmada y pagada.</p>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="p-2.5 bg-primary-50 rounded-xl">
              <Receipt size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Comprobante de Pago</p>
              <p className="text-lg font-mono font-bold text-slate-900">{data.transaccionId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Paciente', value: data.paciente },
              { label: 'Médico', value: data.medico },
              { label: 'Especialidad', value: data.especialidad },
              { label: 'Fecha de Cita', value: data.fecha },
              { label: 'Hora', value: data.hora },
              { label: 'Método de Pago', value: metodoLabel[data.metodoPago] || data.metodoPago },
              { label: 'Estado', value: 'Pagado' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex justify-between items-center mb-8">
            <span className="text-lg font-semibold text-slate-700">Total Pagado</span>
            <span className="text-3xl font-bold text-green-600">S/ {data.monto}</span>
          </div>

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