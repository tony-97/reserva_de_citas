import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, AlertCircle, CheckCircle2, Smartphone, Building } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (metodoPago: string) => void;
  monto?: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, monto = '80.00' }: PaymentModalProps) {
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'whatsapp' | 'recepcion'>('tarjeta');
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const isFormValid = () => {
    return true; // En el mock seguro, la tarjeta se maneja externamente
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setStep('processing');

    if (metodoPago === 'whatsapp') {
      const text = encodeURIComponent(`Hola, quiero pagar mi cita médica de S/ ${monto} vía Yape/Plin.`);
      window.open(`https://wa.me/51999999999?text=${text}`, '_blank');
      setStep('success');
      setTimeout(() => onSuccess('whatsapp'), 1500);
      return;
    }

    if (metodoPago === 'recepcion') {
      setStep('success');
      setTimeout(() => onSuccess('recepcion'), 1500);
      return;
    }

    // Simulador de pasarela para tarjeta
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess('tarjeta'), 1500);
    }, 2500);
  };

  const reset = () => {
    setStep('form');
    setErrorMsg('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {step === 'form' && (
              <form onSubmit={handleSubmit}>
                <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Pago de Cita Médica</h3>
                    <Lock size={20} className="text-primary-400" />
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-secondary-200 text-sm">Total a pagar</p>
                    <p className="text-3xl font-bold">S/ {monto}</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Método de pago</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'tarjeta' as const, label: 'Tarjeta', icon: CreditCard },
                        { value: 'whatsapp' as const, label: 'Yape/Plin', icon: Smartphone },
                        { value: 'recepcion' as const, label: 'Recepcion', icon: Building },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setMetodoPago(value)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                            metodoPago === value
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Icon size={22} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {metodoPago === 'tarjeta' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={16} className="text-green-600" />
                        <p className="font-semibold text-green-700">Pasarela Segura (Simulación)</p>
                      </div>
                      <p className="mb-0">
                        Por motivos de seguridad, no recolectamos datos de tarjetas directamente.
                        En producción, aquí se abriría el widget seguro de Stripe, Niubiz o Culqi.
                      </p>
                    </div>
                  )}

                  {metodoPago !== 'tarjeta' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                      <p className="font-semibold mb-1">
                        {metodoPago === 'whatsapp' ? 'Pago vía Yape / Plin' : 'Pago en Recepción'}
                      </p>
                      <p>
                        {metodoPago === 'whatsapp'
                          ? 'Serás redirigido a WhatsApp para coordinar el pago. Tu cita se reservará mientras tanto.'
                          : 'Paga en efectivo o tarjeta al llegar a la clínica. Presenta tu DNI.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6 pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed text-lg shadow-lg shadow-primary-200"
                  >
                    {metodoPago === 'tarjeta' ? `Pagar S/ ${monto}` : 'Confirmar Reserva'}
                  </button>
                  <button type="button" onClick={handleClose} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {step === 'processing' && (
              <div className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-6"
                />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Procesando pago...</h3>
                <p className="text-slate-500">Comunicándonos con el banco emisor.</p>
              </div>
            )}

            {step === 'error' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pago Rechazado</h3>
                <p className="text-slate-500 mb-6">{errorMsg}</p>
                <button onClick={reset} className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                  Intentar de nuevo
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={32} className="text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">¡Pago Exitoso!</h3>
                <p className="text-slate-500">Redirigiendo al comprobante...</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}