import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  isDestructive = false
}: ModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <div className="bg-slate-50/95 px-8 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h3 id="modal-title" className="text-xl font-semibold text-slate-900">{title}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-8 py-6 overflow-y-auto text-slate-700">
              {children}
            </div>
            
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-8 py-4 sm:flex-row sm:justify-end">
              <Button variant="outline" size="md" onClick={onClose}>
                {cancelText}
              </Button>
              {onConfirm && (
                <Button 
                  size="md"
                  variant={isDestructive ? 'danger' : 'primary'} 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  {confirmText}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
